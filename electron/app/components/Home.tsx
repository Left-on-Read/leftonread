import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './Home.css';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <h2>Left On Read</h2>
      <Link to={routes.COUNTER}>the greatest app of all time</Link>
    </div>
  );
}
