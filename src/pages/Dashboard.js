import React from 'react';
import { useAuth } from '../context/authContext';
export default function Dashboard() {
  const { currentUser } = useAuth;
  console.log(currentUser);
  return (
    <div>
      Dashboard
      <p></p>
    </div>
  );
}
