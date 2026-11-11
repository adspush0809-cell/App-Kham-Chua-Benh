import React, { useState } from 'react';
import { SelectedServiceItem, CAN_THO_DISTRICTS } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Activity,
  Trash2,
  FileText,
  Sparkles,
} from 'lucide-react';

interface BookingModalProps {
  initialServices: SelectedServiceItem[];
  onClose: () => void;
  onSuccess: () => void;
}

const TIME_SLOTS = [
  '07:30 - 08:30 (Sáng sớm)',
  '08:30 - 09:30 (Sáng)',
  '09:30 - 10:30 (Sáng)',
  '10:30 - 11:30 (Trưa)',
  '13:30 - 14:30 (Đầu giờ chiều)',
  '14:30 - 15:30 (Chiều)',
  '16:00 - 17:00 (Chiều muộn)',
  '18:00 - 19:30 (Tối cấp cứu ngoài giờ)',
];

const COMMON_SYMPTOMS_SUGGESTIONS = [
  'Mệt mỏi kiệt sức, ăn uống không vào',
  'Sốt cao, đau đầu nhức mỏi toàn thân',
  'Nôn ói, tiêu chảy mất nước',
  'Chóng mặt, say sẩm rối loạn tiền đình',
  'Mệt lả sau uống nhiều rượu bia',
  'Cần truyền hồi phục sau đợt ốm dậy',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  initialServices,
  onClose,
  onSuccess,
}) => {
  const { bookAppointment, patients, activePatientId, hotlinePhone } = useApp();

  const currentPatient = patients.find((p) => p.id === activePatientId);

  // Tomorrow's date default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()); // allow today or tomorrow
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [services, setServices] = useState<SelectedServiceItem[]>(initialServices);
  const [date, setDate] = useState<string>(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [fullName, setFullName] = useState<string>(currentPatient?.fullName || '');
  const [phone, setPhone] = useState<string>(currentPatient?.phone || '');
  const [district, setDistrict] = useState<string>(currentPatient?.district || CAN_THO_DISTRICTS[0]);
  const [address, setAddress] = useState<string>(currentPatient?.address || '');
  const [birthYear, setBirthYear] = useState<number>(currentPatient?.birthYear || 1990);
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>(currentPatient?.gender || 'Nam');
  const [symptoms, setSymptoms] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live calculation of estimated price range
  let minTotal = 0;
  let maxTotal = 0;
  services.forEach((s) => {
    minTotal += s.price * s.quantity;
    maxTotal += (s.priceMax || s.price) * s.quantity;
  });

  const estimatedDisplay =
    minTotal === maxTotal
      ? formatVND(minTotal)
      : `${formatVND(minTotal)} - ${formatVND(maxTotal)}`;

  const handleRemoveService = (itemId: string) => {
    setServices(services.filter((s) => s.itemId !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (services.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 dịch vụ truyền dịch hoặc thuốc kèm theo.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!phone.trim() || phone.length < 9) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ để BS. Phúc liên hệ và nhận Zalo ZNS.');
      return;
    }
    if (!district) {
      setErrorMessage('Vui lòng chọn Quận/Huyện tại TP. Cần Thơ.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Vui lòng nhập số nhà, tên đường, phường/xã để bác sĩ đến tận nơi.');
      return;
    }
    if (!date) {
      setErrorMessage('Vui lòng chọn ngày mong muốn truyền dịch.');
      return;
    }

    setIsSubmitting(true);

    try {
      bookAppointment({
        selectedServices: services,
        date,
        timeSlot,
        fullName: fullName.trim(),
        phone: phone.trim(),
        district,
        address: address.trim(),
        birthYear: Number(birthYear),
        gender,
        symptoms: symptoms.trim() || 'Cần bác sĩ đến khám và truyền dịch phục hồi tại nhà.',
      });

      setIsSubmitting(false);
      onSuccess();
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Có lỗi xảy ra khi đặt lịch, vui lòng thử lại hoặc gọi trực tiếp BS. Phúc.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header with hotline */}
        <div className="bg-gradient-to-r from-teal-700 via-sky-700 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Đặt Lịch Truyền Dịch Tại Nhà - TP. Cần Thơ
              </h2>
              <p className="text-xs text-sky-100 flex items-center gap-1.5">
                <span>BS. Phúc phụ trách:</span>
                <a
                  href={`tel:${hotlinePhone}`}
                  className="font-extrabold underline text-amber-300 hover:text-white"
                >
                  {hotlinePhone}
                </a>
                <span>• Bác sĩ đến tận nhà</span>
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

        {/* HỘP CẢNH BÁO LƯU Ý Y KHOA RÕ RÀNG (Required by user) */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <span className="font-extrabold text-amber-950 block">
              LƯU Ý Y KHOA QUAN TRỌNG TỪ BS. PHÚC:
            </span>
            <p>
              Bác sĩ sẽ <strong>khám sàng lọc, đo huyết áp, nhịp tim và nghe tim phổi trước khi truyền</strong>. Tuyệt đối không tự ý truyền khi có chống chỉ định tim mạch nặng hoặc suy thận. Kíp y khoa luôn mang theo <strong>hộp thuốc chống sốc phản vệ khẩn cấp</strong> theo đúng quy chuẩn Bộ Y Tế.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Selected Services summary & estimated cost */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Danh Mục Dịch Vụ Đã Chọn ({services.length} mục)
              </label>
              <span className="text-xs font-semibold text-slate-500">
                Chi phí dự kiến:{' '}
                <strong className="text-emerald-700 font-extrabold text-sm">{estimatedDisplay}</strong>
              </span>
            </div>

            {services.length === 0 ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center font-medium">
                Chưa có dịch vụ nào được chọn. Vui lòng đóng cửa sổ này và tích chọn ít nhất 1 dịch vụ từ danh sách 9 nhóm dịch vụ.
              </div>
            ) : (
              <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/60 max-h-40 overflow-y-auto">
                {services.map((item) => (
                  <div
                    key={item.itemId}
                    className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs gap-2"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <div className="text-[11px] text-slate-500">
                        {item.groupName} • {item.unit}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-teal-800">
                        x{item.quantity} = {formatVND((item.priceMax || item.price) * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(item.itemId)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded"
                        title="Xóa dịch vụ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Address at Can Tho (District dropdown + detailed address) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Địa Chỉ Phục Vụ Tại TP. Cần Thơ (BS đến tận nơi)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dropdown Quận/Huyện Cần Thơ */}
              <div>
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Quận / Huyện Cần Thơ <span className="text-rose-500">*</span>:
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                >
                  {CAN_THO_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ô nhập địa chỉ nhà chi tiết */}
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-600 mb-1 font-medium">
                  Số nhà, tên đường, phường/xã <span className="text-rose-500">*</span>:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ví dụ: Số 45 Đường 30/4, Phường Xuân Khánh"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pl-9 focus:ring-2 focus:ring-teal-500/30"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic mt-1">
              * Lưu ý bảo mật: Địa chỉ nhà và số điện thoại chỉ lưu trữ trên hệ thống Admin, hoàn toàn được ẩn khỏi giao diện bác sĩ thường.
            </p>
          </div>

          {/* Section 3: Personal info & Schedule */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              3. Thông Tin Người Bệnh &amp; Thời Gian
            </label>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    Họ và tên người bệnh <span className="text-rose-500">*</span>:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn An"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pl-9 focus:ring-2 focus:ring-teal-500/30"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>:
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="0988123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pl-9 focus:ring-2 focus:ring-teal-500/30"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Năm sinh:</label>
                  <input
                    type="number"
                    min={1920}
                    max={2026}
                    value={birthYear}
                    onChange={(e) => setBirthYear(Number(e.target.value))}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Giới tính:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-medium">Khung giờ đến:</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-2.5 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Symptoms description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. Mô Tả Tình Trạng Bệnh / Triệu Chứng Hiện Tại
              </label>
              <span className="text-[11px] text-slate-400">BS. Phúc sẽ xem xét trước</span>
            </div>
            <textarea
              rows={2}
              placeholder="Ví dụ: Bị sốt từ hôm qua, nôn ói không ăn uống được, người mỏi mệt nhiều..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500/30"
            />

            {/* Quick symptom pills */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Gợi ý nhanh:
              </span>
              {COMMON_SYMPTOMS_SUGGESTIONS.slice(0, 4).map((sugg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSymptoms((prev) => (prev ? `${prev}. ${sugg}` : sugg))}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md transition cursor-pointer"
                >
                  + {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Call Quick Link & Submit */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <a
              href={`tel:${hotlinePhone}`}
              className="text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-xl border border-rose-200 flex items-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Cần gấp? Gọi BS. Phúc ({hotlinePhone})</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmitting || services.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-700 hover:from-teal-700 hover:to-sky-800 text-white text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận đặt lịch ngay</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
