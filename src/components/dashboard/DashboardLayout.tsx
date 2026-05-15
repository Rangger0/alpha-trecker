import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardContent } from './DashboardContent';

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#0f1115]">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  );
}
