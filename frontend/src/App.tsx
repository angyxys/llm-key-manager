import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { KeyManagement } from './pages/KeyManagement';
import { Settings } from './pages/Settings';
import { MasterKeySetup } from './pages/MasterKeySetup';
import { useKeyStore } from './store/useKeyStore';

function App() {
    const { masterKeyStatus, checkMasterKeyStatus } = useKeyStore();

    useEffect(() => {
        checkMasterKeyStatus();
    }, []);

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
