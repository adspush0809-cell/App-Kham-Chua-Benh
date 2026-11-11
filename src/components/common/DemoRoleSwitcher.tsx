import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  User,
  Stethoscope,
  ShieldAlert,
  RotateCcw,
  Bell,
  CheckCircle2,
  Lock,
  ChevronDown,
  PhoneCall,
  Activity,
  MapPin,
} from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const {
    role,
    setRole,
    activeDoctorId,
    setActiveDoctorId,
    activePatientId,
    setActivePatientId,
    doctors,
    patients,
    znsNotifications,
    setActiveZnsModal,
    resetToDefaultData,
    hotlinePhone,
  } = useApp();

  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0];
  const activeDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-lg border-b border-slate-800">
      {/* Top Banner Notice & Hotline */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 px-4 py-1.5 text-xs text-white font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
            TP. CẦN THƠ
          </span>
          <span className="hidden sm:inline font-semibold">
            "Sức khỏe của bạn là ưu tiên của chúng tôi!" — An toàn – Chuyên nghiệp – Tận tâm
          </span>
          {role === 'doctor' && (
            <span className="bg-amber-500/30 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded flex items-center gap-1 font-semibold animate-pulse">
              <Lock className="w-3 h-3" />
              Bảo mật y tế: SĐT &amp; Địa chỉ nhà được ẩn tuyệt đối
            </span>
          )}
          {role === 'admin' && (
            <span className="bg-sky-500/30 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3 h-3" />
              Admin: Xem hồ sơ gốc, phân công &amp; Chốt chi phí thực tế
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Call BS. Phuc */}
          <a
            href={`tel:${hotlinePhone}`}
            className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold px-3 py-1 rounded-full text-xs transition shadow-sm animate-pulse cursor-pointer"
            title="Gọi ngay hotline Bác sĩ Phúc"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>BS. Phúc: {hotlinePhone}</span>
          </a>

          <button
            onClick={() => {
              if (znsNotifications.length > 0) {
                setActiveZnsModal(znsNotifications[0]);
              }
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer"
            title="Mở trình giả lập Zalo ZNS"
          >
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Zalo ZNS:</span>
            <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {znsNotifications.length}
            </span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Khôi phục 9 nhóm dịch vụ truyền dịch tại nhà Cần Thơ về mặc định?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-1 text-slate-300 hover:text-white text-xs px-2 py-1 rounded transition hover:bg-white/10 cursor-pointer"
            title="Khôi phục trạng thái ban đầu"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 flex items-center justify-center shadow-md shadow-teal-500/20 font-black text-white text-xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">
                Truyền Dịch Tại Nhà Cần Thơ
              </span>
              <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5 text-rose-400" />
                Cần Thơ 24/7
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Phụ trách chuyên môn: <strong className="text-teal-300">BS. Phúc – 0969799467</strong>
            </p>
          </div>
        </div>

        {/* 3 Role Selection Buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 shadow-inner">
          {/* Patient Role Button */}
          <button
            onClick={() => handleRoleChange('patient')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              role === 'patient'
                ? 'bg-gradient-to-r from-sky-500 to-teal-600 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-300/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Bệnh nhân</span>
            {role === 'patient' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-200 hidden sm:inline" />}
          </button>

          {/* Doctor Role Button */}
          <button
            onClick={() => handleRoleChange('doctor')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              role === 'doctor'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/25 ring-1 ring-teal-300/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Bác sĩ (BS. Phúc)</span>
            {role === 'doctor' && <CheckCircle2 className="w-3.5 h-3.5 text-teal-200 hidden sm:inline" />}
          </button>

          {/* Admin Role Button */}
          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-300/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin</span>
            {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-200 hidden sm:inline" />}
          </button>
        </div>

        {/* Role Persona Sub-Selector */}
        <div className="flex items-center gap-2 text-xs">
          {role === 'patient' && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 hidden md:inline">Đóng vai:</span>
              <div className="relative">
                <select
                  value={activePatientId}
                  onChange={(e) => setActivePatientId(e.target.value)}
                  className="bg-slate-900 text-sky-300 font-semibold text-xs rounded px-2 py-1 pr-6 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer appearance-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.district})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 hidden md:inline">Bác sĩ:</span>
              <div className="relative">
                <select
                  value={activeDoctorId}
                  onChange={(e) => setActiveDoctorId(e.target.value)}
                  className="bg-slate-900 text-emerald-300 font-semibold text-xs rounded px-2 py-1 pr-6 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer appearance-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 text-purple-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span>Điều phối viên Trung tâm Cần Thơ</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
