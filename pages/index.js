import { useEffect, useState } from "react";
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

  console.log("Index page re-renders: ", { campaignsList });
  return <pre>{campaignsList}</pre>;
}

IndexPage.getInitialProps = async () => {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();

  console.log("Get initial props: ", { campaigns });

  return {
    campaigns,
  };
};
