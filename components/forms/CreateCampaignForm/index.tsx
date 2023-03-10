import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";

import campaignFactory from "ethereum/campaignFactory";
import web3 from "ethereum/web3";

export const CreateCampaignForm = () => {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const accounts = await web3.eth.getAccounts();

      await campaignFactory.methods
        .createCampaign(value)
        .send({ from: accounts[0] });

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <Button primary loading={isLoading} disabled={isLoading || !value}>
        Create!
      </Button>
    </Form>
  );
};
