import { useState } from "react";
import { Menu, Container } from "semantic-ui-react";
import Link from "next/link";

import styles from "./Header.module.css";

export const Header = () => {
  return (
    <Menu inverted className={styles.container}>
      <Container>
        <Link href={"/"} className="item">
          Home
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
