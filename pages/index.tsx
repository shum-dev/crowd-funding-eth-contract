import { Button, Header } from "semantic-ui-react";
import Link from "next/link";

import { CardList } from "components/CardList";
import campaignFactory from "ethereum/campaignFactory";

type Props = {
  campaigns: string[];
};

export default function IndexPage({ campaigns }: Props) {
  return (
    <>
      <Header as="h1">Open Campaigns</Header>

      <Link href={"/campaigns/new"}>
        <Button
          title="Create new Campaign"
          style={{ marginLeft: "1rem" }}
          content="Create"
          icon="add circle"
          primary
          floated="right"
        />
      </Link>

      <CardList campaignsList={campaigns} />
    </>
  );
}

export const getServerSideProps = async () => {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call();
  return {
    props: { campaigns },
  };
};
