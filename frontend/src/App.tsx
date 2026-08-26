import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { KeyManagement } from './pages/KeyManagement';
import { Settings } from './pages/Settings';
import { MasterKeySetup } from './pages/MasterKeySetup';
import { useKeyStore } from './store/useKeyStore';

function App() {
    const { masterKeyStatus, checkMasterKeyStatus, error } = useKeyStore();
    const [isInitializing, setIsInitializing] = React.useState(true);

    useEffect(() => {
        // Wait a bit to ensure Wails is ready
        const timer = setTimeout(() => {
            checkMasterKeyStatus().catch(() => {
                // Wails might not be ready yet, retry
                setTimeout(checkMasterKeyStatus, 500);
            });
            setIsInitializing(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [checkMasterKeyStatus]);

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Initializing...</p>
                </div>
            </div>
        );
    }

    // Si la llave maestra no está configurada o aún no se ha verificado
    if (masterKeyStatus === 'notset' || masterKeyStatus === 'set') {
        return <MasterKeySetup />;
    }

    // Si ya está verificada, mostrar la aplicación principal
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="keys" element={<KeyManagement />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
