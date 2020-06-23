import React from 'react';

import { BuyButton } from './BuyButton';
import { capitalize } from '../utils/capitalize';
import { normalizeProducts } from '../utils/products';

interface Props {
  items: { id: string; name: string; quantity: number }[];
}

export const Products = ({ items }: Props): JSX.Element => (
  <section>
    <ul>
      {normalizeProducts(items).map((name: string) => (
        <li>${capitalize(name)}</li>
      ))}
    </ul>

    <BuyButton onClick={(event: FocusEvent) => event.preventDefault()} />
  </section>
);
