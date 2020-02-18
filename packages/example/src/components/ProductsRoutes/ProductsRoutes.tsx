import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ProductsList } from '../ProductsList/ProductsList';

export const ProductsRoutes = () => (
  <Switch>
    <Route path='/products/products-list'>
      <ProductsList />
    </Route>
    <Route path='/products/dashboard'>Dashboard</Route>
    <Route path='/products/settings'>Settings</Route>
  </Switch>
);
