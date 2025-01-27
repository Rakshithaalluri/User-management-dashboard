import React from 'react';

export const Alert = ({ variant, children }) => {
  return (
    <div className={`alert ${variant}`}>
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }) => (
  <p className="alert-description">{children}</p>
);

export default Alert