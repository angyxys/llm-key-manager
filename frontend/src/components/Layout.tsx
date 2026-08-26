import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { useKeyStore } from '../store/useKeyStore';

export const Layout: React.FC = () => {
  const { masterKeyStatus } = useKeyStore();

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar masterKeyStatus={masterKeyStatus} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
