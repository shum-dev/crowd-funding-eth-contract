import { useEffect, useState } from "react";
import { Card, Button, Header } from "semantic-ui-react";

import campaignFactory from "../ethereum/campaignFactory";

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

  // TODO memoize
  const items = campaignsList.map((address) => ({
    header: address,
    description: <a>View Campaign</a>,
    fluid: true, // every card takes all the space in the row
  }));

  console.log("Index page re-renders: ", { campaignsList });
  return (
    <div>
      <Header as="h1">Open Campaigns</Header>
      <Card.Group items={items} />
      <Button content="Create Campaign" icon="add circle" primary />
    </div>
  );
}

IndexPage.getInitialProps = async () => {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

  console.log("Get initial props: ", { campaigns });

  return {
    campaigns,
  };
};
