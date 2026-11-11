import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentManagerTab } from './AppointmentManagerTab';
import { CustomerDirectoryTab } from './CustomerDirectoryTab';
import { PackageConfigTab } from './PackageConfigTab';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import {
  CalendarCheck,
  Users,
  Settings,
  BarChart3,
  Droplets,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { appointments, patients } = useApp();
  const [activeTab, setActiveTab] = useState<'appointments' | 'customers' | 'packages' | 'overview'>('appointments');

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Admin Sub Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'appointments'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>1. Quản lý ca truyền &amp; Chốt chi phí</span>
            {pendingAppointmentsCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingAppointmentsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'customers'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Hồ sơ gốc Khách hàng</span>
            <span className="text-[11px] text-slate-400 font-mono">({patients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'packages'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>3. Cấu hình bảng giá 9 nhóm dịch vụ</span>
          </button>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>4. Thống kê tổng quan</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'appointments' && <AppointmentManagerTab />}
      {activeTab === 'customers' && <CustomerDirectoryTab />}
      {activeTab === 'packages' && <PackageConfigTab />}
      {activeTab === 'overview' && <AdminDashboardOverview />}
    </div>
  );
};
