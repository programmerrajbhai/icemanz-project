import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'superadmin@icemanz.com'

async function fixAdminIdentity() {
  try {
    console.log('🔧 Fixing admin user identity...\n')

    // Get the user
    const users = await prisma.$queryRawUnsafe(`
      SELECT id, email FROM auth.users WHERE email = '${ADMIN_EMAIL}'
    `)

    if (!users || (users as any[]).length === 0) {
      console.log('❌ Admin user NOT found!')
      return
    }

    const user = (users as any[])[0]
    console.log(`✅ Found user: ${user.email} (${user.id})`)

    // Check if identity exists
    console.log('\n🔍 Checking for identity record...')
    const identities = await prisma.$queryRawUnsafe(`
      SELECT id, provider, user_id FROM auth.identities WHERE user_id = '${user.id}'
    `)

    if (identities && (identities as any[]).length > 0) {
      console.log('✓ Identity record exists')
    } else {
      console.log('⚠️  Identity record missing. Creating...')

      // Create identity record (email is a generated column, don't include it)
      await prisma.$executeRawUnsafe(`
        INSERT INTO auth.identities (
          provider_id,
          user_id,
          identity_data,
          provider,
          last_sign_in_at,
          created_at,
          updated_at
        ) VALUES (
          '${user.id}',
          '${user.id}',
          '{"sub":"${user.id}","email":"${user.email}","email_verified":true,"phone_verified":false,"provider":"email"}',
          'email',
          now(),
          now(),
          now()
        )
      `)

      console.log('✅ Identity record created!')
    }

    // Update user to ensure all fields are correct
    console.log('\n🔄 Updating user record...')
    await prisma.$executeRawUnsafe(`
      UPDATE auth.users 
      SET 
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        confirmation_token = '',
        recovery_token = '',
        email_change_token_new = '',
        email_change = '',
        updated_at = now()
      WHERE id = '${user.id}'
    `)

    console.log('✅ User record updated!')

    console.log('\n✨ Admin user should now be able to log in!')
    console.log('\n📝 Credentials:')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   Password: AdminIcemanz@2026`)
    console.log(`\n🔗 Login: http://localhost:3000/admin/login`)

  } catch (error: any) {
    console.error('\n❌ Error:', error.message || error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminIdentity()
