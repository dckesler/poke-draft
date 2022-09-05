import { useRouter } from "next/router";
import type { NextPage } from "next";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import Page from "components/page";
import { gql, useApolloClient } from "@apollo/client";
import { Image, Button, Spin, Typography } from "antd";
import { capitalize } from "lodash";
import styles from "./styles.module.css";

const { Title, Paragraph } = Typography;

type Pokemon = {
  name: string;
  id: string;
};

type PokemonQuery = {
  pokemon_v2_pokemon: {
    pokemon_v2_pokemonspecy: Pokemon;
  }[];
};

const remainingSlots = [2, 3, 4, 5, 6];

const DraftVersion: NextPage = () => {
  const router = useRouter();
  const client = useApolloClient();
  const { version } = router.query;
  const [draftList, setDraftList] = useState<Pokemon[]>([]);
  const [drafted, setDrafted] = useState<Pokemon[]>([]);
  const [draftOptions, setDraftOptions] = useState<Pokemon[]>([]);
  const [starter, setStarter] = useState<Pokemon | null>(null);

  const POKEMON = useMemo(
    () =>
      gql`
    query pokemon($name: String_comparison_exp = {_eq: ${version}}) {
      pokemon_v2_pokemon(where: {pokemon_v2_encounters: {pokemon_v2_version: {name: $name}}, pokemon_v2_pokemonspecy: {evolves_from_species_id: {_is_null: true}}}) {
        pokemon_v2_pokemonspecy {
          name
          id
        }
      }
    }
    `,
    [version]
  );

  // build draft list
  useEffect(() => {
    let cleanup = false;
    if (draftList.length) return;
    (async function () {
      let result;
      try {
        result = await client.query<PokemonQuery>({ query: POKEMON });
      } catch (e) {
        console.error(e);
      }
      if (cleanup) return;
      const pokemon = result?.data?.pokemon_v2_pokemon.map(
        (pokemon) => pokemon.pokemon_v2_pokemonspecy
      );
      if (pokemon?.length) {
        setDraftList(pokemon);
      }
    })();
    return () => {
      cleanup = true;
    };
  }, [draftList, client, POKEMON]);

  const createDraftSelection = useCallback(() => {
    if (draftList.length) {
      const remainingMons = draftList.slice();
      let draftMons = [];
      for (let i = 0; i < 3; i++) {
        const max = remainingMons.length;
        const index = Math.floor(Math.random() * max);
        const mon = remainingMons.splice(index, 1)[0];
        if (!mon) alert(`${index} broke ${remainingMons.length}`)
        draftMons.push(mon);
      }
      setDraftOptions(draftMons);
      setDraftList(remainingMons);
    }
  }, [draftList]);

  const draftMon = useCallback(
    (mon: Pokemon) => {
      setDrafted((drafted) => {
        return [...drafted, mon];
      });
      if (drafted.length < 5) createDraftSelection();
    },
    [drafted, createDraftSelection]
  );

  useEffect(() => {
    if (!draftOptions.length && draftList.length) createDraftSelection();
  }, [createDraftSelection, draftOptions, draftList]);

  return (
    <Page>
      <div className={styles.header}>
        <Title level={3}>Your Team</Title>
        <div className={styles.team}>
          {drafted.map((mon) => (
            <div className={styles.filledSlot} key={mon.id}>
              <Image
                preview={false}
                className={styles.pokeImage}
                alt={mon.name}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${mon.id}.png`}
              />
            </div>
          ))}
          {starter ?
            <div className={styles.filledSlot}>
              <Image
                preview={false}
                className={styles.pokeImage}
                alt={starter.name}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${starter.id}.png`}
              />
            </div> :
            <div className={styles.openSlot}>
              <Title level={4}>Starter Slot</Title>
            </div>
          }
          {remainingSlots.slice(drafted.length).map((num) => (
            <div key={num} className={styles.openSlot}>
              <Title level={4}>{num}</Title>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.draftTable}>
        {draftOptions.length ? (
          draftOptions.map((option) => (
            <div className={styles.draftOption} key={option.id}>
              <Image
                preview={false}
                alt={option.name}
                className={styles.pokeImage}
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${option.id}.png`}
              />
              <Button
                onClick={() => {
                  draftMon(option);
                }}
                type="primary"
              >
                Draft {capitalize(option.name)}
              </Button>
            </div>
          ))
        ) : (
          <Spin size="large" />
        )}
      </div>
    </Page>
  );
};

export default DraftVersion;
