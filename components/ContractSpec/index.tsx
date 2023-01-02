import { useRouter } from "next/router";
import Link from "next/link";
import { Card, Button } from "semantic-ui-react";

import web3 from "ethereum/web3";

type Props = {
  contractSpec: {
    manager: string;
    minimumContribution: string;
    requestCount: string;
    contributorsCount: string;
    balance: string;
  };
};

export const ContractSpec = ({ contractSpec }: Props) => {
  const router = useRouter();
  const { address } = router.query;

  const items = [
    {
      header: contractSpec.manager,
      meta: "Address of Manager",
      description:
        "The manager created this campaign and can create requests to withdraw money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: contractSpec.minimumContribution,
      meta: "Minimum Contribution (wei)",
      description:
        "You must contribute at least this much wei to become a contributor",
      style: { overflowWrap: "break-word" },
    },
    {
      header: contractSpec.requestCount,
      meta: "Number of Requests",
      description:
        "A request tries to withdraw money from the contract. Request must be approved by the contributors.",
      style: { overflowWrap: "break-word" },
      extra: (
        <Link href={`/campaigns/${address}/requests`}>
          <Button size="mini" primary compact fluid basic>
            View Requests
          </Button>
        </Link>
      ),
    },
    {
      header: contractSpec.contributorsCount,
      meta: "Number of Contributors",
      description:
        "Number of people who have already donated to this campaign.",
      style: { overflowWrap: "break-word" },
    },
    {
      header: web3.utils.fromWei(contractSpec.balance, "ether"),
      meta: "Campaign Balance (ether)",
      description:
        "The balance is how much money this balance has left to spend",
      style: { overflowWrap: "break-word" },
    },
  ];

  return <Card.Group items={items} centered />;
};
