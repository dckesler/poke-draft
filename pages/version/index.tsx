import type { NextPage } from 'next';
import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Select, Anchor, Spin, Typography } from 'antd';
import Page from 'components/page'
const { Title } = Typography;

const VERSIONS = gql`
  query versions {
    pokemon_v2_version {
      name
      id
  }
}
`
type Version = {
  name: string,
  id: string,
}

type Versions = {
  pokemon_v2_version: Version[]
}

const VersionPage: NextPage = () => {
  const { loading, error, data } = useQuery<Versions>(VERSIONS);
  const [version, setVersion] = useState<string | null>(null)


  if (loading || !data) {
    return (
      <Page>
        <Title level={3}>Choose a Region</Title>
        <Spin size='large' />
      </Page>
    )
  }

  return (
    <Page>
      <Title level={3}>Choose a Version</Title>
      <Select defaultValue={null} placeholder='Select a Version' onSelect={(e: string | null) => setVersion(e)}>
        {data.pokemon_v2_version.map(version => (
          <Select.Option
            value={version.name}
            key={version.id}
          >
            {version.name[0].toUpperCase()}{version.name.slice(1)}
          </Select.Option>
        ))}
      </Select>
      {version && <Anchor><Anchor.Link title="Start draft" href={`/draft/${version}`}/></Anchor>}
    </Page>
  )
}

export default VersionPage;
