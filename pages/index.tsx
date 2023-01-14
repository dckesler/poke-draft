import { useContext } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { LoginContext } from '@/components/login-provider'
import styles from '../styles/Home.module.css'
import {Button} from 'antd'

const Home: NextPage = () => {
  const { login, user } = useContext(LoginContext)
  return (
    <div className={styles.fullview}>
      <div className={styles.wideview}>
        <div className={styles.dialog}>
          <div className={styles["dialog-title"]}>
            <div className={styles["image-container"]}>
              <Image alt="PokeDraft" height="200px" width="800px" src="/assets/images/pokemon_draft_title.png" />
            </div>
          </div>
          {user ?
            <>
              <span className={styles["dialog-left"]}>Choose from a pool of pokemon but choose wisely!</span>
              <Link href="/host">
                <span className={styles["dialog-right"]}>Host New Draft</span>
              </Link>
            </> :
            <>
              <Button onClick={login}>Login</Button>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Home
