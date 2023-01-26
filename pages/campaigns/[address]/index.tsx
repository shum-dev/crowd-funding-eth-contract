import { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Header, Grid } from "semantic-ui-react";

import { ContributeForm } from "components/forms/ContributeForm";
import { ContractSpec } from "components/ContractSpec";

import getCampaign from "ethereum/campaign";

type Props = {
  minimumContribution: string;
  balance: string;
  requestCount: string;
  contributorsCount: string;
  manager: string;
};

export default function CampaignPage({
  minimumContribution,
  balance,
  requestCount,
  contributorsCount,
  manager,
}: Props) {
  const router = useRouter();
  const { address } = router.query;

  const [contractSpec, setContractSpec] = useState({
    minimumContribution,
    balance,
    requestCount,
    contributorsCount,
    manager,
  });

  const onSuccess = async () => {
    const campaign = getCampaign(address as string);
    const summary = (await campaign.methods.getSummary().call()) as {};

    const [
      minimumContribution,
      balance,
      requestCount,
      contributorsCount,
      manager,
    ] = Object.values(summary) as string[];

    setContractSpec({
      minimumContribution,
      balance,
      requestCount,
      contributorsCount,
      manager,
    });
  };

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
        Campaign #{address}
      </Header>

      <Grid columns={2} stackable reversed="mobile">
        <Grid.Column width={10}>
          <ContractSpec contractSpec={contractSpec} />
        </Grid.Column>

        <Grid.Column width={6}>
          <ContributeForm onSuccess={onSuccess} />
        </Grid.Column>
      </Grid>
    </>
  );
}

type SSProps = {
  minimumContribution: string;
  balance: string;
  requestCount: string;
  contributorsCount: string;
  manager: string;
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
  const summary = (await campaign.methods.getSummary().call()) as string[];

  return {
    props: {
      minimumContribution: summary[0],
      balance: summary[1],
      requestCount: summary[2],
      contributorsCount: summary[3],
      manager: summary[4],
    },
  };
};
