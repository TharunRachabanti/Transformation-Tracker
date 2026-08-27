const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres.akaxfinhrriyfmygmdco:Tharun%402081182114@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
});

async function main() {
  try {
    console.log('Force confirming email in auth.users...');
    const result = await prisma.$executeRawUnsafe(`
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email = 'tharunrachabanti@gmail.com';
    `);
    console.log('Update result:', result);
    
    // Also, verify the user exists
    const users = await prisma.$queryRawUnsafe(`SELECT id, email, confirmed_at FROM auth.users WHERE email = 'tharunrachabanti@gmail.com';`);
    console.log('User status now:', users);

  } catch (e) {
    console.error('Failed to force confirm:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
