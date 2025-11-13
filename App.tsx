import React from 'react';
import { GlobalStateProvider, useGlobalState } from './context/GlobalStateContext';
import { Toaster } from 'react-hot-toast';
import AuthPage from './pages/auth/AuthPage';
import Layout from './components/Layout';
import GenerateImagePage from './pages/user/GenerateImagePage';
import BuyCreditsPage from './pages/user/BuyCreditsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import PaymentRequestsPage from './pages/admin/PaymentRequestsPage';
import SettingsPage from './pages/admin/SettingsPage';

// Fix: Removed React.FC type to resolve a subtle typing issue.
const AppContent = () => {
    const { state } = useGlobalState();
    const { isAuthenticated, currentUser, activePage } = state;

    if (!isAuthenticated || !currentUser) {
        return <AuthPage />;
    }

    const renderContent = () => {
        if (currentUser.role === 'admin') {
            switch (activePage) {
                case 'dashboard': return <AdminDashboard />;
                case 'users': return <UserManagementPage />;
                case 'payments': return <PaymentRequestsPage />;
                case 'settings': return <SettingsPage />;
                default: return <AdminDashboard />;
            }
        } else {
            switch (activePage) {
                case 'generate': return <GenerateImagePage />;
                case 'credits': return <BuyCreditsPage />;
                default: return <GenerateImagePage />;
            }
        }
    };
    
    return <Layout>{renderContent()}</Layout>;
}

function App() {
  return (
    <GlobalStateProvider>
        <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                className: '',
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }}
        />
        <AppContent />
    </GlobalStateProvider>
  );
}

export default App;