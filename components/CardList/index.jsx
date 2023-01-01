import { Card } from "semantic-ui-react";
import Link from "next/link";

import styles from "./index.module.css";

export const CardList = ({ campaignsList }) => {
  const items = campaignsList.map((address) => ({
    key: address,
    header: <div className={"header " + styles.container}>{address}</div>,
    description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
    fluid: true,
  }));

  return <Card.Group items={items} />;
};
