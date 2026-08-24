import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const ADMIN_EMAIL = 'superadmin@icemanz.com'
const ADMIN_PASSWORD = 'AdminIcemanz@2026'

async function testLogin() {
  try {
    console.log('🧪 Testing admin login...\n')
    console.log(`📍 Supabase URL: ${supabaseUrl}`)
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    console.log(`\n🔐 Attempting login with:`)
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: ${ADMIN_PASSWORD}`)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })

    if (error) {
      console.log('\n❌ Login failed!')
      console.log(`   Error: ${error.message}`)
      console.log(`   Status: ${error.status}`)
      
      if (error.message.includes('Invalid') || error.message.includes('credentials')) {
        console.log('\n💡 Possible issues:')
        console.log('   1. Password might be incorrect')
        console.log('   2. User might not exist')
        console.log('   3. Email might not be confirmed')
        console.log('\n🔧 Try running: npm run create-admin')
      } else if (error.message.includes('Unauthorized')) {
        console.log('\n💡 Supabase Auth service might be having issues')
        console.log('   Check if the Auth service is running properly')
      }
      
      return
    }

    console.log('\n✅ Login successful!')
    console.log(`\n👤 User Info:`)
    console.log(`   ID: ${data.user?.id}`)
    console.log(`   Email: ${data.user?.email}`)
    console.log(`   Role: ${data.user?.user_metadata?.role || 'N/A'}`)
    console.log(`   Email Confirmed: ${data.user?.email_confirmed_at ? '✓' : '✗'}`)
    
    console.log(`\n🔑 Session:`)
    console.log(`   Access Token: ${data.session?.access_token?.substring(0, 20)}...`)
    console.log(`   Expires: ${new Date(data.session?.expires_at! * 1000).toLocaleString()}`)
    
    console.log('\n🎉 Admin login is working correctly!')
    console.log(`🔗 You can now login at: ${process.env.NEXT_PUBLIC_APP_URL}/admin/login`)
    
    // Sign out
    await supabase.auth.signOut()
    
  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message || error)
  }
}

testLogin()
