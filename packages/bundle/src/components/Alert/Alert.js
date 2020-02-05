import React from 'react';
import PropTypes from 'prop-types';
import styles from './Alert.css';

const AlertComponent = ({ message = 'this is an alert' }) => (
    <div className={styles.Alert}>
      <span>{message}</span>
    </div>
);

AlertComponent.propTypes = {
  message: PropTypes.string,
};

export default AlertComponent;
