import { useState } from "react";
import { Menu, Container } from "semantic-ui-react";
import Link from "next/link";

import styles from "./Header.module.css";

export const Header = () => {
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Menu inverted className={styles.container}>
      <Container>
        <Link href={"/"} className="item">
          CrowdCoin
        </Link>

        <Menu.Menu position="right">
          <Link href={"/"} className="item">
            Campaigns
          </Link>

          <Link href={"/campaigns/new"} className="item">
            +
          </Link>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};
