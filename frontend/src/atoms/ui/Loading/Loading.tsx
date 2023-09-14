import React from 'react'
import KubernetesLogo from '@/assets/svgs/kubernetes.svg'

import styles from './Loading.module.scss'

function Loading() {
  return (
    <div className={styles.loading}>
      <KubernetesLogo />
      <p className={styles.loadingPhrase}>
        <span>L</span>
        <span>o</span>
        <span>a</span>
        <span>d</span>
        <span>i</span>
        <span>n</span>
        <span>g</span>
      </p>
    </div>
  )
}

export default Loading
