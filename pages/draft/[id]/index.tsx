import React, { useContext, useEffect } from 'react'
import { NextPage } from 'next'
import {useRouter} from "next/router";

import { Page } from "components/page";
import { DraftGroupContext } from '@/components/draft-group-provider'
import {LoginContext} from '@/components/login-provider';
import { DraftGroupActionTypes } from 'types/draft-group';

const Draft: NextPage = () => {
  const { draftGroup, dispatch } = useContext(DraftGroupContext)
  const router = useRouter()
  const { user } = useContext(LoginContext)
  const draftId = router.query.id
  useEffect(() => {
    console.log(user)
    if (typeof draftId !== 'string' || !user) return;
    if (!draftGroup.id || draftGroup.id !== draftId) {
      dispatch(DraftGroupActionTypes.JOIN_DRAFT_GROUP, { playerId: user.uid, id: draftId })
    }
  }, [user, draftId, dispatch, draftGroup])

  return (
    <Page>
      {draftGroup.name || 'Loading...'}
    </Page>
  )
}

export default Draft;
