import React from 'react';
import t from 'prop-types';

// eslint-disable-next-line react/button-has-type
const Button = ({ children, type }) => <button type={type}>{children}</button>;

Button.propTypes = {
  type: t.oneOf(['button', 'submit', 'reset'])
};
Button.defaultProps = {
  type: 'button'
};

// mdx doesnt work with named exports
// eslint-disable-next-line import/no-default-export
export default Button;
