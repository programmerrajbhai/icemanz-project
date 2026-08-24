import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkSchema() {
  try {
    console.log('🔍 Checking auth.identities table structure...\n')
    
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'auth' AND table_name = 'identities'
      ORDER BY ordinal_position
    `)
    
    console.log('Columns in auth.identities:')
    console.table(columns)
    
    // Check if there are any existing identities
    console.log('\n🔍 Checking existing identities...')
    const existingIdentities = await prisma.$queryRawUnsafe(`
      SELECT * FROM auth.identities LIMIT 1
    `)
    
    if (existingIdentities && (existingIdentities as any[]).length > 0) {
      console.log('\nExample identity record:')
      console.log(JSON.stringify((existingIdentities as any[])[0], null, 2))
    } else {
      console.log('\nNo existing identities found.')
    }
    
  } catch (error: any) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkSchema()
