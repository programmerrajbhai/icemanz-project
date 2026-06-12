const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const inv = await prisma.invoiceRequest.findUnique({
    where: { id: '737e5c4a-8f74-42bb-906b-59c5d0682090' }
  });
  console.log(inv);
}

check();
