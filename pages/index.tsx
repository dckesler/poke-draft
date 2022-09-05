import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.fullview}>
      <div className={styles.wideview}>
        <div className={styles.dialog}>
          <div className={styles["dialog-title"]}>
            <div className={styles["image-container"]}>
              <Image height="200px" width="800px" src="/pokemon_draft_title.png" />
            </div>
          </div>
          <span className={styles["dialog-left"]}>Choose from a pool of pokemon but choose wisely!</span>
          <Link href="/version">
            <a className={styles["dialog-right"]}>FIGHT</a>
          </Link>
          <Link href="/version">
            <a className={styles["dialog-botleft"]}>VERSION</a>
          </Link>
          <Link href="/version">
            <a className={styles["dialog-botright"]}>QUIT</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
