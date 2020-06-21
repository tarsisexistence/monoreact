import React from 'react';

import { noop } from '../utils/noop';

const BuyButton = ({ onClick }) => <button onClick={onClick}>Buy</button>;

BuyButton.defaultProps = {
  onClick: noop
};

export { BuyButton };
