import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'admin123'

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user in database...')
    
    // Check if Admin table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Admin'
      );
    `
    
    console.log('Table check:', tableExists)
    
    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    
    // Check if admin exists
    const existing = await prisma.$queryRaw`
      SELECT * FROM "Admin" WHERE email = ${ADMIN_EMAIL} LIMIT 1
    `
    
    if (Array.isArray(existing) && existing.length > 0) {
      console.log('⚠️  Admin exists, updating password...')
      
      await prisma.$executeRaw`
        UPDATE "Admin" 
        SET password = ${hashedPassword}
        WHERE email = ${ADMIN_EMAIL}
      `
      
      console.log('✅ Password updated!')
    } else {
      console.log('👤 Creating new admin...')
      
      await prisma.$executeRaw`
        INSERT INTO "Admin" (id, email, password, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${ADMIN_EMAIL}, ${hashedPassword}, NOW(), NOW())
      `
      
      console.log('✅ Admin created!')
    }
    
    console.log('\n📝 Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Email:    ${ADMIN_EMAIL}`)
    console.log(`Password: ${ADMIN_PASSWORD}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🔗 http://localhost:3000/admin/login')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    
    if (error.message?.includes('does not exist')) {
      console.log('\n⚠️  Admin table does not exist!')
      console.log('Run: npx prisma db push')
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
