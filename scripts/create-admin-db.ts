import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { createHash, randomBytes } from 'crypto'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Admin credentials
const ADMIN_EMAIL = 'superadmin@icemanz.com'
const ADMIN_PASSWORD = 'AdminIcemanz@2026'

// Supabase uses bcrypt for password hashing, but we'll use a direct SQL approach
async function createAdminUser() {
  try {
    console.log('🔧 Connecting to database...')

    // Generate UUID for user ID
    const userId = randomBytes(16).toString('hex')

    // Hash password using SHA256 (this is a fallback, Supabase uses bcrypt normally)
    // For self-hosted Supabase, you might need to use their specific hashing
    const passwordHash = createHash('sha256').update(ADMIN_PASSWORD).digest('hex')

    const now = new Date().toISOString()

    console.log('\n👤 Creating admin user in database...')

    // First check if user exists
    try {
      const existingUser = await prisma.$queryRawUnsafe(`
        SELECT id, email FROM auth.users WHERE email = '${ADMIN_EMAIL}' LIMIT 1
      `)

      if (existingUser && (existingUser as any[]).length > 0) {
        console.log('⚠️  User already exists. Updating password...')

        // Update existing user's password
        await prisma.$executeRawUnsafe(`
          UPDATE auth.users 
          SET 
            encrypted_password = crypt('${ADMIN_PASSWORD}', gen_salt('bf')),
            updated_at = now()
          WHERE email = '${ADMIN_EMAIL}'
        `)

        console.log('✅ Admin password updated successfully!')
      } else {
        console.log('👤 Creating new admin user...')

        // Insert new user
        await prisma.$executeRawUnsafe(`
          INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data,
            is_super_admin,
            role,
            aud
          ) VALUES (
            gen_random_uuid(),
            '00000000-0000-0000-0000-000000000000',
            '${ADMIN_EMAIL}',
            crypt('${ADMIN_PASSWORD}', gen_salt('bf')),
            now(),
            now(),
            now(),
            '{"provider":"email","providers":["email"]}',
            '{"role":"admin","full_name":"Super Admin"}',
            false,
            'authenticated',
            'authenticated'
          )
        `)

        console.log('✅ Admin user created successfully!')
      }
    } catch (dbError: any) {
      if (dbError.message && dbError.message.includes('does not exist')) {
        console.log('\n⚠️  The auth schema may not be set up properly.')
        console.log('💡 Alternative: Use Supabase Studio to create the user manually')
        console.log(`   Email: ${ADMIN_EMAIL}`)
        console.log(`   Password: ${ADMIN_PASSWORD}`)
      } else {
        throw dbError
      }
    }

    console.log('\n📝 Admin Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL}/admin/login`)
    console.log('\n✨ Setup complete!')

  } catch (error: any) {
    console.error('\n❌ Failed to create admin user:', error.message || error)
    console.log('\n💡 Manual Setup Instructions:')
    console.log('1. Access your Supabase Studio/Dashboard')
    console.log('2. Go to Authentication > Users')
    console.log('3. Click "Add user"')
    console.log(`4. Email: ${ADMIN_EMAIL}`)
    console.log(`5. Password: ${ADMIN_PASSWORD}`)
    console.log('6. Auto confirm user: Yes')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script
createAdminUser()
