import { useState } from 'react'
import ProfessionalsGrid from '../components/ProfessionalsGrid/ProfessionalsGrid'
import ProfileModal from '../components/ProfileModal/ProfileModal'
import StripeBackground from '../components/brand/StripeBackground'
import SectionLabel from '../components/brand/SectionLabel'
import styles from './Profissionais.module.css'

export default function Profissionais() {
  const [selectedProfile, setSelectedProfile] = useState(null)

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <StripeBackground density="narrow" opacity={0.1} />
        <div className={`container ${styles.headerInner}`}>
          <SectionLabel align="center">Casa Musa · Vitrine</SectionLabel>
          <h1 className={styles.title}>Profissionais</h1>
          <p className={styles.subtitle}>Encontre a profissional ideal para o seu projeto</p>
        </div>
      </header>

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
