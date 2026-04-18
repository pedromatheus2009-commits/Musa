import { useState } from 'react'
import ProfessionalsGrid from '../components/ProfessionalsGrid/ProfessionalsGrid'
import ProfileModal from '../components/ProfileModal/ProfileModal'
import styles from './Profissionais.module.css'

export default function Profissionais() {
  const [selectedProfile, setSelectedProfile] = useState(null)

  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <div className="container">
          <p className={styles.eyebrow}>Catálogo</p>
          <h1 className={styles.title}>Profissionais</h1>
          <p className={styles.subtitle}>Encontre a profissional ideal para o seu projeto</p>
        </div>
      </div>

      <ProfessionalsGrid onProfileClick={setSelectedProfile} />

      <ProfileModal
        profile={selectedProfile}
        profileId={selectedProfile?.id}
        isOpen={!!selectedProfile}
        onClose={() => setSelectedProfile(null)}
      />
    </main>
  )
}
