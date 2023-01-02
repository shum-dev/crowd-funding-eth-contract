import { Menu, Container } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";

import styles from "./Header.module.css";

export const Header = () => {
  const router = useRouter();
  return (
    <Menu inverted className={styles.container}>
      <Container>
        <Link href={"/"} className="item">
          Home
        </Link>

        <Menu.Menu position="right">
          <Link
            href={"/"}
            className={`item ${router.asPath === "/" ? "active" : ""}`}
          >
            Campaigns
          </Link>

          <Link
            href={"/campaigns/new"}
            className={`item ${
              router.asPath === "/campaigns/new" ? "active" : ""
            }`}
          >
            +
          </Link>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};
