import React from 'react';
import { Link } from 'react-router-dom';
import { Nav } from 'grommet';

import styles from './Sidebar.scss';

const navData: { path: string; label: string }[] = [
  {
    path: 'products-list',
    label: 'Products List'
  },
  {
    path: 'dashboard',
    label: 'Dashboard'
  },
  {
    path: 'settings',
    label: 'Settings'
  }
];

export const Sidebar = () => (
  <Nav background='brand' direction='row' pad='medium'>
    {navData.map(({ path, label }) => (
      <Link key={path} className={styles.link} to={`/products/${path}`}>
        {label}
      </Link>
    ))}
  </Nav>
);
