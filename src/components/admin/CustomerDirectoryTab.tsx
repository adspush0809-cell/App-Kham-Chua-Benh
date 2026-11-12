import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PatientProfile } from '../../types';
import { formatVND, formatDate } from '../../utils/formatters';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  ShieldCheck,
  Download,
  Eye,
  Droplets,
} from 'lucide-react';

export const CustomerDirectoryTab: React.FC = () => {
  const { patients, appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.fullName.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {exportNotice && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md animate-in fade-in">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="text-white/80 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Master Customer Database
            </span>
            <span className="text-xs text-purple-200">
              Quyền Admin Tối Cao: Toàn bộ SĐT &amp; Địa chỉ nhà được hiển thị gốc
            </span>
          </div>
          <h2 className="text-lg font-bold mt-1">Hồ Sơ Gốc Khách Hàng Truyền Dịch Tại Nhà Cần Thơ</h2>
          <p className="text-xs text-purple-200 mt-0.5">
            Xem đầy đủ Họ tên, Số điện thoại liên lạc, Địa chỉ nhà chính xác, Quận/Huyện phục vụ và Tổng chi phí tích lũy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] text-purple-200 uppercase font-semibold block">Tổng khách hàng</span>
            <span className="text-xl font-black text-white">{patients.length}</span>
          </div>
          <button
            onClick={() => {
              setExportNotice('Đã trích xuất danh sách khách hàng truyền dịch Cần Thơ (Excel/CSV simulation)');
              setTimeout(() => setExportNotice(null), 4000);
            }}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Tìm theo Họ tên, SĐT, Quận/Huyện, Địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-base sm:text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 pl-9 focus:ring-2 focus:ring-purple-500/30"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 sm:top-2.5" />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Hiển thị <strong>{filteredPatients.length}</strong> khách hàng
        </span>
      </div>

      {/* Customer Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th className="py-3 px-4">Mã KH</th>
              <th className="py-3 px-4">Họ và tên</th>
              <th className="py-3 px-4">Số điện thoại (Gốc)</th>
              <th className="py-3 px-4">Quận / Huyện Cần Thơ</th>
              <th className="py-3 px-4">Địa chỉ nhà chi tiết</th>
              <th className="py-3 px-4">Tuổi &amp; Giới tính</th>
              <th className="py-3 px-4">Tổng chi tiêu</th>
              <th className="py-3 px-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-mono font-bold text-slate-500">
                  {patient.id}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  {patient.fullName}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-sky-800">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    {patient.phone}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-teal-800">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    {patient.district}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={patient.address}>
                  {patient.address}
                </td>
                <td className="py-3 px-4 text-slate-600">
                  {patient.gender} • {patient.birthYear} ({2026 - patient.birthYear}t)
                </td>
                <td className="py-3 px-4 font-bold text-emerald-700">
                  {formatVND(patient.totalSpent)}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-200 transition cursor-pointer inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                  HỒ SƠ GỐC TOÀN DIỆN KHÁCH HÀNG (ADMIN ONLY)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedPatient.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">Số điện thoại liên hệ:</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">{selectedPatient.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quận / Huyện Cần Thơ:</span>
                  <span className="font-bold text-teal-800 text-sm">{selectedPatient.district}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block">Địa chỉ nhà chi tiết:</span>
                <span className="font-medium text-slate-800">{selectedPatient.address}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-400 block">Tổng chi phí tích lũy:</span>
                  <span className="font-black text-emerald-700 text-sm">{formatVND(selectedPatient.totalSpent)}</span>
                </div>
              </div>

              {/* SÀNG LỌC AN TOÀN Y TẾ */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  ⚠️ Thông tin sàng lọc an toàn y tế:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-amber-200">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Tiền sử bệnh:</span>
                    <span className="font-semibold text-slate-800">{selectedPatient.medicalHistory || 'Không có'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-rose-600 font-bold block">Tiền sử dị ứng:</span>
                    <span className="font-bold text-rose-700">{selectedPatient.allergyHistory || selectedPatient.allergies || 'Không dị ứng'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">Thuốc đang dùng:</span>
                    <span className="font-semibold text-slate-800">{selectedPatient.currentMedications || 'Không dùng thuốc'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List of customer's appointments */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">
                Lịch sử các lần truyền dịch ({appointments.filter(a => a.patientId === selectedPatient.id || a.patientPhone === selectedPatient.phone).length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {appointments
                  .filter((a) => a.patientId === selectedPatient.id || a.patientPhone === selectedPatient.phone)
                  .map((apt) => (
                    <div key={apt.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">
                          {apt.selectedServices?.map((s) => s.name).join(', ') || 'Truyền dịch tại nhà'}
                        </span>
                        <div className="text-slate-500 text-[11px]">
                          {formatDate(apt.date)} • {apt.timeSlot}
                        </div>
                      </div>
                      <span className="font-bold text-teal-800">
                        {apt.isFinalPriceConfirmed && apt.finalActualPrice
                          ? formatVND(apt.finalActualPrice)
                          : formatVND(apt.estimatedPriceMin)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
