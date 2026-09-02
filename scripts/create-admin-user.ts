import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Admin credentials
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...')
    console.log('📧 Email:', ADMIN_EMAIL)
    console.log('🔑 Password:', ADMIN_PASSWORD)

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('\n⚠️  Supabase not configured. Using direct database method...\n')
      await createAdminDirectly()
      return
    }

    // Initialize Supabase Admin Client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('\n✅ Connected to Supabase')

    // Check if user already exists
    const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers()
    
    if (fetchError) {
      console.log('⚠️  Could not fetch users:', fetchError.message)
      console.log('Trying direct database method...\n')
      await createAdminDirectly()
      return
    }

    const existingUser = existingUsers?.users?.find((u: any) => u.email === ADMIN_EMAIL)

    if (existingUser) {
      console.log('\n⚠️  User already exists!')
      console.log('Updating password...')

      // Update password
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: ADMIN_PASSWORD }
      )

      if (updateError) {
        console.error('❌ Failed to update password:', updateError.message)
        process.exit(1)
      }

      console.log('✅ Password updated successfully!')
    } else {
      console.log('\n👤 Creating new admin user...')

      // Create new user
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          full_name: 'Admin User'
        }
      })

      if (createError) {
        console.error('❌ Failed to create user:', createError.message)
        console.log('\nTrying direct database method...\n')
        await createAdminDirectly()
        return
      }

      console.log('✅ Admin user created successfully!')
      console.log('User ID:', createData.user?.id)
    }

    console.log('\n📝 Admin Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login`)
    console.log('\n✨ Setup complete!')

  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error)
    console.log('\nTrying direct database method...\n')
    await createAdminDirectly()
  } finally {
    await prisma.$disconnect()
  }
}

async function createAdminDirectly() {
  try {
    console.log('Using direct database insertion...')

    // Check if user exists
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
      console.log('👤 Creating new admin user in database...')

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
          '{"role":"admin","full_name":"Admin User"}',
          false,
          'authenticated',
          'authenticated'
        )
      `)

      console.log('✅ Admin user created successfully!')
    }

    console.log('\n📝 Admin Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login`)
    console.log('\n✨ Setup complete!')

  } catch (dbError: any) {
    console.error('\n❌ Database error:', dbError.message || dbError)
    
    if (dbError.message && dbError.message.includes('does not exist')) {
      console.log('\n⚠️  The auth schema may not be available.')
      console.log('\n💡 Manual Setup Required:')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('1. Access your Supabase Studio/Dashboard')
      console.log('2. Go to Authentication > Users')
      console.log('3. Click "Add user" or "Invite user"')
      console.log(`4. Email: ${ADMIN_EMAIL}`)
      console.log(`5. Password: ${ADMIN_PASSWORD}`)
      console.log('6. Auto confirm user: Yes')
      console.log('7. Set user metadata: {"role":"admin"}')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }
    
    throw dbError
  }
}

// Run the script
createAdminUser()
  .catch((error) => {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  })
