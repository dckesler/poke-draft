import React, { FC, useContext, useState, useEffect, useMemo } from "react";
import { Select, Button, Input } from "antd";
import { v4 as uuid } from "uuid";

import { DraftGroupContext } from 'components/draft-group-provider'
import { DraftGroupActionTypes } from "types/draft-group";
import { Version } from "types/versions";
import { versions } from 'data/versions';

type CreatDraftProps = {
}

export const CreateDraft: FC<CreatDraftProps> = () => {
  const [draftName, setDraftName] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [version, setVersion] = useState<Version | null>(null);
  const {dispatch} = useContext(DraftGroupContext);
  const draftGroupId = useMemo(() => uuid(), [])

  useEffect(() => {
    console.log('uhhh');
    dispatch(DraftGroupActionTypes.SET_DRAFT_GROUP_ID, draftGroupId);
  }, [dispatch, draftGroupId])

  return (
    <div>
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
              version: version,
              hostPlayer: {
                name: displayName,
                id: uuid(),
                status: 'connected'
              }
            },
          );
        }}
        disabled={!draftName || !displayName || !version}
      >
        Create Draft Group
      </Button>
    </div>
  )

}
