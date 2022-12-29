import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Header, Form, Input, Message } from "semantic-ui-react";

import campaignFactory from "ethereum/campaignFactory";
import web3 from "ethereum/web3";

export default function CampaignPage({ slug }) {
  const router = useRouter();
  const { address } = router.query;

  console.log("CampaignPage re-renders: ", { address, slug });
  return (
    <>
      <Header as="h1">Campaign #{address}</Header>
    </>
  );
}

// CampaignPage.getInitialProps = async (ctx) => {
//   const { query } = ctx;
//   console.log("CampaignPage.getInitialProps: ", { query });

//   return {
//     slug: query.address,
//   };
// };
