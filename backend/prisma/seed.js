const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const professionals = [
  {
    email: 'camila@example.com',
    nome: 'Camila Rezende',
    role: 'Fotógrafa',
    bio: 'Especialista em fotografia documental e retratos femininos com 8 anos de experiência.',
    cidade: 'São Paulo, SP',
    whatsapp: '5511999990001',
    preco: 'A partir de R$ 800',
    services: ['Ensaios femininos', 'Fotografia de casamento', 'Fotografia corporativa'],
    categories: ['Fotografia'],
  },
  {
    email: 'fernanda@example.com',
    nome: 'Fernanda Duarte',
    role: 'Designer de Interiores',
    bio: 'Criando espaços funcionais e bonitos que refletem a personalidade de cada cliente.',
    cidade: 'Rio de Janeiro, RJ',
    whatsapp: '5521999990002',
    preco: 'A partir de R$ 2.500',
    services: ['Projeto residencial', 'Consultoria de decoração', 'Reforma completa'],
    categories: ['Design'],
  },
  {
    email: 'isabela@example.com',
    nome: 'Isabela Santos',
    role: 'Terapeuta Holística',
    bio: 'Integrando corpo e mente através de técnicas terapêuticas comprovadas.',
    cidade: 'Belo Horizonte, MG',
    whatsapp: '5531999990003',
    preco: 'Sessão a partir de R$ 150',
    services: ['Reiki', 'Meditação guiada', 'Terapia floral'],
    categories: ['Saúde & Bem-estar'],
  },
  {
    email: 'larissa@example.com',
    nome: 'Larissa Vidal',
    role: 'Stylist & Personal Shopper',
    bio: 'Transformando guarda-roupas e autoestima com consultoria personalizada de imagem.',
    cidade: 'São Paulo, SP',
    whatsapp: '5511999990004',
    preco: 'A partir de R$ 350',
    services: ['Consultoria de imagem', 'Personal shopping', 'Organização de guarda-roupa'],
    categories: ['Moda & Estilo'],
  },
  {
    email: 'mariana@example.com',
    nome: 'Mariana Torres',
    role: 'Chef & Confeiteira',
    bio: 'Gastronomia com afeto. Bolos artísticos e experiências gastronômicas únicas.',
    cidade: 'Curitiba, PR',
    whatsapp: '5541999990005',
    preco: 'A partir de R$ 200',
    services: ['Bolos artísticos', 'Buffet para eventos', 'Aulas de confeitaria'],
    categories: ['Gastronomia'],
  },
  {
    email: 'patricia@example.com',
    nome: 'Patricia Lemos',
    role: 'Dev & UX Designer',
    bio: 'Criando produtos digitais centrados no usuário. Full-stack com foco em experiência.',
    cidade: 'Florianópolis, SC',
    whatsapp: '5548999990006',
    preco: 'A partir de R$ 4.000/mês',
    services: ['Desenvolvimento web', 'UX/UI Design', 'Consultoria digital'],
    categories: ['Tecnologia'],
  },
  {
    email: 'renata@example.com',
    nome: 'Renata Oliveira',
    role: 'Coach de Carreira',
    bio: 'Ajudando profissionais a encontrarem seu propósito e alcançarem seus objetivos.',
    cidade: 'Brasília, DF',
    whatsapp: '5561999990007',
    preco: 'Pacote a partir de R$ 600',
    services: ['Coaching de carreira', 'Mentoria executiva', 'Workshops'],
    categories: ['Educação & Coaching'],
  },
  {
    email: 'sofia@example.com',
    nome: 'Sofia Mendes',
    role: 'Esteticista & Maquiadora',
    bio: 'Realçando a beleza natural de cada mulher com técnicas exclusivas.',
    cidade: 'Salvador, BA',
    whatsapp: '5571999990008',
    preco: 'A partir de R$ 120',
    services: ['Maquiagem para eventos', 'Tratamentos faciais', 'Design de sobrancelha'],
    categories: ['Beleza'],
  },
]

const categoryNames = [
  'Fotografia',
  'Design',
  'Saúde & Bem-estar',
  'Moda & Estilo',
  'Gastronomia',
  'Tecnologia',
  'Educação & Coaching',
  'Beleza',
]

async function main() {
  console.log('🌱 Iniciando seed...')

  // Admin padrão (altere o email antes de rodar em produção)
  const adminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { email: 'admin@musacasa.com.br' },
    update: { isAdmin: true },
    create: { email: 'admin@musacasa.com.br', password: adminPassword, nome: 'MUSA Admin', isAdmin: true },
  })
  console.log('✅ Admin criado: admin@musacasa.com.br / admin123')

  // Cria categorias
  for (const nome of categoryNames) {
    await prisma.category.upsert({
      where: { nome },
      update: {},
      create: { nome },
    })
  }
  console.log('✅ Categorias criadas')

  // Cria usuários e perfis
  const password = await bcrypt.hash('senha123', 10)

  for (const p of professionals) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        email: p.email,
        password,
        nome: p.nome,
      },
    })

    const existing = await prisma.profile.findUnique({ where: { userId: user.id } })
    if (existing) continue

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        nome: p.nome,
        role: p.role,
        bio: p.bio,
        cidade: p.cidade,
        whatsapp: p.whatsapp,
        preco: p.preco,
        ativo: true,
        services: {
          create: p.services.map((nome) => ({ nome })),
        },
      },
    })

    for (const catNome of p.categories) {
      const cat = await prisma.category.findUnique({ where: { nome: catNome } })
      if (cat) {
        await prisma.profileCategory.upsert({
          where: { profileId_categoryId: { profileId: profile.id, categoryId: cat.id } },
          update: {},
          create: { profileId: profile.id, categoryId: cat.id },
        })
      }
    }
  }

  console.log('✅ Profissionais criados')
  console.log('🎉 Seed concluído!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
