import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  
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
