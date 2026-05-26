const prisma = require('../../config/database')

const err = (message, status) => Object.assign(new Error(message), { status })

const publicSelect = {
  id: true, titulo: true, descricao: true, preco: true, tipo: true,
  categoria: true, fotos: true, whatsapp: true, status: true, createdAt: true,
  user: { select: { nome: true } },
}

// ------------------------------- público -------------------------------
function listPublico({ q, tipo, categoria } = {}) {
  const and = []
  if (q) and.push({ OR: [{ titulo: { contains: q, mode: 'insensitive' } }, { descricao: { contains: q, mode: 'insensitive' } }] })
  if (tipo) and.push({ tipo })
  if (categoria) and.push({ categoria: { equals: categoria, mode: 'insensitive' } })
  const where = { status: 'aprovado', ...(and.length && { AND: and }) }
  return prisma.bauItem.findMany({ where, select: publicSelect, orderBy: { createdAt: 'desc' }, take: 60 })
}

async function detalhe(id) {
  const item = await prisma.bauItem.findUnique({ where: { id }, select: publicSelect })
  if (!item || item.status !== 'aprovado') throw err('Item não encontrado', 404)
  return item
}

// ------------------------------- usuária -------------------------------
function criar(userId, data) {
  return prisma.bauItem.create({ data: { ...data, fotos: data.fotos || [], userId, status: 'pendente' } })
}

function meus(userId) {
  return prisma.bauItem.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
}

async function assertOwner(id, userId) {
  const item = await prisma.bauItem.findUnique({ where: { id }, select: { userId: true } })
  if (!item) throw err('Item não encontrado', 404)
  if (item.userId !== userId) throw err('Sem permissão', 403)
}

async function atualizar(id, userId, data) {
  await assertOwner(id, userId)
  return prisma.bauItem.update({ where: { id }, data })
}

async function remover(id, userId) {
  await assertOwner(id, userId)
  return prisma.bauItem.delete({ where: { id } })
}

async function marcarVendido(id, userId) {
  const item = await prisma.bauItem.findUnique({ where: { id }, select: { userId: true, status: true } })
  if (!item) throw err('Item não encontrado', 404)
  if (item.userId !== userId) throw err('Sem permissão', 403)
  if (item.status !== 'aprovado') throw err('Apenas itens aprovados podem ser marcados como vendidos', 400)
  return prisma.bauItem.update({ where: { id }, data: { status: 'vendido' } })
}

// ------------------------------- admin -------------------------------
function listAdmin({ status } = {}) {
  return prisma.bauItem.findMany({ where: status ? { status } : {}, select: publicSelect, orderBy: { createdAt: 'desc' } })
}

async function setStatus(id, status) {
  const item = await prisma.bauItem.findUnique({ where: { id }, select: { id: true } })
  if (!item) throw err('Item não encontrado', 404)
  return prisma.bauItem.update({ where: { id }, data: { status } })
}
const aprovar = (id) => setStatus(id, 'aprovado')
const recusar = (id) => setStatus(id, 'recusado')

module.exports = { listPublico, detalhe, criar, meus, atualizar, remover, marcarVendido, listAdmin, aprovar, recusar }
