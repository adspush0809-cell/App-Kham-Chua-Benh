import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { formatDate, getStatusBadge, formatVND } from '../../utils/formatters';
import { PatientDetailDrawer } from './PatientDetailDrawer';
import {
  Stethoscope,
  ShieldCheck,
  Lock,
  EyeOff,
  Calendar,
  Clock,
  User,
  ChevronRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Droplets,
  MapPin,
  PhoneCall,
} from 'lucide-react';

export const DoctorView: React.FC = () => {
  const {
    activeDoctorId,
    doctors,
    appointments,
    updateAppointmentStatus,
    maskPhone,
    maskAddress,
    hotlinePhone,
  } = useApp();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterMode, setFilterMode] = useState<'today' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  const currentDoctor = doctors.find((d) => d.id === activeDoctorId) || doctors[0];

  const todayStr = '2026-11-12';

  // Filter appointments assigned to this doctor
  const doctorAppointments = appointments.filter((a) => {
    const isAssigned =
      a.doctorId === currentDoctor.id ||
      a.doctorName?.includes('BS. Phúc') ||
      a.doctorName?.includes(currentDoctor.name);
    if (!isAssigned) return false;

    if (filterMode === 'today') {
      return a.date === todayStr || a.date === '2026-11-12';
    }
    return true;
  });

  const filteredAppointments = doctorAppointments.filter((a) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.patientName.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.district.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Doctor Profile & Clinical Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentDoctor.avatar}
            alt={currentDoctor.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {currentDoctor.title}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-300" />
                Cần Thơ (Lưu động)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              {currentDoctor.name}
            </h1>
            <p className="text-xs text-teal-200 mt-0.5">
              Chuyên khoa: <span className="font-semibold text-white">{currentDoctor.specialty}</span> • Hotline: {hotlinePhone}
            </p>
          </div>
        </div>

        {/* Doctor Status stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
            <span className="text-[11px] text-teal-200 uppercase font-semibold block">Ca truyền hôm nay</span>
            <span className="text-xl font-black text-white">{doctorAppointments.length}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
            <span className="text-[11px] text-teal-200 uppercase font-semibold block">Trạng thái</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-center mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Đang trực cấp cứu
            </span>
          </div>
        </div>
      </div>

      {/* STRICT PRIVACY BANNER */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl p-4 text-xs text-amber-900 shadow-2xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
          <EyeOff className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <div className="font-extrabold text-sm text-amber-950 flex items-center gap-2">
            <span>QUY TẮC BẢO MẬT DỮ LIỆU BỆNH NHÂN (STRICT PRIVACY POLICY)</span>
            <span className="bg-amber-200/80 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Bắt buộc tuân thủ
            </span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Hệ thống tự động <strong>che giấu tuyệt đối Số điện thoại và Địa chỉ nhà</strong> của bệnh nhân nhằm bảo vệ quyền riêng tư theo quy chuẩn. Bác sĩ chỉ xem được Họ tên, Năm sinh, Giới tính, Dịch vụ chỉ định và Triệu chứng lâm sàng.
          </p>
          <div className="text-[11px] text-amber-700 flex items-center gap-1 pt-1 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Quy tắc khóa dữ liệu: Hồ sơ sau khi ký số sẽ bị niêm phong vĩnh viễn, không có quyền xóa hay chỉnh sửa.</span>
          </div>
        </div>
      </div>

      {/* Queue Toolbar: Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterMode('today')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'today'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Ca truyền hôm nay ({todayStr})</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {doctorAppointments.length}
            </span>
          </button>

          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'all'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tất cả các ca được phân công</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân, mã số..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Patients Queue List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
            <Droplets className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Không có ca truyền nào trong danh sách</h4>
            <p className="text-xs text-slate-400">
              Chưa có ca truyền dịch tại nhà nào được phân công cho {currentDoctor.name} trong mục này.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredAppointments.map((apt) => {
              const badge = getStatusBadge(apt.status);

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-teal-400 transition-all shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left: Patient Clinical Identity */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {apt.id}
                      </span>
                      <span className="text-base font-extrabold text-slate-900">
                        {apt.patientName}
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                        {apt.patientGender} • Sinh năm {apt.patientBirthYear} ({2026 - apt.patientBirthYear} tuổi)
                      </span>
                      <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md font-bold">
                        {apt.district}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </div>

                    {/* MASKED CONTACT (Doctor cannot see phone or address) */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="text-slate-400">SĐT:</span>
                        <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                          {maskPhone(apt.patientPhone)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <span className="text-slate-400">Địa chỉ:</span>
                        <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
                          {maskAddress(apt.patientAddress)}
                        </span>
                      </div>
                    </div>

                    {/* Clinical Services & Symptoms */}
                    <div className="pt-1 text-xs space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-slate-500">Dịch vụ yêu cầu:</span>
                        {apt.selectedServices?.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded text-[11px] font-semibold"
                          >
                            {s.name} (x{s.quantity})
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(apt.date)} ({apt.timeSlot})</span>
                      </div>

                      <p className="text-slate-700 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                        <strong className="not-italic text-slate-800">Triệu chứng khai báo: </strong>
                        "{apt.symptoms}"
                      </p>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'in_progress')}
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-2.5 rounded-xl border border-indigo-200 transition cursor-pointer"
                      >
                        Bắt đầu truyền
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedAppointment(apt)}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Hồ sơ &amp; Ghi phiếu truyền</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Patient Detail Drawer */}
      {selectedAppointment && (
        <PatientDetailDrawer
          appointment={selectedAppointment}
          doctor={currentDoctor}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};
