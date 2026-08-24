# 🔧 Admin Login Troubleshooting Guide

## Current Status

✅ Admin user created in database  
✅ Password encrypted with bcrypt  
✅ Identity record created  
❌ Supabase Auth API returning "Unauthorized"

## The Problem

The self-hosted Supabase instance at `http://2.25.175.36:8000` is rejecting authentication requests even though:
- The user exists in the database
- The password is properly hashed
- The identity record is in place
- The Auth API is reachable

## Possible Causes

1. **JWT Secret Mismatch**: The `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` might not match the Supabase configuration
2. **Auth Service Configuration**: The self-hosted Supabase Auth (GoTrue) service might need reconfiguration
3. **API Gateway Issues**: Kong gateway might be blocking requests
4. **Database Connection**: Auth service might not be connecting to the correct database

## Solutions

### Option 1: Restart Supabase Services (Recommended)

If you have access to the server at `2.25.175.36`:

```bash
# SSH into the server
ssh user@2.25.175.36

# Navigate to Supabase directory
cd /path/to/supabase

# Restart all services
docker-compose down
docker-compose up -d

# Or restart just the auth service
docker-compose restart auth
```

### Option 2: Regenerate JWT Keys

The anon key in your `.env` might be invalid or expired. To fix:

1. Access Supabase Studio at `http://2.25.175.36:8000`
2. Go to Settings → API
3. Copy the new `anon` key
4. Update `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY="new_key_here"
   ```

### Option 3: Check Supabase Configuration

Check the Supabase `config.toml` or `docker-compose.yml` file:

```bash
# Check if JWT secret is set correctly
grep JWT_SECRET /path/to/supabase/.env

# Verify database URL matches
grep DATABASE_URL /path/to/supabase/.env
```

### Option 4: Use Direct Database Authentication (Temporary Workaround)

If you need immediate access, you can create a custom authentication flow that bypasses Supabase Auth and verifies directly against the database. However, this is NOT recommended for production.

### Option 5: Check Network/Firewall

```bash
# Test if port 8000 is accessible
telnet 2.25.175.36 8000

# Check if auth endpoint is reachable
curl -v http://2.25.175.36:8000/auth/v1/health
```

## Verification Steps

After applying a fix, run these commands to verify:

```bash
# 1. Verify user in database
npm run verify-admin

# 2. Test login programmatically
tsx scripts/test-login.ts

# 3. Test in browser
# Open: http://localhost:3000/admin/login
```

## Manual Login Test

You can also test directly with curl:

```bash
# Replace <ANON_KEY> with your actual key
curl -X POST 'http://2.25.175.36:8000/auth/v1/token?grant_type=password' \
  -H "apikey: <ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@icemanz.com",
    "password": "AdminIcemanz@2026"
  }'
```

Expected success response:
```json
{
  "access_token": "...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {...}
}
```

## Contact Points

If the issue persists:

1. Check Supabase logs:
   ```bash
   docker logs supabase-auth -f
   ```

2. Check Kong gateway logs:
   ```bash
   docker logs supabase-kong -f
   ```

3. Verify PostgreSQL is accepting connections:
   ```bash
   psql -h 2.25.175.36 -U postgres -p 5432 -d postgres
   ```

## Quick Fixes Checklist

- [ ] Restart Supabase services
- [ ] Verify JWT keys match between `.env` and Supabase config
- [ ] Check if `auth` schema exists in database
- [ ] Confirm network connectivity to `2.25.175.36:8000`
- [ ] Test with fresh browser session (clear cookies)
- [ ] Verify no firewall blocking port 8000
- [ ] Check Supabase Auth service is running
- [ ] Confirm database URL is correct in Supabase config

## Emergency Access

If you need immediate access to the admin panel and can't fix the auth issue:

1. You could temporarily modify the middleware to skip auth checks (NOT RECOMMENDED)
2. Create a separate admin API endpoint with basic auth
3. Use the database directly to manage data

## Next Steps

1. ✅ User is created and ready
2. ❓ Need to fix Supabase Auth service configuration
3. 🔄 Once fixed, run `tsx scripts/test-login.ts` to verify
4. ✅ Then login at: http://localhost:3000/admin/login

---

**Created:** August 21, 2026  
**Status:** Awaiting Supabase Auth fix
