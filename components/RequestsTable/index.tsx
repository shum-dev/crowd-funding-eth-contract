import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Message, Table } from "semantic-ui-react";

import getCampaign from "ethereum/campaign";
import web3 from "ethereum/web3";

type FundRequest = {
  description: string;
  complete: boolean;
  value: string;
  recipient: string;
  approvalCount: string;
};

type Props = {
  requests: FundRequest[];
  contributorsCount: string;
};

export const RequestsTable = ({ requests, contributorsCount }: Props) => {
  const router = useRouter();
  const { address } = router.query as { address: string };

  const [state, setState] = useState<FundRequest[]>(requests);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

  const refreshState = async () => {
    const campaign = getCampaign(address);
    const requestCount = (await campaign.methods
      .getRequestsCount()
      .call()) as number;

    const pendingRequests = Array.from({ length: requestCount }).map(
      (_, index) => campaign.methods.requests(index).call()
    );

    const requests = (await Promise.all(pendingRequests)) as FundRequest[];

    setState(requests);
  };

  const handleApprove = async (id: number) => {
    setIsLoading({ ...isLoading, [id]: true });
    setError("");

    const campaign = getCampaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
      await refreshState();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  const handleFinalize = async (id: number) => {
    setIsLoading({ ...isLoading, [id]: true });
    setError("");

    const campaign = getCampaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
      await refreshState();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  const { Header, Row, HeaderCell, Cell, Body, Footer } = Table;

  return (
    <>
      <Table fixed>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>

        <Body>
          {state.map((request, index) => {
            const isReadyToFinalize =
              Number(request.approvalCount) / Number(contributorsCount) > 0.5;
            return (
              <Row
                key={request.description + index}
                disabled={request.complete}
                positive={isReadyToFinalize && !request.complete}
              >
                <Cell>{index}</Cell>
                <Cell>{request.description}</Cell>
                <Cell textAlign="center">
                  {web3.utils.fromWei(request.value, "ether")}
                </Cell>
                <Cell title={request.recipient}>{request.recipient}</Cell>
                <Cell textAlign="center">
                  {request.approvalCount}/{contributorsCount}
                </Cell>
                <Cell>
                  <Button
                    size="mini"
                    primary
                    compact
                    fluid
                    basic
                    onClick={() => handleApprove(index)}
                    loading={isLoading[index]}
                    disabled={isLoading[index] || request.complete}
                  >
                    Approve
                  </Button>
                </Cell>
                <Cell>
                  {isReadyToFinalize && (
                    <Button
                      size="mini"
                      color="teal"
                      compact
                      fluid
                      basic
                      onClick={() => handleFinalize(index)}
                      loading={isLoading[index]}
                      disabled={isLoading[index] || request.complete}
                    >
                      Finalize
                    </Button>
                  )}
                </Cell>
              </Row>
            );
          })}
        </Body>

        <Footer>
          <Row>
            <HeaderCell colSpan="7">
              Found {requests.length} requests
            </HeaderCell>
          </Row>
        </Footer>
      </Table>

      {error && <Message error header="Oops!" content={error} />}
    </>
  );
};
