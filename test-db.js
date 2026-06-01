const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const tokens = await prisma.qboToken.findMany();
  console.log('Tokens:', tokens);
}
check();