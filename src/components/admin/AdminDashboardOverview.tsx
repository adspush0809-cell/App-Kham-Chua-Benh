import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';
import {
  Users,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  Stethoscope,
  Activity,
  Award,
  Droplets,
  MapPin,
  PhoneCall,
} from 'lucide-react';

export const AdminDashboardOverview: React.FC = () => {
  const { appointments, patients, serviceGroups, doctors, medicalRecords, hotlinePhone } = useApp();

  const totalRevenue = appointments.reduce((sum, apt) => {
    return sum + (apt.isFinalPriceConfirmed && apt.finalActualPrice ? apt.finalActualPrice : apt.estimatedPriceMin);
  }, 0);

  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const inProgressCount = appointments.filter((a) => a.status === 'in_progress').length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Doanh thu dịch vụ
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {formatVND(totalRevenue)}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Từ {appointments.length} ca đặt truyền
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Lượt truyền tại nhà
            </span>
            <div className="text-xl sm:text-2xl font-black text-teal-700 mt-1">
              {appointments.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {completedCount} đã hoàn thành • {inProgressCount} đang truyền
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Droplets className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Bệnh nhân Cần Thơ
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-700 mt-1">
              {patients.length}
            </div>
            <span className="text-[11px] text-indigo-600 font-bold mt-1 block">
              100% hồ sơ nhà riêng
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Phiếu truyền ký số
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-700 mt-1">
              {medicalRecords.length}
            </div>
            <span className="text-[11px] text-purple-600 font-bold mt-1 block">
              Khóa vĩnh viễn BYT
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 9 Service Groups Breakdown & Doctor Mobile Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service popularity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            Nhu Cầu Theo 9 Nhóm Dịch Vụ Truyền Dịch
          </h3>
          <div className="space-y-2.5">
            {serviceGroups.map((grp) => {
              const matchedCount = appointments.filter((a) =>
                a.selectedServices?.some((s) => s.groupId === grp.id)
              ).length;
              const percent = appointments.length > 0 ? Math.round((matchedCount / appointments.length) * 100) : 0;

              return (
                <div key={grp.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      Nhóm {grp.groupNumber}: {grp.name.replace(`Nhóm ${grp.groupNumber}: `, '')}
                    </span>
                    <span className="font-semibold text-slate-600">
                      {matchedCount} lượt ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-600"
                      style={{ width: `${Math.max(percent, 10)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Doctor Mobile Teams in Can Tho */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Tổ Cấp Cứu &amp; Y Bác Sĩ Lưu Động
            </h3>
            <span className="text-xs text-rose-600 font-extrabold flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5" />
              Hotline: {hotlinePhone}
            </span>
          </div>

          <div className="space-y-3">
            {doctors.map((doc) => {
              const assignedCount = appointments.filter((a) => a.doctorId === doc.id).length;

              return (
                <div
                  key={doc.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{doc.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {doc.specialty} • {doc.room}
                      </p>
                      <span className="text-[10px] text-teal-700 font-bold block mt-0.5">
                        Hotline di động: {doc.phone}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {assignedCount} ca phụ trách
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
