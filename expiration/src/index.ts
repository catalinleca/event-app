import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID is required!");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL is required!");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID is required!");
  }

  try {
    // in nats-depl.yaml at args -> -cid and ticketing
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    // we could put these in the connect method but we want them in a more central location
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed");

      // if NATS pods goes down, the process exists entirely
      // tickets deployment pod will go down and will be started
      // again by the deployment
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

  } catch (err) {
    console.error(err);
  }
};

start();
