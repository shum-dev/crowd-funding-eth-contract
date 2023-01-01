import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Header,
  Card,
  Grid,
  Button,
  Form,
  Message,
  Input,
} from "semantic-ui-react";

import getCampaign from "ethereum/campaign";
import web3 from "ethereum/web3";

import styles from "./index.module.css";

export const CreateRequestForm = () => {
  const router = useRouter();
  const { address } = router.query;

  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");
    const campaign = getCampaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      const valueWei = web3.utils.toWei(value, "ether");
      await campaign.methods
        .createRequest(description, valueWei, recipient)
        .send({ from: accounts[0] });

      router.push(`/campaigns/${address}/requests`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} error={Boolean(error)}>
      <Form.Field>
        <label>Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Value</label>
        <Input
          label="ether"
          labelPosition="right"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label>Recipient</label>
        <Input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </Form.Field>

      <Message error header="Oops!" content={error} />

      <Button primary loading={isLoading} disabled={isLoading}>
        Create
      </Button>

      <Link href={`/campaigns/${address}/requests`} className={styles.link}>
        Back
      </Link>
    </Form>
  );
};
