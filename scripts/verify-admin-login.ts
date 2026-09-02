import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'

async function verifyAdminLogin() {
  console.log('🔍 Verifying admin login...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials not found in .env')
    process.exit(1)
  }

  // Create Supabase client (using anon key like the app does)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  console.log('📧 Testing login with:')
  console.log(`   Email: ${ADMIN_EMAIL}`)
  console.log(`   Password: ${ADMIN_PASSWORD}\n`)

  try {
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    if (error) {
      console.error('❌ Login failed:', error.message)
      console.log('\n💡 Possible issues:')
      console.log('   1. User may not exist in auth.users table')
      console.log('   2. Password may be incorrect')
      console.log('   3. Email may not be confirmed')
      console.log('\n🔧 Fix it by running:')
      console.log('   npm run create-admin-user')
      process.exit(1)
    }

    console.log('✅ Login successful!')
    console.log('\n👤 User Details:')
    console.log(`   ID: ${data.user?.id}`)
    console.log(`   Email: ${data.user?.email}`)
    console.log(`   Email Confirmed: ${data.user?.email_confirmed_at ? 'Yes' : 'No'}`)
    console.log(`   Created: ${data.user?.created_at}`)
    
    if (data.user?.user_metadata) {
      console.log(`   Metadata: ${JSON.stringify(data.user.user_metadata, null, 2)}`)
    }

    console.log('\n🔗 Login URL:')
    console.log(`   ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/login`)
    console.log('\n✨ Admin login is working correctly!')

    // Sign out
    await supabase.auth.signOut()

  } catch (error: any) {
    console.error('❌ Error:', error.message || error)
    process.exit(1)
  }
}

verifyAdminLogin()
