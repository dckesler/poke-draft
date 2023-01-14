import React, { useContext, useState, useEffect, useMemo } from "react";
import { Select, Button, Input } from "antd";
import { NextPage } from "next";

import { Page } from "@/components/page";
import { Card } from "components/card";
import { DraftGroupContext } from 'components/draft-group-provider'
import { DraftGroupActionTypes } from "types/draft-group";
import { Version } from "types/versions";
import { versions } from 'data/versions';
import {LoginContext} from "@/components/login-provider";
import {useRouter} from "next/router";

const Host: NextPage = () => {
  const { user } = useContext(LoginContext)
  const router = useRouter()
  const [draftName, setDraftName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [version, setVersion] = useState<Version | null>(null);
  const {dispatch} = useContext(DraftGroupContext);

  useEffect(() => {
    if (router && !user) router.push('/')
  }, [router, user])

  if (!user || !router) {
    return <Page>Loading...</Page>
  }

  return (
    <Page>
      <Card>
        <Select defaultValue={null} placeholder='Select a Version' onSelect={(e: string | null) => setVersion(e as Version | null)}>
          {versions.map(version => (
            <Select.Option
              value={version}
              key={version}
            >
              {version[0].toUpperCase()}{version.slice(1)}
            </Select.Option>
          ))}
        </Select>
        <Input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Draft name"
        />
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display name"
        />
        <Button
          onClick={async () => {
            if (!version) return;
            dispatch(
              DraftGroupActionTypes.CREATE_DRAFT_GROUP,
              {
                name: draftName,
                version: version,
                hostPlayer: {
                  name: displayName,
                  id: user.uid,
                  status: 'connected'
                }
              },
            );
          }}
          disabled={!draftName || !displayName || !version}
        >
          Create Draft Group
        </Button>
      </Card>
    </Page>
  )
};

export default Host;
