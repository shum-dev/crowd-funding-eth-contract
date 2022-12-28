import { useState } from "react";
import { Menu, Container } from "semantic-ui-react";

import styles from "./Header.module.css";

export const Header = () => {
  const [activeItem, setActiveItem] = useState("");

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Menu inverted className={styles.container}>
      <Container>
        <Menu.Item
          name="crowdCoin"
          active={activeItem === "crowdCoin"}
          onClick={handleItemClick}
        >
          CrowdCoin
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            name="campaigns"
            active={activeItem === "campaigns"}
            onClick={handleItemClick}
          >
            Campaigns
          </Menu.Item>

          <Menu.Item
            name="add"
            active={activeItem === "add"}
            onClick={handleItemClick}
          >
            +
          </Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu>
  );
};
