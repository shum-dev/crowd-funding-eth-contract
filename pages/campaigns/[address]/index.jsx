import { useState } from "react";
import { useRouter } from "next/router";
import { Header, Grid } from "semantic-ui-react";

import { ContributeForm } from "components/forms/ContributeForm";
import { ContractSpec } from "components/ContractSpec";

import getCampaign from "ethereum/campaign";

export default function CampaignPage({
  minimumContribution,
  balance,
  requestCount,
  contributorsCount,
  manager,
}) {
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
    const campaign = getCampaign(address);
    const summary = await campaign.methods.getSummary().call();

    const [
      minimumContribution,
      balance,
      requestCount,
      contributorsCount,
      manager,
    ] = Object.values(summary);

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
      <Header as="h1">Campaign #{address}</Header>

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

CampaignPage.getInitialProps = async (ctx) => {
  const { address } = ctx.query;

  const campaign = getCampaign(address);
  const summary = await campaign.methods.getSummary().call();

  return {
    minimumContribution: summary[0],
    balance: summary[1],
    requestCount: summary[2],
    contributorsCount: summary[3],
    manager: summary[4],
  };
};
