import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  const adminEmail = process.env.ADMIN_EMAIL || 'uiara@uiaracake.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'UiaraCake@2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Uiara',
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user created: ${adminEmail}`);
  
  const fillings = [
    'Chocolate', 'Prestígio', 'Doce de Leite', 'Ninho',
    'Paçoca', 'Café', 'Banana', 'Delícia de Abacaxi',
    'Maracujá', 'Limão', 'Crocante',
  ];
  
  for (const name of fillings) {
    await prisma.flavor.upsert({
      where: { id: name.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: name.toLowerCase().replace(/\s/g, '-'),
        name,
        type: 'FILLING',
        active: true,
      },
    });
  }
  
  const doughs = ['Branca', 'Chocolate'];
  
  for (const name of doughs) {
    await prisma.flavor.upsert({
      where: { id: `dough-${name.toLowerCase()}` },
      update: {},
      create: {
        id: `dough-${name.toLowerCase()}`,
        name,
        type: 'DOUGH',
        active: true,
      },
    });
  }
  
  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
