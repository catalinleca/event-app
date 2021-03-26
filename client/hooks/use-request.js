import axios from 'axios';
import { useState } from 'react';

const useRequest = ({
  url,
  method,
  body,
  onSuccess,
}) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {
              err.response.data.errors.map((responseErr) => (
                <li key={responseErr.message}>{responseErr.message}</li>
              ))
            }
          </ul>
        </div>,
      );

      throw err;
    }
  };

  return {
    doRequest,
    errors,
  };
};

export default useRequest;
