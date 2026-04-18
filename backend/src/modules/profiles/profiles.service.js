const prisma = require('../../config/database')

const profileSelect = {
  id: true,
  nome: true,
  role: true,
  bio: true,
  cidade: true,
  whatsapp: true,
  preco: true,
  fotoUrl: true,
  ativo: true,
  createdAt: true,
  services: { select: { id: true, nome: true } },
  categories: { select: { category: { select: { id: true, nome: true } } } },
  _count: { select: { reviews: true } },
}

async function list({ q, categoria, cidade, estado, page = 1, limit = 12 }) {
  const skip = (page - 1) * limit
  const andClauses = []
  if (q) {
    andClauses.push({ OR: [
      { nome: { contains: q, mode: 'insensitive' } },
      { role: { contains: q, mode: 'insensitive' } },
      { bio: { contains: q, mode: 'insensitive' } },
    ]})
  }
  if (categoria) {
    andClauses.push({ OR: [
      { categories: { some: { category: { nome: { equals: categoria, mode: 'insensitive' } } } } },
      { role: { contains: categoria, mode: 'insensitive' } },
    ]})
  }
  if (cidade) {
    andClauses.push({ cidade: { equals: cidade, mode: 'insensitive' } })
  }
  if (estado) {
    andClauses.push({ cidade: { endsWith: `, ${estado}`, mode: 'insensitive' } })
  }
  const where = { ativo: true, aprovado: true, ...(andClauses.length && { AND: andClauses }) }
  const [data, total] = await Promise.all([
    prisma.profile.findMany({ where, select: profileSelect, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.profile.count({ where }),
  ])
  return { data, total, page, limit, pages: Math.ceil(total / limit) }
}

async function findById(id) {
  const profile = await prisma.profile.findUnique({
    where: { id },
    select: { ...profileSelect, reviews: { orderBy: { createdAt: 'desc' }, take: 20 }, posts: { select: { id: true, titulo: true, conteudo: true, imagemUrl: true, createdAt: true }, orderBy: { createdAt: 'desc' } } },
  })
  if (!profile || !profile.ativo) {
    const err = new Error('Perfil não encontrado')
    err.status = 404
    throw err
  }
  return profile
}

async function create(userId, data) {
  const existing = await prisma.profile.findUnique({ where: { userId } })
  if (existing) {
    const err = new Error('Você já possui um perfil cadastrado')
    err.status = 409
    throw err
  }
  const { services, categoria, ...profileData } = data
  const categoryConnect = await resolveCategoryConnect(categoria)
  return prisma.profile.create({
    data: {
      ...profileData,
      userId,
      ...(services && { services: { create: services.map((nome) => ({ nome })) } }),
      ...(categoryConnect && { categories: { create: [{ categoryId: categoryConnect }] } }),
    },
    select: profileSelect,
  })
}

async function update(id, userId, data) {
  await assertOwner(id, userId)
  const { services, categoria, ...profileData } = data
  if (services) {
    await prisma.service.deleteMany({ where: { profileId: id } })
  }
  if (categoria !== undefined) {
    await prisma.profileCategory.deleteMany({ where: { profileId: id } })
  }
  const categoryConnect = await resolveCategoryConnect(categoria)
  return prisma.profile.update({
    where: { id },
    data: {
      ...profileData,
      ...(services && { services: { create: services.map((nome) => ({ nome })) } }),
      ...(categoryConnect && { categories: { create: [{ categoryId: categoryConnect }] } }),
    },
    select: profileSelect,
  })
}

async function resolveCategoryConnect(categoria) {
  if (!categoria) return null
  const cat = await prisma.category.findFirst({ where: { nome: { equals: categoria, mode: 'insensitive' } } })
  return cat?.id ?? null
}

async function remove(id, userId) {
  await assertOwner(id, userId)
  return prisma.profile.update({ where: { id }, data: { ativo: false } })
}

async function assertOwner(id, userId) {
  const profile = await prisma.profile.findUnique({ where: { id }, select: { userId: true } })
  if (!profile) {
    const err = new Error('Perfil não encontrado')
    err.status = 404
    throw err
  }
  if (profile.userId !== userId) {
    const err = new Error('Sem permissão')
    err.status = 403
    throw err
  }
}

async function findByUser(userId) {
  return prisma.profile.findUnique({
    where: { userId },
    select: { ...profileSelect, posts: { select: { id: true, titulo: true, conteudo: true, imagemUrl: true, createdAt: true }, orderBy: { createdAt: 'desc' } } },
  })
}

module.exports = { list, findById, create, update, remove, findByUser }
