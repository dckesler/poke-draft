import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Pokemon } from 'types/pokemon';
import { drafts } from 'data/draft-lists/index';
import { Version } from 'types/versions';

type PlayerDrafts = {
  [player: number]: Pokemon[],
}

export function useDraft(version: Version, playerCount: number) {
  const onDeckSize = 4;

  const blankPlayerDrafts: PlayerDrafts = useMemo(() => {
    const drafts: PlayerDrafts = {};
    for (let i = 0; i < playerCount; i++) {
      drafts[i] = []
    }
    return drafts;
  }, [])

  const [draftList, setDraftList] = useState<Pokemon[]>(drafts[version]);
  const [error, setError] = useState<Error | null>(null);
  const [onDeck, setOnDeck] = useState<Pokemon[]>([]);
  const [draftingPlayer, setDraftingPlayer] = useState<number>(1);
  const [playerDrafts, setPlayerDrafts] = useState<PlayerDrafts>(blankPlayerDrafts);

  const readyOnDeck = useCallback(()  => {
    const newDraftList = draftList.slice();
    const onDeckMons = [];
    for (let i = 0; i < onDeckSize; i++) {
      const randomIndex = Math.floor(Math.random() * draftList.length);
      onDeckMons.push(newDraftList.splice(randomIndex, 1)[0])
    }
    setOnDeck(onDeckMons);
    setDraftList(newDraftList);
  }, [draftList])

  const draftMon = useCallback((mon: Pokemon) => {
    const draftedMon = onDeck.find(({ id }) => id === mon.id);
    if (!draftedMon) {
      setError(new Error('Drafted Pokemon doesn\'t exist on deck'));
      // This is pretty broken at this point but maybe we can recover if it somehow happens
      return;
    }
    const newPlayerDrafts = {
      ...playerDrafts,
      [draftingPlayer]: [...playerDrafts[draftingPlayer], draftedMon]
    };
    const newDraftList = [...draftList, ...onDeck.filter(({ id }) => id !== mon.id)]
    const nextPlayer = draftingPlayer !== playerCount ? draftingPlayer + 1 : 1;

    setDraftList(newDraftList);
    setDraftingPlayer(nextPlayer)
    setPlayerDrafts(newPlayerDrafts)
  }, [onDeck, draftList, playerCount, playerDrafts, draftingPlayer]);

  return {
    readyOnDeck,
    error,
    onDeck,
    draftMon,
    setPlayerDrafts,
  }
}
