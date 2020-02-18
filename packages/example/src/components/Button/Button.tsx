import React from 'react';
import t from 'prop-types';

const Button = ({ children, type }) => <button type={type}>{children}</button>;

Button.propTypes = {
  type: t.oneOf(['button', 'submit', 'reset'])
};
Button.defaultProps = {
  type: 'button'
};

export default Button;
