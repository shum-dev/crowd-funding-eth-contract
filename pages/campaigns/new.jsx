import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Header, Form, Input, Message } from "semantic-ui-react";

import campaignFactory from "ethereum/campaignFactory";
import web3 from "ethereum/web3";

export default function CampaignsNewPage() {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await campaignFactory.methods
        .createCampaign(value)
        .send({ from: accounts[0] });

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("CampaignsNewPage re-renders: ", error);
  return (
    <>
      <Header as="h1">Create a Campaign</Header>

      <Form onSubmit={onSubmit} error={Boolean(error)}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={value}
            onChange={handleChange}
          />
        </Form.Field>

        <Message error header="Oops!" content={error} />

        <Button primary loading={isLoading} disabled={isLoading}>
          Create!
        </Button>
      </Form>
    </>
  );
}
