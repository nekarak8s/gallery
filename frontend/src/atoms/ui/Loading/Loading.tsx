import React from 'react'
import KubernetesLogo from '../../../assets/svgs/kubernetes.svg'
import styles from './Loading.module.scss'

function Loading() {
  return (
    <div className={styles.loading}>
      <KubernetesLogo />
    </div>
  )
}

export default Loading
