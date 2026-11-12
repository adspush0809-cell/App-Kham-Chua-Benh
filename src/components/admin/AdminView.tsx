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
    <div className="space-y-6 pb-24 md:pb-6 overflow-x-hidden">
      {/* Desktop Admin Sub Navigation Tabs (hidden on mobile, uses Bottom Nav instead) */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
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

      {/* Mobile Top Header Indicator */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>ADMIN CẦN THƠ:</span>
          <span className="text-teal-300 font-extrabold uppercase">
            {activeTab === 'appointments' && 'Quản lý ca truyền'}
            {activeTab === 'customers' && 'Hồ sơ gốc khách hàng'}
            {activeTab === 'packages' && 'Bảng giá 9 nhóm'}
            {activeTab === 'overview' && 'Thống kê tổng quan'}
          </span>
        </div>
        {activeTab === 'appointments' && pendingAppointmentsCount > 0 && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {pendingAppointmentsCount} chờ duyệt
          </span>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === 'appointments' && <AppointmentManagerTab />}
      {activeTab === 'customers' && <CustomerDirectoryTab />}
      {activeTab === 'packages' && <PackageConfigTab />}
      {activeTab === 'overview' && <AdminDashboardOverview />}

      {/* FIXED BOTTOM NAVIGATION BAR FOR ADMIN ON MOBILE (< 768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-1 px-2 flex md:hidden items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-h-[48px] min-w-[68px] transition cursor-pointer ${
            activeTab === 'appointments'
              ? 'text-teal-700 font-bold bg-teal-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className="w-5 h-5" />
            {pendingAppointmentsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-black px-1 rounded-full">
                {pendingAppointmentsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-0.5">Ca truyền</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-h-[48px] min-w-[68px] transition cursor-pointer ${
            activeTab === 'customers'
              ? 'text-purple-700 font-bold bg-purple-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            <span className="absolute -top-1 -right-2 bg-slate-600 text-white text-[9px] font-bold px-1 rounded-full">
              {patients.length}
            </span>
          </div>
          <span className="text-[11px] mt-0.5">Khách hàng</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-h-[48px] min-w-[68px] transition cursor-pointer ${
            activeTab === 'packages'
              ? 'text-sky-700 font-bold bg-sky-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">Bảng giá</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-h-[48px] min-w-[68px] transition cursor-pointer ${
            activeTab === 'overview'
              ? 'text-emerald-700 font-bold bg-emerald-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px] mt-0.5">Thống kê</span>
        </button>
      </div>
    </div>
  );
};
