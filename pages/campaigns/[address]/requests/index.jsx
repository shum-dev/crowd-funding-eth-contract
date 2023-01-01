import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Message, Header } from "semantic-ui-react";

import { RequestsTable } from "components/RequestsTable";

import getCampaign from "ethereum/campaign";

export default function CampaignRequestsPage({ requests, contributorsCount }) {
  const router = useRouter();
  const { address } = router.query;


  return (
    <>
      <Header as="h1">Campaign #{address} requests</Header>

      <Link href={`/campaigns/${address}/requests/new`}>
        <Button
          primary
          floated="right"
          style={{ marginBottom: "1rem" }}
          icon="add circle"
          content="Add Request"
        />
      </Link>

      <RequestsTable
        contributorsCount={contributorsCount}
        requests={requests}
      />

    </>
  );
}

CampaignRequestsPage.getInitialProps = async (ctx) => {
  const { address } = ctx.query;

  const campaign = getCampaign(address);
  const contributorsCount = await campaign.methods.contributersCount().call();
  const requestCount = await campaign.methods.getRequestsCount().call();

  const pendingRequests = Array.from({ length: requestCount }).map((_, index) =>
    campaign.methods.requests(index).call()
  );

  const requests = await Promise.all(pendingRequests);

  return {
    requests,
    contributorsCount,
  };
};
