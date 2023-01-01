import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Message, Table } from "semantic-ui-react";

import getCampaign from "ethereum/campaign";
import web3 from "ethereum/web3";

export const RequestsTable = ({ requests, contributorsCount }) => {
  const router = useRouter();
  const { address } = router.query;

  const [state, setState] = useState(requests);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState({});

  const refreshState = async () => {
    const campaign = getCampaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();

    const pendingRequests = Array.from({ length: requestCount }).map(
      (_, index) => campaign.methods.requests(index).call()
    );

    const requests = await Promise.all(pendingRequests);
    setState(requests);
  };

  const handleApprove = async (id) => {
    setIsLoading({ ...isLoading, [id]: true });
    setError("");

    const campaign = getCampaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({ from: accounts[0] });
      await refreshState();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading((prevState) => ({ ...prevState, [id]: false }));
    }
  };

  const handleFinalize = async (id) => {
    setIsLoading({ ...isLoading, [id]: true });
    setError("");

    const campaign = getCampaign(address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
      await refreshState();
    } catch (error) {
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
              request.approvalCount / contributorsCount > 0.5;
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
