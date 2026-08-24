import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

// Admin credentials
const ADMIN_EMAIL = 'superadmin@icemanz.com'
const ADMIN_PASSWORD = 'AdminIcemanz@2026'

async function createAdminUser() {
  try {
    console.log('🔧 Connecting to Supabase...')
    console.log(`📍 URL: ${supabaseUrl}`)
    
    // Create Supabase client with anon key (for signup)
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log('\n👤 Creating admin user via signup...')
    
    // Try to sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: {
        data: {
          role: 'admin',
          full_name: 'Super Admin'
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        console.log('⚠️  User already exists. Attempting to sign in...')
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        })

        if (signInError) {
          console.log('❌ Could not sign in with provided credentials.')
          console.log('💡 User exists but password may be different.')
          console.log('\n📝 Try logging in with:')
          console.log(`   Email: ${ADMIN_EMAIL}`)
          console.log(`   Password: ${ADMIN_PASSWORD}`)
          console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL}/admin/login`)
          process.exit(0)
        }

        console.log('✅ User already exists and credentials are correct!')
        console.log(`🆔 User ID: ${signInData.user?.id}`)
      } else {
        console.error('❌ Error creating admin user:', error)
        throw error
      }
    } else {
      console.log('✅ Admin user created successfully!')
      console.log(`🆔 User ID: ${data.user?.id}`)
      
      if (data.user && !data.user.confirmed_at) {
        console.log('\n⚠️  Email confirmation may be required.')
        console.log('📧 Check your Supabase settings for email confirmation requirements.')
      }
    }

    console.log('\n📝 Admin Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    console.log(`\n🔗 Login URL: ${process.env.NEXT_PUBLIC_APP_URL}/admin/login`)
    console.log('\n✨ Setup complete!')
    
  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

// Run the script
createAdminUser()
