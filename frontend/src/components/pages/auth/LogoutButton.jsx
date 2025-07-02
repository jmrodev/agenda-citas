import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Button onClick={handleLogout} variant='secondary'>
      Cerrar sesión
    </Button>
  );
};

export default LogoutButton; 