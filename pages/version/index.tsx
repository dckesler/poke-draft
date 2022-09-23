import { useRouter } from "next/router";
import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Select, Anchor, Typography } from 'antd';
import Page from 'components/page';
import { versions } from 'data/versions';
import { useDraftList } from 'apis/draft-list';

const { Title } = Typography;

const VersionPage: NextPage = () => {
  const [version, setVersion] = useState<string | null>(null)
  const router = useRouter();
  const [totalMons] = useDraftList(router.query.version);

  return (
    <Page>
      <Title level={3}>Choose a Version</Title>
      <Select defaultValue={null} placeholder='Select a Version' onSelect={(e: string | null) => setVersion(e)}>
        {versions.map(version => (
          <Select.Option
            value={version}
            key={version}
          >
            {version[0].toUpperCase()}{version.slice(1)}
          </Select.Option>
        ))}
      </Select>
      {version && <Anchor><Anchor.Link title="Start draft" href={`/draft/${version}`}/></Anchor>}
    </Page>
  )
}

export default VersionPage;
