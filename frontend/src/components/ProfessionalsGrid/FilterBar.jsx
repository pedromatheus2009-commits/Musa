import { useState } from 'react'
import { CATEGORIAS, ESTADOS_BR, CIDADES_POR_ESTADO, PROFISSOES } from '../../utils/options'
import styles from './ProfessionalsGrid.module.css'

export default function FilterBar({ onSearch }) {
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState('')
  const [profissao, setProfissao] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')

  const profissoesCategoria = categoria
    ? PROFISSOES.filter((p) => p.categoria === categoria)
    : []
  const cidadesDoEstado = estado ? (CIDADES_POR_ESTADO[estado] || []) : []

  function handleCategoriaChange(e) {
    setCategoria(e.target.value)
    setProfissao('')
  }

  function handleEstadoChange(e) {
    setEstado(e.target.value)
    setCidade('')
  }

  function handleSearch() {
    onSearch({
      q: profissao || q,
      categoria,
      estado: cidade ? '' : estado,
      cidade,
    })
  }
  function handleKey(e) { if (e.key === 'Enter') handleSearch() }

  return (
    <div className={styles.filterBar}>
      <input className={styles.filterInput} placeholder="Buscar por nome ou serviço..." value={q}
        onChange={(e) => setQ(e.target.value)} onKeyDown={handleKey} />
      <select className={styles.filterSelect} value={categoria} onChange={handleCategoriaChange}>
        <option value="">Todas as categorias</option>
        {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {profissoesCategoria.length > 0 && (
        <select className={styles.filterSelect} value={profissao} onChange={(e) => setProfissao(e.target.value)}>
          <option value="">Todas as profissões</option>
          {profissoesCategoria.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
        </select>
      )}
      <select className={styles.filterSelect} value={estado} onChange={handleEstadoChange}>
        <option value="">Todos os estados</option>
        {ESTADOS_BR.map((e) => <option key={e.sigla} value={e.sigla}>{e.nome}</option>)}
      </select>
      {cidadesDoEstado.length > 0 && (
        <select className={styles.filterSelect} value={cidade} onChange={(e) => setCidade(e.target.value)}>
          <option value="">Todas as cidades</option>
          {cidadesDoEstado.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      )}
      <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={handleSearch}>
        Buscar
      </button>
    </div>
  )
}
