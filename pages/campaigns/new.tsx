import { Header } from "semantic-ui-react";

import { CreateCampaignForm } from "components/forms/CreateCampaignForm";

export default function CampaignsNewPage() {
  return (
    <>
      <Header as="h1">Create a Campaign</Header>

      <CreateCampaignForm />
    </>
  );
}
