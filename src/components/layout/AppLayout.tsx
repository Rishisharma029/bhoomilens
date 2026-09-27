import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      <Navbar />
      <div className="flex-1 flex w-full min-h-[calc(100vh-65px)]">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
