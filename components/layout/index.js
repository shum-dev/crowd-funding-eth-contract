import { Container } from "semantic-ui-react";

import { Header } from "./Header";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  );
};
