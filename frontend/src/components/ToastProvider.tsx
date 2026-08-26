import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        closeButton
      />
      {children}
    </>
  );
};

export { toast } from 'sonner';
