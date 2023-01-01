import { Button, Header } from "semantic-ui-react";
import Link from "next/link";

import { CardList } from "components/CardList";
import campaignFactory from "ethereum/campaignFactory";

export default function IndexPage({ campaigns }) {
  return (
    <>
      <Header as="h1">Open Campaigns</Header>

      <Link href={"/campaigns/new"}>
        <Button
          style={{ marginLeft: "1rem" }}
          content="Create Campaign"
          icon="add circle"
          primary
          floated="right"
        />
      </Link>

      <CardList campaignsList={campaigns} />
    </>
  );
}

IndexPage.getInitialProps = async () => {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

  return {
    campaigns,
  };
};
