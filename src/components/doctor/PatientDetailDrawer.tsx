import React, { useState } from 'react';
import { Appointment, Doctor } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatVND, formatDate } from '../../utils/formatters';
import { NewMedicalRecordModal } from './NewMedicalRecordModal';
import {
  X,
  Lock,
  ShieldCheck,
  EyeOff,
  Stethoscope,
  Activity,
  Heart,
  Pill,
  FilePlus,
  Clock,
  Calendar,
  FileText,
  User,
  Droplets,
  MapPin,
} from 'lucide-react';

interface PatientDetailDrawerProps {
  appointment: Appointment;
  doctor: Doctor;
  onClose: () => void;
}

export const PatientDetailDrawer: React.FC<PatientDetailDrawerProps> = ({
  appointment,
  doctor,
  onClose,
}) => {
  const { medicalRecords, maskPhone, maskAddress } = useApp();
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);

  // Filter all records of this patient
  const patientRecords = medicalRecords.filter(
    (r) => r.patientId === appointment.patientId
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold">
              {appointment.patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{appointment.patientName}</h3>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-teal-200 font-medium">
                  {appointment.patientGender} • Sinh năm {appointment.patientBirthYear} (
                  {2026 - appointment.patientBirthYear} tuổi)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <span>Mã ca truyền:</span>
                <span className="font-mono text-teal-300 font-bold">{appointment.id}</span>
                <span>• {appointment.district}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STRICT PRIVACY BANNER (Required) */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-start gap-3">
          <EyeOff className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">QUY TẮC BẢO MẬT Y TẾ (STRICT PRIVACY ENFORCED): </span>
            Bác sĩ chỉ được phép truy cập Họ tên, Năm sinh, Giới tính, Dịch vụ truyền dịch và Triệu chứng lâm sàng.
            Số điện thoại cá nhân và Địa chỉ cư trú đã được che giấu tuyệt đối.
          </div>
        </div>

        {/* Drawer Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* KHUNG THÔNG TIN SÀNG LỌC Y TẾ NỔI BẬT CHO BÁC SĨ (Required) */}
          <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-2 border-rose-300 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-rose-200/90 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  !
                </span>
                <span className="font-extrabold text-xs sm:text-sm text-rose-950 uppercase tracking-tight">
                  Thông Tin Sàng Lọc An Toàn Y Tế (BS. Phúc Đọc Kỹ Trước Khi Truyền)
                </span>
              </div>
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                Sàng lọc bắt buộc
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block text-rose-900">
                  1. Tiền sử bệnh nền:
                </span>
                <p className="font-semibold text-slate-900 leading-snug">
                  {appointment.medicalHistory || 'Không ghi nhận'}
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block text-rose-900">
                  2. Tiền sử dị ứng:
                </span>
                <p className="font-bold text-rose-600 leading-snug">
                  {appointment.allergyHistory || 'Không dị ứng'}
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-rose-200 space-y-1">
                <span className="font-bold text-slate-800 text-[11px] block text-rose-900">
                  3. Thuốc đang sử dụng:
                </span>
                <p className="font-semibold text-slate-900 leading-snug">
                  {appointment.currentMedications || 'Không dùng thuốc'}
                </p>
              </div>
            </div>
          </div>

          {/* Patient Masked Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" />
                Hồ Sơ Y Khoa Của Bệnh Nhân
              </span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {appointment.district}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Họ và tên:</span>
                <span className="font-bold text-slate-800 text-sm">{appointment.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Năm sinh &amp; Giới tính:</span>
                <span className="font-semibold text-slate-700">
                  {appointment.patientBirthYear} ({2026 - appointment.patientBirthYear} tuổi) • {appointment.patientGender}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Số điện thoại:</span>
                <span className="font-mono font-bold text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded text-[11px]">
                  {maskPhone(appointment.patientPhone)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Địa chỉ nhà:</span>
                <span className="font-mono text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded text-[11px]">
                  {maskAddress(appointment.patientAddress)}
                </span>
              </div>
            </div>

            {/* Selected infusion services list */}
            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-slate-500 block text-[11px] font-bold mb-1">
                Dịch vụ truyền dịch bệnh nhân yêu cầu:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {appointment.selectedServices?.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-white border border-teal-200 text-teal-900 text-xs px-2.5 py-1 rounded-lg font-semibold shadow-2xs"
                  >
                    • {s.name} (Số lượng: {s.quantity} {s.unit})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <span className="text-slate-400 block text-[11px] font-semibold">
                Triệu chứng / Lý do truyền dịch khai báo:
              </span>
              <p className="text-xs text-slate-800 font-medium mt-1 bg-white p-2.5 rounded-lg border border-slate-200 italic">
                "{appointment.symptoms}"
              </p>
            </div>
          </div>

          {/* Action Button: Thêm bệnh án / Ghi phiếu truyền */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                Lịch Sử Phiếu Truyền Dịch ({patientRecords.length} lần)
              </h4>
              <p className="text-[11px] text-slate-500">
                Toàn bộ hồ sơ đã ký số và khóa vĩnh viễn (Không có quyền sửa hoặc xóa)
              </p>
            </div>

            <button
              onClick={() => setShowNewRecordModal(true)}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <FilePlus className="w-4 h-4" />
              <span>Ghi phiếu truyền mới</span>
            </button>
          </div>

          {/* List of Past Medical Records - STRICT DATA LOCK: NO DELETE, NO EDIT */}
          {patientRecords.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-500 text-xs space-y-2">
              <Droplets className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">Chưa có phiếu truyền dịch nào trước đó</p>
              <p className="text-[11px]">Bấm vào "Ghi phiếu truyền mới" ở trên để ghi nhận diễn biến sinh hiệu và phác đồ dịch truyền.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patientRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 relative overflow-hidden"
                >
                  {/* Permanent Lock Stamp */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        ĐÃ KHÓA &amp; KÝ SỐ VĨNH VIỄN
                      </span>
                      <span className="font-mono text-xs text-slate-400 font-bold">
                        {record.id}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {record.date}
                    </span>
                  </div>

                  {/* Doctor Info */}
                  <div className="text-xs text-slate-600">
                    Bác sĩ ký số: <span className="font-bold text-slate-800">{record.doctorTitle} {record.doctorName}</span>
                  </div>

                  {/* Vital signs bar */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Huyết áp</span>
                      <span className="font-bold text-slate-800">{record.vitalSigns.bloodPressure}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nhịp tim</span>
                      <span className="font-bold text-rose-600">{record.vitalSigns.heartRate} bpm</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">SpO2 / Nhiệt độ</span>
                      <span className="font-bold text-slate-800">{record.vitalSigns.spo2}% / {record.vitalSigns.temperature}°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Thể trọng</span>
                      <span className="font-bold text-teal-700">{record.vitalSigns.weight} kg</span>
                    </div>
                  </div>

                  {/* Infusion details */}
                  <div className="bg-teal-50/50 p-2.5 rounded-lg border border-teal-100 text-xs text-slate-700 space-y-1">
                    <div><strong>Dịch truyền:</strong> {record.infusionDetails.solutions}</div>
                    <div><strong>Tốc độ giọt:</strong> {record.infusionDetails.dripRate} • <strong>Ven:</strong> {record.infusionDetails.veinSite}</div>
                    <div><strong>Đáp ứng:</strong> {record.infusionDetails.toleranceStatus}</div>
                  </div>

                  {/* Clinical Diagnosis */}
                  <div className="text-xs space-y-1">
                    <span className="text-slate-400 font-semibold block text-[11px]">
                      Chẩn đoán lâm sàng:
                    </span>
                    <div className="font-bold text-slate-900 bg-sky-50/60 p-2 rounded-lg border border-sky-100">
                      {record.clinicalDiagnosis}
                    </div>
                    <p className="text-slate-600 mt-1">
                      <strong>Xử trí:</strong> {record.treatmentPlan}
                    </p>
                  </div>

                  {/* Doctor advice */}
                  {record.doctorAdvice && (
                    <div className="text-xs bg-amber-50/50 p-2 rounded-lg border border-amber-100 text-slate-700">
                      <strong>Lời dặn:</strong> {record.doctorAdvice}
                    </div>
                  )}

                  {/* Immutability footer - Explicitly states no delete/edit */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {record.digitalSignature}
                    </span>
                    <span className="text-slate-400 italic">
                      [Bảo lưu hồ sơ - Không có quyền chỉnh sửa / xóa]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            Đóng hồ sơ
          </button>
        </div>

        {/* New Medical Record Modal */}
        {showNewRecordModal && (
          <NewMedicalRecordModal
            appointment={appointment}
            doctor={doctor}
            onClose={() => setShowNewRecordModal(false)}
            onSuccess={() => setShowNewRecordModal(false)}
          />
        )}
      </div>
    </div>
  );
};
