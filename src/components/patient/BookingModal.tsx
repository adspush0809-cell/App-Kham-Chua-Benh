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
  const [medicalHistory, setMedicalHistory] = useState<string>(currentPatient?.medicalHistory || '');
  const [allergyHistory, setAllergyHistory] = useState<string>(currentPatient?.allergyHistory || '');
  const [currentMedications, setCurrentMedications] = useState<string>(currentPatient?.currentMedications || '');
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
    if (!medicalHistory.trim()) {
      setErrorMessage('Vui lòng nhập mục "Tiền sử bệnh *" (hoặc ghi "Không có" nếu hoàn toàn khỏe mạnh).');
      return;
    }
    if (!allergyHistory.trim()) {
      setErrorMessage('Vui lòng nhập mục "Tiền sử dị ứng *" (hoặc ghi "Không dị ứng" nếu không có).');
      return;
    }
    if (!currentMedications.trim()) {
      setErrorMessage('Vui lòng nhập mục "Thuốc đang sử dụng *" (hoặc ghi "Không dùng thuốc" nếu không uống gì).');
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
        medicalHistory: medicalHistory.trim(),
        allergyHistory: allergyHistory.trim(),
        currentMedications: currentMedications.trim(),
      });

      setIsSubmitting(false);
      onSuccess();
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Có lỗi xảy ra khi đặt lịch, vui lòng thử lại hoặc gọi trực tiếp BS. Phúc.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-slate-950/80 backdrop-blur-xs overflow-hidden">
      <div className="relative w-full h-full md:h-auto md:max-h-[92vh] max-w-2xl bg-slate-50 md:bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-0 md:border md:border-slate-200">
        {/* Sticky Header with hotline */}
        <div className="sticky top-0 z-30 shrink-0 bg-gradient-to-r from-teal-800 via-sky-800 to-indigo-900 px-4 sm:px-6 py-3 sm:py-4 text-white flex items-center justify-between shadow-sm border-b border-white/10">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-bold truncate">
                Đặt Lịch Truyền Dịch Tại Nhà - TP. Cần Thơ
              </h2>
              <div className="text-[11px] sm:text-xs text-sky-100 flex items-center gap-1.5 flex-wrap">
                <span>BS. Phúc:</span>
                <a
                  href={`tel:${hotlinePhone}`}
                  className="font-extrabold underline text-amber-300 hover:text-white"
                >
                  {hotlinePhone}
                </a>
                <span className="hidden xs:inline">• Đến tận nhà</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shrink-0"
            aria-label="Đóng form đặt lịch"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* HỘP CẢNH BÁO LƯU Ý Y KHOA RÕ RÀNG */}
        <div className="shrink-0 bg-amber-50 border-b border-amber-200 px-4 sm:px-5 py-2.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed text-[11px] sm:text-xs">
            <span className="font-extrabold text-amber-950 block">
              LƯU Ý Y KHOA QUAN TRỌNG TỪ BS. PHÚC:
            </span>
            <p>
              Bác sĩ sẽ <strong>khám sàng lọc, đo huyết áp, nhịp tim và nghe tim phổi trước khi truyền</strong>. Kíp y khoa luôn mang theo <strong>hộp thuốc chống sốc phản vệ khẩn cấp</strong> theo quy chuẩn Bộ Y Tế.
            </p>
          </div>
        </div>

        {/* Scrollable Form Body with Card Sections */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain p-3.5 sm:p-5 md:p-6 space-y-4">
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-3 rounded-2xl text-sm flex items-center gap-2.5 font-semibold shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Card 1: Selected Services summary & estimated cost */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-100 pb-2.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Danh Mục Dịch Vụ Đã Chọn ({services.length} mục)
                </label>
                <span className="text-xs font-semibold text-slate-600">
                  Dự kiến: <strong className="text-emerald-700 font-extrabold text-sm sm:text-base">{estimatedDisplay}</strong>
                </span>
              </div>

              {services.length === 0 ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-center font-medium">
                  Chưa có dịch vụ nào được chọn. Vui lòng đóng cửa sổ này và tích chọn ít nhất 1 dịch vụ từ danh sách 9 nhóm.
                </div>
              ) : (
                <div className="space-y-2 border border-slate-100 rounded-xl p-2.5 bg-slate-50/70 max-h-44 overflow-y-auto">
                  {services.map((item) => (
                    <div
                      key={item.itemId}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs gap-2 shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{item.name}</span>
                        <div className="text-[11px] text-slate-500">
                          {item.groupName} • {item.unit}
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-teal-800">
                          x{item.quantity} = {formatVND((item.priceMax || item.price) * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(item.itemId)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          title="Xóa dịch vụ này"
                          aria-label={`Xóa ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Card 2: Address at Can Tho (District dropdown + detailed address) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Địa Chỉ Phục Vụ Tại TP. Cần Thơ (BS đến tận nơi)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Dropdown Quận/Huyện Cần Thơ */}
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Quận / Huyện Cần Thơ <span className="text-rose-500">*</span>:
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="w-full text-base font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
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
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Số nhà, tên đường, phường/xã <span className="text-rose-500">*</span>:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ví dụ: Số 45 Đường 30/4, Phường Xuân Khánh"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 focus:ring-2 focus:ring-teal-500/30"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Lưu ý bảo mật: Địa chỉ nhà và số điện thoại chỉ lưu trữ trên hệ thống Admin, hoàn toàn được ẩn khỏi giao diện bác sĩ thường.
              </p>
            </div>

            {/* Card 3: Personal info & Schedule */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                3. Thông Tin Người Bệnh &amp; Thời Gian
              </label>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">
                      Họ và tên người bệnh <span className="text-rose-500">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ví dụ: Nguyễn Văn An"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 focus:ring-2 focus:ring-teal-500/30"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">
                      Số điện thoại liên hệ <span className="text-rose-500">*</span>:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="0988123456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 focus:ring-2 focus:ring-teal-500/30"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">Năm sinh:</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min={1920}
                      max={2026}
                      value={birthYear}
                      onChange={(e) => setBirthYear(Number(e.target.value))}
                      className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">Giới tính:</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-600 mb-1 font-semibold">Khung giờ đến:</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-2.5 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
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

            {/* Card 4: Symptoms description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  4. Mô Tả Tình Trạng Bệnh / Triệu Chứng Hiện Tại
                </label>
                <span className="text-[11px] text-slate-400">BS. Phúc xem trước</span>
              </div>
              <textarea
                rows={2}
                placeholder="Ví dụ: Bị sốt từ hôm qua, nôn ói không ăn uống được, người mỏi mệt nhiều..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full text-base font-medium text-slate-800 bg-white border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500/30"
              />

              {/* Quick symptom pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Gợi ý nhanh:
                </span>
                {COMMON_SYMPTOMS_SUGGESTIONS.slice(0, 4).map((sugg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSymptoms((prev) => (prev ? `${prev}. ${sugg}` : sugg))}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition cursor-pointer min-h-[32px] flex items-center"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

            {/* Card 5: THÔNG TIN SÀNG LỌC AN TOÀN Y TẾ (BẮT BUỘC NHẬP) */}
            <div className="bg-gradient-to-br from-rose-50/90 via-amber-50/50 to-orange-50/60 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex items-start gap-2.5 border-b border-rose-200/90 pb-3">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  5
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-rose-950 uppercase tracking-tight flex items-center gap-1.5 flex-wrap">
                    <span>5. Thông Tin Sàng Lọc An Toàn Y Tế</span>
                    <span className="text-rose-600 text-xs font-black bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-full">
                      BẮT BUỘC NHẬP *
                    </span>
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                    BS. Phúc yêu cầu khai báo chi tiết để thẩm định chỉ định dịch truyền, đảm bảo an toàn tuyệt đối và ngăn ngừa nguy cơ sốc hoặc tương tác thuốc.
                  </p>
                </div>
              </div>

              {/* Ô nhập 1 - Tiền sử bệnh */}
              <div className="space-y-1.5 bg-white p-3.5 sm:p-4 rounded-xl border border-rose-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Tiền sử bệnh</span>
                    <span className="text-rose-600 font-extrabold text-sm">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Bắt buộc
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Trước giờ bệnh nhân có bệnh gì khác như huyết áp, tiểu đường hay đau dạ dày không?
                </p>
                <textarea
                  rows={2}
                  required
                  placeholder="Nhập rõ các bệnh nền đang mắc (VD: Cao huyết áp, tiểu đường, đau dạ dày...) hoặc ghi 'Không có' nếu hoàn toàn khỏe mạnh."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full text-base font-medium text-slate-800 bg-slate-50/70 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                  {['Không có', 'Cao huyết áp', 'Tiểu đường type 2', 'Đau dạ dày', 'Bệnh tim mạch'].map((sugg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMedicalHistory((prev) => (prev ? `${prev}, ${sugg}` : sugg))}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition min-h-[30px] flex items-center"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ô nhập 2 - Tiền sử dị ứng */}
              <div className="space-y-1.5 bg-white p-3.5 sm:p-4 rounded-xl border border-rose-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Tiền sử dị ứng</span>
                    <span className="text-rose-600 font-extrabold text-sm">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Bắt buộc
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Bệnh nhân có dị ứng thuốc hay thức ăn gì không?
                </p>
                <textarea
                  rows={2}
                  required
                  placeholder="Ghi rõ tên thuốc hoặc thức ăn từng gây dị ứng (VD: Dị ứng thuốc giảm đau Paracetamol, kháng sinh, hải sản...) hoặc ghi 'Không dị ứng'."
                  value={allergyHistory}
                  onChange={(e) => setAllergyHistory(e.target.value)}
                  className="w-full text-base font-medium text-slate-800 bg-slate-50/70 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                  {['Không dị ứng', 'Dị ứng kháng sinh Penicillin', 'Dị ứng thuốc Paracetamol', 'Dị ứng hải sản'].map((sugg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAllergyHistory((prev) => (prev ? `${prev}, ${sugg}` : sugg))}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition min-h-[30px] flex items-center"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ô nhập 3 - Thuốc đang sử dụng */}
              <div className="space-y-1.5 bg-white p-3.5 sm:p-4 rounded-xl border border-rose-200 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    <span>Thuốc đang sử dụng</span>
                    <span className="text-rose-600 font-extrabold text-sm">*</span>
                  </label>
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    Bắt buộc
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Có đang sử dụng thuốc gì không?
                </p>
                <textarea
                  rows={2}
                  required
                  placeholder="Liệt kê các loại thuốc đang uống hằng ngày (kể cả thuốc nam, thực phẩm chức năng) hoặc ghi 'Không dùng thuốc'."
                  value={currentMedications}
                  onChange={(e) => setCurrentMedications(e.target.value)}
                  className="w-full text-base font-medium text-slate-800 bg-slate-50/70 border border-slate-300 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <span className="text-[10px] text-slate-400">Gợi ý nhanh:</span>
                  {['Không dùng thuốc', 'Thuốc huyết áp (Amlodipine/Losartan)', 'Thuốc tiểu đường (Metformin)', 'Thuốc dạ dày (Omeprazole)'].map((sugg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentMedications((prev) => (prev ? `${prev}, ${sugg}` : sugg))}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition min-h-[30px] flex items-center"
                    >
                      + {sugg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Footer at Bottom with min 48px buttons */}
          <div className="sticky bottom-0 z-30 shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <a
              href={`tel:${hotlinePhone}`}
              className="min-h-[48px] h-12 text-xs sm:text-sm font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 px-4 py-2.5 rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 shrink-0 text-rose-600" />
              <span>Gọi BS. Phúc ({hotlinePhone})</span>
            </a>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:inline-flex min-h-[48px] h-12 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer items-center justify-center"
              >
                Đóng
              </button>
              <button
                type="submit"
                disabled={isSubmitting || services.length === 0}
                className="flex-1 sm:flex-none min-h-[48px] h-12 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-sky-600 to-teal-700 hover:from-teal-700 hover:to-sky-800 disabled:opacity-50 text-white text-sm sm:text-base font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Xác nhận đặt lịch ngay</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
