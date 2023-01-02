import { Header } from "semantic-ui-react";

import { CreateRequestForm } from "components/forms/CreateRequestForm";

export default function CampaignRequestsNewPage() {
  return (
    <>
      <Header as="h1">Create a Request</Header>

      <CreateRequestForm />
    </>
  );
}
