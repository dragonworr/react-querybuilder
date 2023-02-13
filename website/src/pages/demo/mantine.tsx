/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import BrowserOnly from '@docusaurus/BrowserOnly';
import { QueryBuilderMantine } from '@react-querybuilder/mantine';
import Layout from '@theme/Layout';
import React from 'react';
import './_styles/demo.scss';
import './_styles/rqb-mantine.scss';

function ReactQueryBuilderDemo_MantineBrowser() {
  const Demo: typeof import('./_components/Demo').default = require('./_components/Demo').default;

  return (
    <QueryBuilderMantine>
      <Demo variant="mantine" />
    </QueryBuilderMantine>
  );
}

export default function ReactQueryBuilderDemo_Mantine() {
  return (
    <Layout description="React Query Builder Mantine Demo">
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => <ReactQueryBuilderDemo_MantineBrowser />}
      </BrowserOnly>
    </Layout>
  );
}
