import { useEffect, useState } from "react";
import { Button, Header } from "semantic-ui-react";
import Link from "next/link";

import { CardList } from "components/CardList";
import campaignFactory from "ethereum/campaignFactory";

export default function IndexPage({ campaigns }) {
  const [campaignsList, setCampaignsList] = useState(campaigns || []);

  useEffect(() => {
    const getExistingCampaign = async () => {
      const allCampaigns = await campaignFactory.methods
        .getDeployedCampaigns()
        .call();

      setCampaignsList(allCampaigns);
    };

    getExistingCampaign();
  }, []);

  return (
    <>
      <Header as="h1">Open Campaigns</Header>

      <Link href={'/campaigns/new'}>
        <Button
          style={{ marginLeft: "1rem" }}
          content="Create Campaign"
          icon="add circle"
          primary
          floated="right"
        />
      </Link>

      <CardList campaignsList={campaignsList} />
    </>
  );
}

IndexPage.getInitialProps = async () => {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

  return {
    campaigns,
  };
};
