import { Card } from "semantic-ui-react";
import Link from "next/link";

import styles from "./index.module.css";

export const CardList = ({ campaignsList }) => {
  const items = campaignsList.map((address) => ({
    key: address,
    header: <div className={styles.container}>{address}</div>,
    description: <Link href={`campaigns/${address}`}>View Campaign</Link>,
    fluid: true, // every card takes all the space in the row
  }));

  return <Card.Group items={items} />;
};
