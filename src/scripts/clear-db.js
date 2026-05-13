const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.userBadge.deleteMany({});
  await prisma.xPEvent.deleteMany({});
  await prisma.simulation.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.workspaceMember.deleteMany({});
  await prisma.userAnalytics.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleared successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
