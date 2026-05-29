import { useState } from 'react'
import { CATEGORIAS, ESTADOS_BR, CIDADES_POR_ESTADO, PROFISSOES } from '../../utils/options'
import styles from './ProfessionalsGrid.module.css'

export default function FilterBar({ onSearch }) {
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState('')
  const [profissao, setProfissao] = useState('')
  const [estado, setEstado] = useState('')
  const [cidade, setCidade] = useState('')

  const profissoesCategoria = categoria ? PROFISSOES.filter((p) => p.categoria === categoria) : []
  const cidadesDoEstado = estado ? (CIDADES_POR_ESTADO[estado] || []) : []
  const anyFilter = q || categoria || profissao || estado || cidade

  function handleCategoriaChange(e) { setCategoria(e.target.value); setProfissao('') }
  function handleEstadoChange(e) { setEstado(e.target.value); setCidade('') }
  // Envia estado E cidade (antes a cidade zerava o estado por engano)
  function handleSearch() { onSearch({ q: profissao || q, categoria, estado, cidade }) }
  function handleReset() { setQ(''); setCategoria(''); setProfissao(''); setEstado(''); setCidade(''); onSearch({}) }
  function handleKey(e) { if (e.key === 'Enter') handleSearch() }

  return (
    <div className={styles.filterBar}>
      <input className={styles.filterInput} placeholder="Buscar por nome ou serviço..." value={q}
        onChange={(e) => setQ(e.target.value)} onKeyDown={handleKey} aria-label="Buscar por nome ou serviço" />
      <select className={styles.filterSelect} value={categoria} onChange={handleCategoriaChange} aria-label="Categoria">
        <option value="">Todas as categorias</option>
        {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      {profissoesCategoria.length > 0 && (
        <select className={styles.filterSelect} value={profissao} onChange={(e) => setProfissao(e.target.value)} aria-label="Profissão">
          <option value="">Todas as profissões</option>
          {profissoesCategoria.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
        </select>
      )}
      <select className={styles.filterSelect} value={estado} onChange={handleEstadoChange} aria-label="Estado">
        <option value="">Todos os estados</option>
        {ESTADOS_BR.map((e) => <option key={e.sigla} value={e.sigla}>{e.nome}</option>)}
      </select>
      {cidadesDoEstado.length > 0 && (
        <select className={styles.filterSelect} value={cidade} onChange={(e) => setCidade(e.target.value)} aria-label="Cidade">
          <option value="">Todas as cidades</option>
          {cidadesDoEstado.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      )}
      <button className={`btn btn-primary ${styles.searchBtn}`} onClick={handleSearch}>Buscar</button>
      {anyFilter && <button className={styles.resetBtn} onClick={handleReset}>Limpar</button>}
    </div>
  )
}
