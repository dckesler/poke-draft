import React, { useContext, useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import type { NextPage } from "next";
import { Button, Input } from "antd";

import Page from "components/page";
import {DraftGroupProvider} from "components/draft-group-provider";
import {Version} from "types/versions";
import { CreateDraft } from './create-draft';

const Host: NextPage = () => {
  const draftGroupId = useMemo(() => uuid(), []);
  return (
    <Page>
      <CreateDraft />
    </Page>
  );
};

export default Host;
