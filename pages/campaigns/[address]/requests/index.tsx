import { useRouter } from "next/router";
import Link from "next/link";
import { NextPageContext } from "next";
import { Button, Header } from "semantic-ui-react";

import { initialErrorHandler } from "utils/initialErrorHandler";

import { RequestsTable } from "components/RequestsTable";

import getCampaign from "ethereum/campaign";

type FundRequest = {
  description: string;
  complete: boolean;
  value: string;
  recipient: string;
  approvalCount: string;
};

type Props = {
  requests: FundRequest[];
  contributorsCount: string;
};

export default function CampaignRequestsPage({
  requests,
  contributorsCount,
}: Props) {
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

CampaignRequestsPage.getInitialProps = async (ctx: NextPageContext) => {
  const { address } = ctx.query;

  try {
    const campaign = getCampaign(address as string);
    const contributorsCount = await campaign.methods.contributersCount().call();
    const requestCount = (await campaign.methods
      .getRequestsCount()
      .call()) as number;

    const pendingRequests = Array.from({ length: requestCount }).map(
      (_, index) => campaign.methods.requests(index).call()
    );

    const requests = await Promise.all(pendingRequests);

    return {
      requests,
      contributorsCount,
    };
  } catch (err: any) {
    return {
      ...initialErrorHandler(err),
    };
  }
};
