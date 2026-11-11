import React, { useState } from 'react';
import { Appointment, PrescriptionItem, Doctor } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Plus,
  Trash2,
  Lock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Calendar,
  Droplets,
} from 'lucide-react';

interface NewMedicalRecordModalProps {
  appointment: Appointment;
  doctor: Doctor;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_DRUGS = [
  { name: 'Oresol 245 bù nước điện giải', dosage: '1 gói pha 200ml hoặc 1 lít', quantity: '5 gói', instructions: 'Uống rải rác từng ngụm nhỏ' },
  { name: 'Men vi sinh Enterogermina 5ml', dosage: '1 ống/lần, ngày 2 lần', quantity: '10 ống', instructions: 'Uống sau ăn để cân bằng tiêu hóa' },
  { name: 'Paracetamol 500mg viên nén', dosage: '1 viên/lần khi sốt > 38.5°C', quantity: '10 viên', instructions: 'Cách ít nhất 4-6 giờ giữa 2 lần uống' },
  { name: 'Gastrokit / Phosphalugel', dosage: '1 gói/lần khi đau tức thượng vị', quantity: '6 gói', instructions: 'Uống khi có triệu chứng đau rát' },
];

export const NewMedicalRecordModal: React.FC<NewMedicalRecordModalProps> = ({
  appointment,
  doctor,
  onClose,
  onSuccess,
}) => {
  const { addMedicalRecord } = useApp();

  // Vital Signs
  const [bloodPressure, setBloodPressure] = useState('115/75');
  const [heartRate, setHeartRate] = useState(76);
  const [temperature, setTemperature] = useState(37.0);
  const [weight, setWeight] = useState(62);
  const [spo2, setSpo2] = useState(99);

  // Infusion details
  const initialSolutions = appointment.selectedServices?.map((s) => s.name).join(' + ') || 'NaCl 0.9% 500ml';
  const [solutions, setSolutions] = useState(initialSolutions);
  const [dripRate, setDripRate] = useState('40 - 45 giọt/phút');
  const [veinSite, setVeinSite] = useState('Mu bàn tay trái (Kim luồn 22G vô khuẩn)');
  const [toleranceStatus, setToleranceStatus] = useState('Người bệnh êm dịu, mạch huyết áp ổn định, không có phản ứng quá mẫn, da niêm hồng.');

  // Clinical data
  const [symptoms, setSymptoms] = useState(appointment.symptoms || '');
  const [clinicalDiagnosis, setClinicalDiagnosis] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [doctorAdvice, setDoctorAdvice] = useState('');

  // Prescription Items
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      id: 'rx-1',
      medicineName: 'Oresol 245 bù điện giải',
      dosage: '1-2 gói/ngày',
      quantity: '5 gói',
      instructions: 'Pha nước đun sôi để nguội uống rải rác',
    },
  ]);

  // Confirmation Lock Step
  const [showConfirmLock, setShowConfirmLock] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleAddDrug = (template?: typeof COMMON_DRUGS[0]) => {
    const newItem: PrescriptionItem = template
      ? {
          id: `rx-${Date.now()}-${Math.random()}`,
          medicineName: template.name,
          dosage: template.dosage,
          quantity: template.quantity,
          instructions: template.instructions,
        }
      : {
          id: `rx-${Date.now()}-${Math.random()}`,
          medicineName: '',
          dosage: '1 viên/lần, ngày 2 lần',
          quantity: '10 viên',
          instructions: 'Uống sau ăn',
        };
    setPrescriptions([...prescriptions, newItem]);
  };

  const handleRemoveDrug = (id: string) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id));
  };

  const handleUpdateDrug = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptions(
      prescriptions.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleValidateAndPromptLock = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!clinicalDiagnosis.trim()) {
      setValidationError('Vui lòng nhập Chẩn đoán lâm sàng của ca truyền.');
      return;
    }
    if (!treatmentPlan.trim()) {
      setValidationError('Vui lòng nhập Hướng xử trí & Phác đồ điều trị.');
      return;
    }

    setShowConfirmLock(true);
  };

  const handleFinalSave = () => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addMedicalRecord({
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      date: formattedDate,
      vitalSigns: {
        bloodPressure,
        heartRate: Number(heartRate),
        temperature: Number(temperature),
        weight: Number(weight),
        spo2: Number(spo2),
      },
      infusionDetails: {
        solutions,
        dripRate,
        veinSite,
        toleranceStatus,
      },
      symptoms,
      clinicalDiagnosis,
      treatmentPlan,
      prescriptions: prescriptions.filter((p) => p.medicineName.trim().length > 0),
      doctorAdvice: doctorAdvice.trim() || 'Nghỉ ngơi tại chỗ, uống nước ấm. Nếu có dấu hiệu sốt mệt gọi ngay BS. Phúc 0969799467.',
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-sky-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Ghi Phiếu Truyền Dịch &amp; Ký Số Điện Tử</h2>
                <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded">
                  Quy chế Ký số
                </span>
              </div>
              <p className="text-xs text-teal-100">
                Bệnh nhân: <span className="font-bold text-white">{appointment.patientName}</span> ({appointment.patientGender}, {appointment.patientBirthYear}) • {appointment.district}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-800 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Quy tắc khóa dữ liệu:</strong> Sau khi bấm "Lưu &amp; Khóa bệnh án vĩnh viễn", bản ghi sẽ được niêm phong. Không thể xóa hoặc chỉnh sửa sau khi lưu.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleValidateAndPromptLock} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {validationError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Section 1: Vital signs before/after infusion */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-500" />
              1. Dấu Hiệu Sinh Tồn Trước &amp; Trong Khi Truyền
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Huyết áp (mmHg)</label>
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                  placeholder="115/75"
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Nhịp tim (bpm)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Thân nhiệt (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">SpO2 (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1 font-medium">Cân nặng (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Infusion Clinical Details */}
          <div className="space-y-3 bg-teal-50/60 p-4 rounded-xl border border-teal-100">
            <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-teal-600" />
              2. Chi Tiết Thực Hiện Truyền Dịch Tại Nhà
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">
                  Loại dịch &amp; dung tích truyền:
                </label>
                <input
                  type="text"
                  value={solutions}
                  onChange={(e) => setSolutions(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">
                  Tốc độ giọt &amp; kim luồn:
                </label>
                <input
                  type="text"
                  value={dripRate}
                  onChange={(e) => setDripRate(e.target.value)}
                  placeholder="40 giọt/phút"
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">
                  Vị trí lấy ven:
                </label>
                <input
                  type="text"
                  value={veinSite}
                  onChange={(e) => setVeinSite(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">
                  Đánh giá đáp ứng &amp; an toàn sau truyền:
                </label>
                <input
                  type="text"
                  value={toleranceStatus}
                  onChange={(e) => setToleranceStatus(e.target.value)}
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Clinical Diagnosis & Treatment */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-600" />
              3. Chẩn Đoán &amp; Hướng Xử Trí
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Chẩn đoán xác định <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  placeholder="Suy nhược cơ thể, mất nước sau sốt..."
                  value={clinicalDiagnosis}
                  onChange={(e) => setClinicalDiagnosis(e.target.value)}
                  required
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Hướng xử trí &amp; phác đồ <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="text"
                  placeholder="Bù dịch đẳng trương, điện giải, nghỉ ngơi..."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  required
                  className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                Lời dặn theo dõi của Bác sĩ Phúc:
              </label>
              <textarea
                rows={2}
                placeholder="Nghỉ ngơi, ăn cháo ấm, theo dõi thân nhiệt. Cần gọi ngay 0969799467 khi có dấu hiệu bất thường..."
                value={doctorAdvice}
                onChange={(e) => setDoctorAdvice(e.target.value)}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-500/30"
              />
            </div>
          </div>

          {/* Section 4: Prescriptions / Oral medication after infusion */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-emerald-600" />
                4. Thuốc Uống Kèm Theo Sau Truyền
              </h3>
              <button
                type="button"
                onClick={() => handleAddDrug()}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm thuốc
              </button>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              {prescriptions.map((drug) => (
                <div
                  key={drug.id}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Tên thuốc"
                      value={drug.medicineName}
                      onChange={(e) => handleUpdateDrug(drug.id, 'medicineName', e.target.value)}
                      className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Liều dùng"
                      value={drug.dosage}
                      onChange={(e) => handleUpdateDrug(drug.id, 'dosage', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Số lượng"
                      value={drug.quantity}
                      onChange={(e) => handleUpdateDrug(drug.id, 'quantity', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Cách dùng"
                      value={drug.instructions}
                      onChange={(e) => handleUpdateDrug(drug.id, 'instructions', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                  <div className="sm:col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveDrug(drug.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Lưu &amp; Khóa bệnh án vĩnh viễn</span>
            </button>
          </div>
        </form>

        {/* Confirmation Modal for Permanent Locking (Strict Rule) */}
        {showConfirmLock && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-slate-900">
                  Xác nhận Khóa Hồ Sơ &amp; Ký Số Điện Tử
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Bản ghi sẽ được niêm phong và ký số bởi <strong>{doctor.title} {doctor.name}</strong>.
                </p>
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs font-semibold mt-3">
                  ⚠️ Bác sĩ KHÔNG THỂ CHỈNH SỬA hoặc XÓA hồ sơ này sau khi xác nhận.
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmLock(false)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                >
                  Quay lại xem xét
                </button>
                <button
                  type="button"
                  onClick={handleFinalSave}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold transition shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Xác nhận ký số
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
