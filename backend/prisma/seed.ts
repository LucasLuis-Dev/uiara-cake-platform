import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');
  
  const recheios = [
    'Chocolate', 'Prestígio', 'Doce de Leite', 'Ninho',
    'Paçoca', 'Café', 'Banana', 'Delícia de Abacaxi',
    'Maracujá', 'Limão', 'Crocante',
  ];
  
  for (const nome of recheios) {
    await prisma.sabor.upsert({
      where: { id: nome.toLowerCase().replace(/\s/g, '-') },
      update: {},
      create: {
        id: nome.toLowerCase().replace(/\s/g, '-'),
        nome,
        tipo: 'RECHEIO',
        ativo: true,
      },
    });
  }
  
  const massas = ['Branca', 'Chocolate'];
  
  for (const nome of massas) {
    await prisma.sabor.upsert({
      where: { id: `massa-${nome.toLowerCase()}` },
      update: {},
      create: {
        id: `massa-${nome.toLowerCase()}`,
        nome,
        tipo: 'MASSA',
        ativo: true,
      },
    });
  }
  
  console.log('✅ Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
