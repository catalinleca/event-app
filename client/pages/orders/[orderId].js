import { useEffect, useState } from 'react';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    // we manually invoke it immediately because setInterval will wait 1 s
    // before first run
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      // otherwise setInterval will run forever
      clearInterval(timerId);
    };
  }, [order]);

  return (
    <div>
      Time left to pay:
      {timeLeft}
      {' '}
      seconds
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
