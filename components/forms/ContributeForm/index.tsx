import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Input, Message } from "semantic-ui-react";

import getCampaign from "ethereum/campaign";
import web3 from "ethereum/web3";

type Props = {
  onSuccess: () => void;
};

export const ContributeForm = ({ onSuccess }: Props) => {
  const router = useRouter();
  const { address } = router.query as { address: string };

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
      const campaign = getCampaign(address);
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });

      onSuccess();
      setValue("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={onSubmit} error={Boolean(error)}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={handleChange}
        />
      </Form.Field>

      <Message error header="Oops!" content={error} />

      <Button primary loading={isLoading} disabled={isLoading || !value}>
        Contribute!
      </Button>
    </Form>
  );
};
