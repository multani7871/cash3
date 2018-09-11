import React from "react";

const Environment = () => {
  return (
    <div>
      <br />
      environment: {process.env.REACT_APP_ENV}
      <br />
      webhook: {process.env.REACT_APP_WEBHOOK}
    </div>
  );
};

export default Environment;