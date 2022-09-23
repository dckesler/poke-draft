import { useContext } from 'react'

import { DraftGroupContext } from 'components/draft-group-provider'

export const useDraftGroup = () => {
  const [draftGroupState, draftGroupDispatch] = useContext(DraftGroupContext);

}
