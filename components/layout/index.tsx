import { ReactNode } from "react";
import { Container } from "semantic-ui-react";

import { Header } from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <Container>{children}</Container>
    </>
  );
};
