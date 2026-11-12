import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLockScreen } from './AdminLockScreen';
import { AppointmentManagerTab } from './AppointmentManagerTab';
import { CustomerDirectoryTab } from './CustomerDirectoryTab';
import { DoctorManagerTab } from './DoctorManagerTab';
import { PackageConfigTab } from './PackageConfigTab';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminSecurityTab } from './AdminSecurityTab';
import {
  CalendarCheck,
  Users,
  Settings,
  BarChart3,
  Lock,
  Award,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { appointments, patients, doctors, isAdminUnlocked, lockAdmin } = useApp();
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'customers' | 'doctors' | 'packages' | 'overview' | 'security'
  >('appointments');

  // If Admin has not unlocked with PIN/Password, show Lock Screen
  if (!isAdminUnlocked) {
    return <AdminLockScreen />;
  }

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6 pb-24 md:pb-6 overflow-x-hidden">
      {/* Desktop Admin Sub Navigation Tabs with Quick Lock Button */}
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
            <span>1. Ca truyền &amp; Chốt phí</span>
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
            onClick={() => setActiveTab('doctors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'doctors'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>3. Quản lý Bác sĩ &amp; Kíp trực</span>
            <span className="text-[11px] text-teal-600 font-mono font-bold">({doctors.length})</span>
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
            <span>4. Bảng giá 9 nhóm</span>
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
            <span>5. Thống kê</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-teal-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>6. Cài đặt bảo mật (Đổi mật khẩu)</span>
          </button>
        </div>

        {/* Lock Admin Quick Action */}
        <button
          type="button"
          onClick={lockAdmin}
          className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          title="Khóa phiên làm việc Admin ngay lập tức"
        >
          <Lock className="w-3.5 h-3.5 text-rose-600" />
          <span>Khóa Admin</span>
        </button>
      </div>

      {/* Mobile Top Header Indicator with Lock Button */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-3.5 py-2.5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold truncate mr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
          <span className="text-teal-300 font-black uppercase text-[11px] truncate">
            {activeTab === 'appointments' && 'Ca truyền & Chốt phí'}
            {activeTab === 'customers' && 'Hồ sơ gốc khách hàng'}
            {activeTab === 'doctors' && 'Quản lý Bác sĩ'}
            {activeTab === 'packages' && 'Bảng giá 9 nhóm'}
            {activeTab === 'overview' && 'Thống kê tổng quan'}
            {activeTab === 'security' && 'Cài đặt bảo mật / Đổi mật khẩu'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {activeTab === 'appointments' && pendingAppointmentsCount > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {pendingAppointmentsCount} chờ duyệt
            </span>
          )}
          <button
            type="button"
            onClick={lockAdmin}
            className="p-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs font-bold flex items-center gap-1 transition"
            title="Khóa phiên Admin"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="text-[10px]">Khóa</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'appointments' && <AppointmentManagerTab />}
      {activeTab === 'customers' && <CustomerDirectoryTab />}
      {activeTab === 'doctors' && <DoctorManagerTab onNavigateToSecurity={() => setActiveTab('security')} />}
      {activeTab === 'packages' && <PackageConfigTab />}
      {activeTab === 'overview' && <AdminDashboardOverview />}
      {activeTab === 'security' && <AdminSecurityTab />}

      {/* FIXED BOTTOM NAVIGATION BAR FOR ADMIN ON MOBILE (< 768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-1 px-1.5 flex md:hidden items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[46px] min-w-[50px] shrink-0 transition cursor-pointer ${
            activeTab === 'appointments'
              ? 'text-teal-700 font-bold bg-teal-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <CalendarCheck className="w-4 h-4" />
            {pendingAppointmentsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[8px] font-black px-1 rounded-full">
                {pendingAppointmentsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Ca truyền</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[46px] min-w-[50px] shrink-0 transition cursor-pointer ${
            activeTab === 'customers'
              ? 'text-purple-700 font-bold bg-purple-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Users className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 bg-slate-600 text-white text-[8px] font-bold px-1 rounded-full">
              {patients.length}
            </span>
          </div>
          <span className="text-[10px] mt-0.5">Khách</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[46px] min-w-[50px] shrink-0 transition cursor-pointer ${
            activeTab === 'doctors'
              ? 'text-teal-700 font-bold bg-teal-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Award className="w-4 h-4" />
            <span className="absolute -top-1 -right-2 bg-teal-600 text-white text-[8px] font-bold px-1 rounded-full">
              {doctors.length}
            </span>
          </div>
          <span className="text-[10px] mt-0.5">Bác sĩ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('packages')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[46px] min-w-[50px] shrink-0 transition cursor-pointer ${
            activeTab === 'packages'
              ? 'text-sky-700 font-bold bg-sky-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Bảng giá</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[46px] min-w-[50px] shrink-0 transition cursor-pointer ${
            activeTab === 'overview'
              ? 'text-emerald-700 font-bold bg-emerald-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Thống kê</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl min-h-[46px] min-w-[50px] shrink-0 transition cursor-pointer ${
            activeTab === 'security'
              ? 'text-amber-700 font-bold bg-amber-50 shadow-2xs'
              : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] mt-0.5 font-bold">Bảo mật</span>
        </button>
      </div>
    </div>
  );
};
