import Queue from "bull";

// what we will store inside the job object
interface Payload {
  orderId: string;
}
const expirationQueue = new Queue<Payload>("order:expiration", {
  // we want to tell bull to use the redis instance from our pod
  redis: {
    host: process.env.REDIS_HOST // expiration-depl.yaml
  }
});

// code to process the job after redis sends it back
expirationQueue.process(async (job) => {
  // job - obj that wraps up our data with more info
  console.log("I want to publish and exp complete event for orderId", job.data.orderId);
})


export { expirationQueue }
