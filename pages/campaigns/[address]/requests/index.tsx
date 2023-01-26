import { useRouter } from "next/router";
import Link from "next/link";
import { GetServerSideProps } from "next";

import { Button, Header } from "semantic-ui-react";

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
      <Header
        as="h1"
        title={address}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Campaign #{address} requests
      </Header>

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

type SSProps = {
  requests: unknown[];
  contributorsCount: unknown;
};

type QueryType = {
  address: string;
};

export const getServerSideProps: GetServerSideProps<
  SSProps,
  QueryType
> = async (context) => {
  const { address } = context.params as QueryType;

  const campaign = getCampaign(address);
  const contributorsCount = await campaign.methods.contributersCount().call();
  const requestCount = (await campaign.methods
    .getRequestsCount()
    .call()) as number;

  const pendingRequests = Array.from({ length: requestCount }).map(
    (_, index) =>
      campaign.methods.requests(index).call() as Promise<FundRequest>
  );

  const rawRequests = await Promise.all(pendingRequests);

  const requests = rawRequests.map((item) => ({
    description: item.description,
    complete: item.complete,
    value: item.value,
    recipient: item.recipient,
    approvalCount: item.approvalCount,
  }));

  return {
    props: {
      requests,
      contributorsCount,
    },
  };
};
