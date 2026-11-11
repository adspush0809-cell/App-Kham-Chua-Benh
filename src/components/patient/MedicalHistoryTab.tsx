import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicalRecord, Appointment } from '../../types';
import { formatVND, formatDate, getStatusBadge } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  Heart,
  Thermometer,
  ShieldCheck,
  CheckCircle,
  Printer,
  ChevronRight,
  User,
  Stethoscope,
  Info,
  Droplets,
  MapPin,
  PhoneCall,
} from 'lucide-react';

export const MedicalHistoryTab: React.FC = () => {
  const {
    appointments,
    medicalRecords,
    patients,
    activePatientId,
    hotlinePhone,
  } = useApp();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Find current active patient
  const currentPatient = patients.find((p) => p.id === activePatientId) || patients[0];

  // Filter appointments for this patient
  const myAppointments = appointments.filter(
    (a) => a.patientId === currentPatient.id || a.patientPhone === currentPatient.phone
  );

  // Filter medical records for this patient
  const myRecords = medicalRecords.filter((r) => r.patientId === currentPatient.id);

  return (
    <div className="space-y-6">
      {/* Patient Profile Card */}
      <div className="bg-gradient-to-r from-teal-700 via-sky-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold shadow-inner">
            {currentPatient.fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{currentPatient.fullName}</h2>
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-medium">
                {currentPatient.gender} • Sinh năm {currentPatient.birthYear}
              </span>
            </div>
            <div className="text-xs text-teal-100 mt-1 flex flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-300" />
                {currentPatient.district || 'TP. Cần Thơ'}
              </span>
              <span>SĐT: {currentPatient.phone}</span>
              <span>Dị ứng: {currentPatient.allergies}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-right">
          <div className="text-[11px] text-teal-200 uppercase tracking-wider font-semibold">
            Chi phí y tế tích lũy
          </div>
          <div className="text-lg font-black text-white">
            {formatVND(currentPatient.totalSpent)}
          </div>
          <div className="text-[10px] text-teal-200 mt-0.5">
            Hotline BS. Phúc: {hotlinePhone}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Home Infusion Appointments */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Droplets className="w-4 h-4 text-teal-600" />
              Lịch truyền dịch tại nhà ({myAppointments.length})
            </h3>
          </div>

          {myAppointments.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border border-slate-200 text-slate-500 text-xs">
              Bạn chưa có lịch hẹn truyền dịch nào. Hãy chọn dịch vụ và đặt lịch để BS. Phúc đến hỗ trợ!
            </div>
          ) : (
            <div className="space-y-3">
              {myAppointments.map((apt) => {
                const badge = getStatusBadge(apt.status);
                const relatedRecord = myRecords.find(
                  (r) => r.appointmentId === apt.id || (r.patientId === apt.patientId && apt.status === 'completed')
                );

                return (
                  <div
                    key={apt.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:border-teal-300 transition-all shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {apt.id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${badge.className}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug">
                      {apt.selectedServices?.map((s) => s.name).join(', ') || 'Truyền dịch tại nhà'}
                    </h4>

                    <div className="text-xs text-slate-500 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(apt.date)}</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400 ml-2" />
                        <span>{apt.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{apt.district}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-700 font-medium">
                        <Stethoscope className="w-3.5 h-3.5" />
                        <span>{apt.doctorName || 'BS. Phúc (0969799467)'}</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        {apt.isFinalPriceConfirmed && apt.finalActualPrice ? (
                          <div>
                            <span className="text-[10px] text-slate-400 block">Chi phí thực tế:</span>
                            <span className="font-extrabold text-emerald-700">
                              {formatVND(apt.finalActualPrice)}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[10px] text-slate-400 block">Dự kiến:</span>
                            <span className="font-bold text-teal-800">
                              {apt.estimatedPriceMin === apt.estimatedPriceMax
                                ? formatVND(apt.estimatedPriceMin)
                                : `${formatVND(apt.estimatedPriceMin)} - ${formatVND(apt.estimatedPriceMax)}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {relatedRecord ? (
                        <button
                          onClick={() => setSelectedRecord(relatedRecord)}
                          className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 text-[11px] bg-teal-50 px-2.5 py-1.5 rounded-lg cursor-pointer transition hover:bg-teal-100"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Xem bệnh án
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Đang theo dõi</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Infusion Medical Record */}
        <div className="lg:col-span-2">
          {selectedRecord ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
              {/* Record Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Phiếu Truyền Dịch Điện Tử Đã Ký Số
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedRecord.id}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Bệnh Án &amp; Giám Sát Truyền Dịch Tại Nhà Cần Thơ
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Thời gian: {selectedRecord.date} • Người thực hiện: {selectedRecord.doctorTitle} {selectedRecord.doctorName}
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="no-print bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>In phiếu truyền</span>
                </button>
              </div>

              {/* Vital Signs Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-500" />
                  Dấu Hiệu Sinh Tồn Trước &amp; Sau Truyền
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Huyết áp</div>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">
                      {selectedRecord.vitalSigns.bloodPressure}{' '}
                      <span className="text-[10px] font-normal text-slate-400">mmHg</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Nhịp tim</div>
                    <div className="text-base font-extrabold text-rose-600 mt-0.5 flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {selectedRecord.vitalSigns.heartRate}{' '}
                      <span className="text-[10px] font-normal text-slate-400">bpm</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Thân nhiệt &amp; SpO2</div>
                    <div className="text-base font-extrabold text-slate-800 mt-0.5">
                      {selectedRecord.vitalSigns.temperature}°C / {selectedRecord.vitalSigns.spo2}%
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Thể trọng</div>
                    <div className="text-base font-extrabold text-teal-700 mt-0.5">
                      {selectedRecord.vitalSigns.weight} kg
                    </div>
                  </div>
                </div>
              </div>

              {/* Infusion Clinical Details */}
              <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 space-y-2 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-teal-600" />
                  Chi Tiết Kỹ Thuật Truyền Dịch &amp; Đáp Ứng Lâm Sàng
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <strong>Loại dịch truyền:</strong> {selectedRecord.infusionDetails.solutions}
                  </div>
                  <div>
                    <strong>Tốc độ giọt:</strong> {selectedRecord.infusionDetails.dripRate}
                  </div>
                  <div>
                    <strong>Vị trí lấy ven:</strong> {selectedRecord.infusionDetails.veinSite}
                  </div>
                  <div>
                    <strong>Tình trạng người bệnh:</strong> {selectedRecord.infusionDetails.toleranceStatus}
                  </div>
                </div>
              </div>

              {/* Diagnosis and Treatment */}
              <div className="space-y-3 bg-sky-50/50 p-4 rounded-xl border border-sky-100 text-xs">
                <div>
                  <span className="font-bold text-sky-900 block">Triệu chứng lúc đến khám:</span>
                  <p className="text-slate-700 italic mt-0.5">"{selectedRecord.symptoms}"</p>
                </div>
                <div>
                  <span className="font-bold text-sky-900 block">Chẩn đoán xác định:</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedRecord.clinicalDiagnosis}</p>
                </div>
                <div>
                  <span className="font-bold text-sky-900 block">Hướng xử trí &amp; phác đồ:</span>
                  <p className="text-slate-700 mt-0.5">{selectedRecord.treatmentPlan}</p>
                </div>
              </div>

              {/* Prescriptions / Medication Given */}
              {selectedRecord.prescriptions.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    Thuốc Uống Kèm Theo Sau Truyền ({selectedRecord.prescriptions.length} loại)
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Tên thuốc</th>
                          <th className="py-2.5 px-3">Liều dùng</th>
                          <th className="py-2.5 px-3">Số lượng</th>
                          <th className="py-2.5 px-3">Hướng dẫn</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedRecord.prescriptions.map((rx, idx) => (
                          <tr key={rx.id}>
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{idx + 1}. {rx.medicineName}</td>
                            <td className="py-2.5 px-3 text-slate-600">{rx.dosage}</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-700">{rx.quantity}</td>
                            <td className="py-2.5 px-3 text-slate-600 italic">{rx.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Doctor Advice */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Info className="w-4 h-4 text-amber-600" />
                  Lời dặn của Bác sĩ Phúc:
                </div>
                <p className="text-slate-700 leading-relaxed">{selectedRecord.doctorAdvice}</p>
              </div>

              {/* Digital Signature */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    Chữ ký số: <code className="font-mono font-bold text-slate-700">{selectedRecord.digitalSignature}</code>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Đã khóa vĩnh viễn lúc: {selectedRecord.lockedAt}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-800">
                Chi Tiết Bệnh Án &amp; Nhật Ký Truyền Dịch
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Chọn một lịch truyền đã hoàn thành ở danh sách bên trái để kiểm tra diễn biến sinh hiệu, dung dịch đã truyền và lời dặn theo dõi sau truyền.
              </p>
              {myRecords.length > 0 && (
                <button
                  onClick={() => setSelectedRecord(myRecords[0])}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Xem bệnh án gần nhất ({myRecords[0].id})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
