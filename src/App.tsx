import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import Dashboard from './components/dashboard/Dashboard';
import LockerManagement from './components/lockers/LockerManagement';
import StudentManagement from './components/students/StudentManagement';
import RentalManagement from './components/rentals/RentalManagement';
import UserManagement from './components/users/UserManagement';
import LocalManagement from './components/locais/LocalManagement';  // importe o componente Locais

const AppRouter: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentRoute, setCurrentRoute] = React.useState('dashboard');

  React.useEffect(() => {
    // Redireciona para hash reset-password se necessário
    if (
      window.location.pathname === '/reset-password' &&
      !window.location.hash.startsWith('#reset-password')
    ) {
      window.location.hash = 'reset-password';
    }

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'dashboard';
      setCurrentRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Handle password reset
  if (currentRoute.startsWith('reset-password')) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      return (
        <ResetPasswordForm
          token={token}
          onSuccess={() => {
            alert('Senha redefinida com sucesso! Faça login com sua nova senha.');
            window.location.href = '/';
          }}
        />
      );
    }
  }

  if (!user) {
    return <LoginForm />;
  }

  switch (currentRoute) {
    case 'lockers':
      return <LockerManagement />;
    case 'students':
      return <StudentManagement />;
    case 'rentals':
      return <RentalManagement />;
    case 'locais':        // novo case para locais
      return <LocalManagement />;
    case 'users':
      if (user.role === 'admin') {
        return <UserManagement />;
      }
      return <Dashboard />;
    case 'dashboard':
    default:
      return <Dashboard />;
      case 'locais':
  return <LocalManagement />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
