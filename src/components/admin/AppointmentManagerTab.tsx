import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, Appointment } from '../../types';
import { formatVND, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  Phone,
  Send,
  CheckCircle2,
  Search,
  Check,
  Stethoscope,
  MapPin,
  Droplets,
  DollarSign,
  Edit3,
} from 'lucide-react';

export const AppointmentManagerTab: React.FC = () => {
  const {
    appointments,
    doctors,
    assignDoctor,
    updateAppointmentStatus,
    sendZnsReminder,
    confirmActualPrice,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sentToast, setSentToast] = useState<string | null>(null);

  // Modal / Prompt state for confirming actual final price
  const [editingActualPriceApt, setEditingActualPriceApt] = useState<Appointment | null>(null);
  const [inputActualPrice, setInputActualPrice] = useState<number>(0);

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        apt.patientName.toLowerCase().includes(q) ||
        apt.patientPhone.includes(q) ||
        apt.id.toLowerCase().includes(q) ||
        apt.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendReminder = (appointmentId: string, patientName: string) => {
    sendZnsReminder(appointmentId);
    setSentToast(`Đã phát tin nhắn nhắc lịch Zalo ZNS thành công cho ${patientName}!`);
    setTimeout(() => setSentToast(null), 4000);
  };

  const handleOpenPriceModal = (apt: Appointment) => {
    setEditingActualPriceApt(apt);
    setInputActualPrice(apt.finalActualPrice || apt.estimatedPriceMin);
  };

  const handleSaveActualPrice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActualPriceApt) return;

    confirmActualPrice(editingActualPriceApt.id, Number(inputActualPrice));
    setSentToast(
      `Đã chốt chi phí thực tế ${formatVND(inputActualPrice)} và phát thông báo Zalo ZNS tới ${editingActualPriceApt.patientName}!`
    );
    setEditingActualPriceApt(null);
    setTimeout(() => setSentToast(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {sentToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{sentToast}</span>
          </div>
          <button onClick={() => setSentToast(null)} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả ca truyền' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'confirmed', label: 'Đã duyệt' },
            { id: 'in_progress', label: 'Đang truyền' },
            { id: 'completed', label: 'Hoàn thành' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, Quận/Huyện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-base sm:text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 pl-9 focus:ring-2 focus:ring-teal-500/30"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 sm:top-2.5" />
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            Không tìm thấy ca truyền dịch nào phù hợp với bộ lọc.
          </div>
        ) : (
          filteredAppointments.map((apt) => {
            const badge = getStatusBadge(apt.status);

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 transition space-y-4"
              >
                {/* Header of Item */}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {apt.id}
                      </span>
                      <h3 className="font-bold text-base text-slate-900">
                        {apt.patientName}
                      </h3>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {apt.patientGender} • Sinh năm {apt.patientBirthYear}
                      </span>
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {apt.district}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.className}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </div>

                    {/* UNMASKED PHONE & ADDRESS FOR ADMIN ONLY */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-sky-800 font-bold font-mono">
                        <Phone className="w-3.5 h-3.5 text-sky-600" />
                        {apt.patientPhone}
                      </span>
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        {apt.patientAddress} ({apt.district})
                      </span>
                      <span className="text-slate-400">
                        Đăng ký lúc: {apt.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Overview & Actual fee confirmation status */}
                  <div className="text-right">
                    {apt.isFinalPriceConfirmed && apt.finalActualPrice ? (
                      <div>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                          ✓ ĐÃ CHỐT CHI PHÍ THỰC TẾ
                        </span>
                        <span className="font-black text-lg text-emerald-700">
                          {formatVND(apt.finalActualPrice)}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                          Chi phí ước tính:
                        </span>
                        <span className="font-bold text-sm text-teal-800">
                          {apt.estimatedPriceMin === apt.estimatedPriceMax
                            ? formatVND(apt.estimatedPriceMin)
                            : `${formatVND(apt.estimatedPriceMin)} - ${formatVND(apt.estimatedPriceMax)}`}
                        </span>
                      </div>
                    )}

                    {/* Button to confirm/edit actual fee */}
                    <button
                      type="button"
                      onClick={() => handleOpenPriceModal(apt)}
                      className="mt-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded border border-teal-200 transition cursor-pointer inline-flex items-center gap-1"
                    >
                      <DollarSign className="w-3 h-3" />
                      <span>{apt.isFinalPriceConfirmed ? 'Sửa giá chốt' : 'Chốt chi phí thực tế'}</span>
                    </button>
                  </div>
                </div>

                {/* THÔNG TIN SÀNG LỌC AN TOÀN Y TẾ CHO BÁC SĨ & ADMIN */}
                <div className="bg-amber-50/80 border border-amber-300/80 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Thông Tin Sàng Lọc An Toàn Y Tế (BS. Phúc xem trước khi truyền)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">1. Tiền sử bệnh nền:</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">
                        {apt.medicalHistory || 'Không có'}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-rose-600 block">2. Tiền sử dị ứng thuốc/thức ăn:</span>
                      <span className="font-bold text-rose-700 mt-0.5 block">
                        {apt.allergyHistory || 'Không dị ứng'}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">3. Thuốc đang sử dụng:</span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">
                        {apt.currentMedications || 'Không dùng thuốc'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details & Symptoms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Schedule & Requested Services */}
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600" />
                      <span>
                        <strong>Thời gian đến:</strong> {formatDate(apt.date)} ({apt.timeSlot})
                      </span>
                    </div>

                    <div>
                      <strong className="text-slate-700 block mb-1">Dịch vụ yêu cầu ({apt.selectedServices?.length}):</strong>
                      <div className="space-y-1">
                        {apt.selectedServices?.map((s, idx) => (
                          <div key={idx} className="bg-white p-1.5 rounded border border-slate-200 text-[11px] flex justify-between">
                            <span className="font-semibold text-slate-800">• {s.name}</span>
                            <span className="font-mono text-teal-800 font-bold">x{s.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-slate-700 italic pt-1">
                      <strong>Triệu chứng:</strong> "{apt.symptoms}"
                    </div>
                  </div>

                  {/* Right: Doctor Assignment & Actions */}
                  <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        Phân công Bác sĩ / Điều dưỡng phụ trách:
                      </label>
                      <select
                        value={apt.doctorId || ''}
                        onChange={(e) => assignDoctor(apt.id, e.target.value)}
                        className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="">-- Chưa phân công --</option>
                        {doctors.map((doc) => (
                          <option key={doc.id} value={doc.id}>
                            {doc.name} - {doc.phone} ({doc.specialty})
                          </option>
                        ))}
                      </select>
                      {apt.doctorId && (() => {
                        const assignedDoc = doctors.find((d) => d.id === apt.doctorId);
                        if (!assignedDoc) return null;
                        return (
                          <div className="flex items-center gap-2 mt-1.5 p-1.5 bg-teal-50/80 rounded-lg border border-teal-200/70">
                            <img
                              src={assignedDoc.avatar}
                              alt={assignedDoc.name}
                              className="w-6 h-6 rounded-full object-cover border border-teal-500 shrink-0"
                            />
                            <span className="text-[11px] font-bold text-teal-900 truncate">
                              {assignedDoc.name} • {assignedDoc.phone}
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        {apt.status === 'pending' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Duyệt lịch
                          </button>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer"
                          >
                            Đã hoàn thành ca truyền
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                            className="text-rose-600 hover:bg-rose-50 text-xs font-semibold px-2 py-1.5 rounded-lg border border-rose-200 transition cursor-pointer"
                          >
                            Hủy ca
                          </button>
                        )}
                      </div>

                      {/* NÚT GỬI NHẮC LỊCH QUA ZALO */}
                      <button
                        onClick={() => handleSendReminder(apt.id, apt.patientName)}
                        className="bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Gửi tin nhắn Zalo ZNS nhắc lịch tới bệnh nhân"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Gửi nhắc lịch qua Zalo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Xác nhận "Chi phí thực tế" chốt với khách hàng sau khi bác sĩ đánh giá */}
      {editingActualPriceApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-teal-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Chốt Chi Phí Thực Tế Ca Truyền
                  </h3>
                  <p className="text-xs text-slate-500">Mã: {editingActualPriceApt.id}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingActualPriceApt(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActualPrice} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div>
                  <span className="text-slate-400">Khách hàng: </span>
                  <strong className="text-slate-900">{editingActualPriceApt.patientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Địa chỉ: </span>
                  <span className="text-slate-700">{editingActualPriceApt.patientAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400">Khoảng giá dự kiến: </span>
                  <span className="font-bold text-teal-800">
                    {formatVND(editingActualPriceApt.estimatedPriceMin)} - {formatVND(editingActualPriceApt.estimatedPriceMax)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Chi Phí Thực Tế Chốt Với Khách Hàng (VNĐ) <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="number"
                  step="10000"
                  value={inputActualPrice}
                  onChange={(e) => setInputActualPrice(Number(e.target.value))}
                  required
                  className="w-full text-base font-black text-emerald-700 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                  Định dạng: <strong>{formatVND(Number(inputActualPrice))}</strong>
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-emerald-800 text-[11px]">
                ℹ️ Sau khi chốt, hệ thống sẽ tự động cập nhật vào hóa đơn và gửi thông báo Zalo ZNS xác nhận chi phí thực tế tới khách hàng.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingActualPriceApt(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác nhận &amp; Gửi Zalo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
