'use client';

import React from 'react';

import StoreProvider from './redux';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};
export default DashboardWrapper;
