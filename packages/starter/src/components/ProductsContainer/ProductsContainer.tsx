import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Sidebar } from '../Sidebar/Sidebar';
import { ProductsRoutes } from '../ProductsRoutes/ProductsRoutes';
import styles from './ProductsContainer.scss';

export const ProductsContainer = () => (
  <div className={styles.container}>
    <BrowserRouter>
      <Sidebar />
      <ProductsRoutes />
    </BrowserRouter>
  </div>
);
