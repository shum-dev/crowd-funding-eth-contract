export const initialErrorHandler = (err: Error) => {
  const example = "Returned values aren't valid, did it run Out of Gas?";

  return err.message.startsWith(example)
    ? {
        error: {
          statusCode: 409,
          message:
            "Access to the blockcahin denied. Please check your Metamask current account. It should be connected to Sepolia Test Network.",
        },
      }
    : {
        error: 500,
        message: "Internal Server Error",
      };
};
