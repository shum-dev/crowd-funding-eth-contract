import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Header, Form, Input, Message } from "semantic-ui-react";

// import campaignFactory from "ethereum/campaignFactory";
import getCampaign from "ethereum/campaign";
import web3 from "ethereum/web3";

export const ContributeForm = ({ onSuccess }) => {
  const router = useRouter();
  const { address } = router.query;

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
      const campaign = getCampaign(address);
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: web3.utils.toWei(value, "ether") });

      onSuccess();
      setValue("");
    } catch (err) {
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
