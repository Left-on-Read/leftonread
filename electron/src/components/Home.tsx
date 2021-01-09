import React from 'react';
import { Link } from 'react-router-dom';
// import styles from './Home.css';

// Example. This is not actually used.
export default function Home() {
  return (
    <div data-tid="container">
      <h2>Left On Read</h2>
      <Link to="/home">the greatest app of all time</Link>
    </div>
  );
}
