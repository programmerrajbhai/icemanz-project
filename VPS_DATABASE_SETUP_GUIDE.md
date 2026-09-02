# VPS PostgreSQL Database Setup Guide (Bangla)

## Prerequisites (Jar Dorkar Hobe)

### VPS Information:
- VPS IP Address (e.g., `123.45.67.89`)
- SSH Username (usually `root` or `ubuntu`)
- SSH Password or Private Key
- VPS OS: Ubuntu/Debian recommended

### Local Requirements:
- SSH access to VPS
- Terminal/Command line access

---

## Step 1: VPS e SSH Connect Korun

```bash
ssh root@YOUR_VPS_IP
# Or
ssh ubuntu@YOUR_VPS_IP
```

Password ba SSH key diye login korun.

---

## Step 2: System Update Korun

```bash
sudo apt update
sudo apt upgrade -y
```

---

## Step 3: PostgreSQL Install Korun

```bash
# PostgreSQL install
sudo apt install postgresql postgresql-contrib -y

# PostgreSQL service start korun
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check if running
sudo systemctl status postgresql
```

---

## Step 4: PostgreSQL User & Database Create Korun

### Default postgres user e switch korun:
```bash
sudo -i -u postgres
psql
```

### Database & User create korun:
```sql
-- Database create
CREATE DATABASE icemanz_db;

-- User create with strong password
CREATE USER icemanz_user WITH ENCRYPTED PASSWORD 'lkasjfodiu@#$@#$@%@#ASFSdf';

-- User ke database access dan
GRANT ALL PRIVILEGES ON DATABASE icemanz_db TO icemanz_user;

-- Grant schema permissions
\c icemanz_db
GRANT ALL ON SCHEMA public TO icemanz_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO icemanz_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO icemanz_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO icemanz_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO icemanz_user;

-- Exit psql
\q
```

### Postgres user theke logout:
```bash
exit
```

---

## Step 5: PostgreSQL External Connection Allow Korun

### postgresql.conf edit korun:
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Note: Version 14 er jaygay apnar version number hote pare (12, 13, 15, etc.)
```

**Find this line:**
```
#listen_addresses = 'localhost'
```

**Change to:**
```
listen_addresses = '*'
```

Save: `Ctrl + O`, Enter, Exit: `Ctrl + X`

### pg_hba.conf edit korun:
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

**File er last e add korun:**
```
# Allow connections from any IP (production e specific IP use korun)
host    all             all             0.0.0.0/0               md5
```

**Production e specific IP allow korun (recommended):**
```
# Only allow your server IP
host    all             all             YOUR_APP_SERVER_IP/32   md5
```

Save: `Ctrl + O`, Enter, Exit: `Ctrl + X`

### PostgreSQL restart korun:
```bash
sudo systemctl restart postgresql
```

---

## Step 6: Firewall Port Open Korun (PostgreSQL port 5432)

```bash
# UFW firewall use korle:
sudo ufw allow 5432/tcp
sudo ufw reload

# Or specific IP er jonno:
sudo ufw allow from YOUR_APP_SERVER_IP to any port 5432
```

---

## Step 7: Connection Test Korun (Local Machine Theke)

Apnar local machine theke test korun:

```bash
psql -h YOUR_VPS_IP -U icemanz_user -d icemanz_db -p 5432
# Password enter korun: your_strong_password_123
```

Successfully connect hole abar `\q` diye exit korun.

---

## Step 8: DATABASE_URL Create Korun

Format:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE
```

Example (apnar credentials diye replace korun):
```
DATABASE_URL="postgresql://icemanz_user:your_strong_password_123@123.45.67.89:5432/icemanz_db"
DIRECT_URL="postgresql://icemanz_user:your_strong_password_123@123.45.67.89:5432/icemanz_db"
```

---

## Step 9: .env File Update Korun

Apnar project er `.env` file e:

```env
DATABASE_URL="postgresql://icemanz_user:your_strong_password_123@YOUR_VPS_IP:5432/icemanz_db"
DIRECT_URL="postgresql://icemanz_user:your_strong_password_123@YOUR_VPS_IP:5432/icemanz_db"
```

---

## Step 10: Prisma Migration Run Korun

Local machine theke:

```bash
# Prisma client generate
npx prisma generate

# Database push (schema sync)
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

---

## Step 11: Existing Data Import Korun (Optional)

Jodi `cloud_backup.sql` file thake:

```bash
# VPS e upload korun
scp cloud_backup.sql root@YOUR_VPS_IP:/tmp/

# VPS e SSH kore import korun
ssh root@YOUR_VPS_IP
sudo -u postgres psql -d icemanz_db -f /tmp/cloud_backup.sql
```

---

## Security Best Practices (Production)

### 1. Strong Password Use Korun:
```bash
# Password generate korun
openssl rand -base64 32
```

### 2. Specific IP Allow Korun (pg_hba.conf):
```
host    icemanz_db      icemanz_user    YOUR_APP_IP/32    md5
```

### 3. SSL Certificate Setup (Advanced):
```bash
# Self-signed certificate create
sudo -u postgres openssl req -new -x509 -days 365 -nodes -text \
  -out /var/lib/postgresql/14/main/server.crt \
  -keyout /var/lib/postgresql/14/main/server.key
sudo chmod og-rwx /var/lib/postgresql/14/main/server.key
```

postgresql.conf e add:
```
ssl = on
ssl_cert_file = '/var/lib/postgresql/14/main/server.crt'
ssl_key_file = '/var/lib/postgresql/14/main/server.key'
```

DATABASE_URL e SSL add:
```
postgresql://icemanz_user:password@host:5432/icemanz_db?sslmode=require
```

### 4. Firewall Restrict Korun:
```bash
# Only specific IP allow
sudo ufw delete allow 5432/tcp
sudo ufw allow from YOUR_APP_IP to any port 5432
```

### 5. Automated Backup Setup:
```bash
# Daily backup script
sudo nano /usr/local/bin/backup-postgres.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump icemanz_db > $BACKUP_DIR/icemanz_db_$TIMESTAMP.sql
# Keep only last 7 days backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-postgres.sh

# Cron job add korun (daily 2 AM)
sudo crontab -e
# Add line:
0 2 * * * /usr/local/bin/backup-postgres.sh
```

---

## Troubleshooting

### Connection refused error:
```bash
# PostgreSQL running ache check korun
sudo systemctl status postgresql

# Port listening check
sudo netstat -plnt | grep 5432

# Firewall check
sudo ufw status
```

### Authentication failed error:
```bash
# pg_hba.conf check korun
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Make sure md5 authentication enabled

# PostgreSQL restart
sudo systemctl restart postgresql
```

### Permission denied error:
```bash
# User permissions re-grant
sudo -u postgres psql
\c icemanz_db
GRANT ALL PRIVILEGES ON DATABASE icemanz_db TO icemanz_user;
GRANT ALL ON SCHEMA public TO icemanz_user;
```

---

## Quick Command Reference

```bash
# PostgreSQL status
sudo systemctl status postgresql

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Connect to database
sudo -u postgres psql -d icemanz_db

# List all databases
sudo -u postgres psql -l

# Database size check
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('icemanz_db'));"

# Active connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

---

## Next Steps

1. VPS credentials ready rakun
2. Ei guide follow kore step by step setup korun
3. Connection test korun
4. `.env` update korun
5. Prisma migration run korun
6. Application test korun

Kono step e problem hole screenshot/error message pathaben!
