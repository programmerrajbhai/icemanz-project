import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'superadmin@icemanz.com'

async function verifyAdminUser() {
  try {
    console.log('🔍 Checking admin user in database...\n')
    
    const users = await prisma.$queryRawUnsafe(`
      SELECT 
        id, 
        email, 
        email_confirmed_at, 
        created_at,
        role,
        aud,
        raw_user_meta_data,
        encrypted_password IS NOT NULL as has_password
      FROM auth.users 
      WHERE email = '${ADMIN_EMAIL}'
    `)
    
    if (!users || (users as any[]).length === 0) {
      console.log('❌ Admin user NOT found in database!')
      console.log('💡 Run: npm run create-admin')
    } else {
      const user = (users as any[])[0]
      console.log('✅ Admin user found in database!')
      console.log('\n📋 User Details:')
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Email Confirmed: ${user.email_confirmed_at ? '✓' : '✗'}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Has Password: ${user.has_password ? '✓' : '✗'}`)
      console.log(`   Created: ${user.created_at}`)
      
      if (user.raw_user_meta_data) {
        console.log(`   Metadata: ${JSON.stringify(user.raw_user_meta_data)}`)
      }
      
      console.log('\n🔐 Expected Credentials:')
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: AdminIcemanz@2026`)
    }

    // Also check Supabase auth API connectivity
    console.log('\n🌐 Checking Supabase Auth API...')
    console.log(`   URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
    console.log(`   Anon Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...`)
    
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    try {
      // Try to get auth status
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.log(`   ⚠️  Auth API Error: ${error.message}`)
      } else {
        console.log('   ✓ Auth API is reachable')
      }
    } catch (apiError: any) {
      console.log(`   ❌ Cannot reach Auth API: ${apiError.message}`)
    }
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAdminUser()
