import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Admin credentials
const ADMIN_EMAIL = 'superadmin@icemanz.com'
const ADMIN_PASSWORD = 'AdminIcemanz@2026'

async function createAdminUser() {
  try {
    console.log('🔧 Connecting to Supabase...')
    console.log(`📍 URL: ${supabaseUrl}`)
    
    // Create Supabase admin client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log('\n🔍 Checking if admin user already exists...')
    
    // Check if user already exists
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error checking existing users:', listError)
      throw listError
    }

    const existingUser = existingUsers?.users?.find(u => u.email === ADMIN_EMAIL)

    if (existingUser) {
      console.log('⚠️  Admin user already exists!')
      console.log(`📧 Email: ${ADMIN_EMAIL}`)
      console.log(`🆔 User ID: ${existingUser.id}`)
      console.log('\n🔄 Updating password...')
      
      // Update the password
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: ADMIN_PASSWORD }
      )

      if (updateError) {
        console.error('❌ Error updating password:', updateError)
        throw updateError
      }

      console.log('✅ Password updated successfully!')
      console.log('\n📝 Admin Credentials:')
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: ${ADMIN_PASSWORD}`)
      console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL}/admin/login`)
      
    } else {
      console.log('👤 Creating new admin user...')
      
      // Create admin user
      const { data, error } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          role: 'admin',
          full_name: 'Super Admin'
        }
      })

      if (error) {
        console.error('❌ Error creating admin user:', error)
        throw error
      }

      console.log('✅ Admin user created successfully!')
      console.log(`🆔 User ID: ${data.user?.id}`)
      console.log('\n📝 Admin Credentials:')
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: ${ADMIN_PASSWORD}`)
      console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL}/admin/login`)
    }

    console.log('\n✨ Setup complete!')
    
  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

// Run the script
createAdminUser()
