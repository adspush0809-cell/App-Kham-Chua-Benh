import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceGroup, ServiceItem, SelectedServiceItem } from '../../types';
import { ServiceGroupCard } from './ServiceGroupCard';
import { BookingModal } from './BookingModal';
import { MedicalHistoryTab } from './MedicalHistoryTab';
import { formatVND } from '../../utils/formatters';
import {
  Sparkles,
  ShieldCheck,
  Stethoscope,
  Activity,
  PhoneCall,
  CalendarCheck,
  FileText,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Droplets,
  Heart,
  ChevronRight,
} from 'lucide-react';

export const PatientView: React.FC = () => {
  const {
    serviceGroups,
    appointments,
    activePatientId,
    patients,
    hotlinePhone,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'history'>('services');
  const [selectedServices, setSelectedServices] = useState<SelectedServiceItem[]>([
    // Default pre-select group 1 item 1 for intuitive UX
    {
      itemId: 's-1-1',
      groupId: 'grp-1',
      groupName: 'Nhóm 1: Bù Nước & Điện Giải',
      name: 'Truyền 1 chai 500ml (NaCl 0,9% / Glucose 5% / Ringer Lactate)',
      price: 350000,
      unit: '1 chai 500ml',
      quantity: 1,
    },
  ]);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const currentPatient = patients.find((p) => p.id === activePatientId) || patients[0];
  const myAppointmentsCount = appointments.filter(
    (a) => a.patientId === currentPatient.id || a.patientPhone === currentPatient.phone
  ).length;

  // Toggle Item in selection
  const handleToggleItem = (item: ServiceItem, group: ServiceGroup) => {
    const exists = selectedServices.find((s) => s.itemId === item.id);
    if (exists) {
      setSelectedServices(selectedServices.filter((s) => s.itemId !== item.id));
    } else {
      setSelectedServices([
        ...selectedServices,
        {
          itemId: item.id,
          groupId: group.id,
          groupName: group.name,
          name: item.name,
          price: item.price,
          priceMax: item.priceMax,
          unit: item.unit,
          quantity: 1,
        },
      ]);
    }
  };

  // Update quantity of selected item
  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setSelectedServices(
      selectedServices
        .map((s) => {
          if (s.itemId !== itemId) return s;
          const newQty = s.quantity + delta;
          return newQty > 0 ? { ...s, quantity: newQty } : null;
        })
        .filter(Boolean) as SelectedServiceItem[]
    );
  };

  // Calculate live total range
  let minTotal = 0;
  let maxTotal = 0;
  selectedServices.forEach((s) => {
    minTotal += s.price * s.quantity;
    maxTotal += (s.priceMax || s.price) * s.quantity;
  });

  const estimatedDisplay =
    minTotal === 0
      ? '0đ'
      : minTotal === maxTotal
      ? formatVND(minTotal)
      : `${formatVND(minTotal)} - ${formatVND(maxTotal)}`;

  return (
    <div className="space-y-8 pb-24">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-teal-900 via-slate-900 to-sky-950 text-white p-6 sm:p-10 shadow-xl border border-teal-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-teal-200 border border-white/15">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Dịch Vụ Y Tế Tại Nhà Khu Vực TP. Cần Thơ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Dịch Vụ Truyền Dịch Tại Nhà Cần Thơ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-300 to-emerald-300">
              "Sức khỏe của bạn là ưu tiên của chúng tôi!"
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Cam kết <strong>An toàn – Chuyên nghiệp – Tận tâm</strong>. Phụ trách chuyên môn bởi <strong>BS. Phúc</strong>. Đo huyết áp, khám sàng lọc trước khi truyền, kim luồn vô khuẩn êm ái, theo dõi sát tại giường bệnh.
          </p>

          {/* Hotline CTA Box */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={`tel:${hotlinePhone}`}
              className="bg-rose-500 hover:bg-rose-600 text-white font-black text-sm px-5 py-3 rounded-2xl shadow-lg transition flex items-center gap-2.5 animate-pulse cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline Tư Vấn: BS. Phúc – {hotlinePhone}</span>
            </a>

            <button
              onClick={() => setShowBookingModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Đặt lịch hẹn bác sĩ đến nhà</span>
            </button>
          </div>

          {/* Value props badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Có hộp chống sốc BYT</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Dược phẩm chính hãng</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <Stethoscope className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Bác sĩ trực tiếp khám</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Có mặt nhanh 15-30p</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'services'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>9 Nhóm Dịch Vụ Truyền Dịch &amp; Thuốc Kèm Theo</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lịch Sử Ca Truyền &amp; Bệnh Án</span>
            {myAppointmentsCount > 0 && (
              <span className="bg-teal-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {myAppointmentsCount}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'services' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden md:inline">
              Đã chọn: <strong className="text-teal-700">{selectedServices.length} mục</strong>
            </span>
            <button
              onClick={() => setShowBookingModal(true)}
              disabled={selectedServices.length === 0}
              className="bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Đặt lịch ngay</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'services' ? (
        <div className="space-y-6">
          {/* Section Heading & Multi-select guide */}
          <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-sky-900">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Hướng dẫn:</strong> Quý khách có thể tích chọn <strong>nhiều dịch vụ cùng lúc</strong> trong 9 nhóm bên dưới. Hệ thống sẽ tự động tính khoảng chi phí dự kiến ở thanh chân trang.
              </span>
            </div>
            <a
              href={`tel:${hotlinePhone}`}
              className="font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Cần tư vấn trực tiếp: {hotlinePhone}
            </a>
          </div>

          {/* 9 Service Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceGroups.map((group) => (
              <ServiceGroupCard
                key={group.id}
                group={group}
                selectedItems={selectedServices}
                onToggleItem={handleToggleItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            ))}
          </div>

          {/* Service Commitment Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Khám &amp; Đo Dấu Hiệu Sinh Tồn</h4>
                <p>BS. Phúc đo huyết áp, nhịp tim, nghe phổi, thử đường huyết nếu cần trước khi chỉ định dịch truyền.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Kim Luồn Chống Vỡ Ven</h4>
                <p>Sử dụng kim luồn silicone êm ái, vô khuẩn 100%, bệnh nhân cử động tay nhẹ nhàng không lo lệch ven.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Theo Dõi Suốt Quá Trình</h4>
                <p>Cán bộ y tế túc trực bên cạnh giường bệnh để điều chỉnh tốc độ giọt và xử trí tức thời nếu có mệt mỏi.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MedicalHistoryTab />
      )}

      {/* STICKY BOTTOM BAR: TỰ ĐỘNG TÍNH KHOẢNG "CHI PHÍ DỰ KIẾN" Ở CUỐI MÀN HÌNH (Required by user) */}
      {activeTab === 'services' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* Left: Selected count & list */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Đã chọn:</span>
                  <span className="bg-teal-100 text-teal-800 text-xs font-extrabold px-2 py-0.5 rounded-full">
                    {selectedServices.length} dịch vụ / thuốc
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md mt-0.5">
                  {selectedServices.length === 0
                    ? 'Chưa chọn dịch vụ nào'
                    : selectedServices.map((s) => `${s.name} (x${s.quantity})`).join(', ')}
                </div>
              </div>
            </div>

            {/* Right: Estimated Cost & Order Action */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Chi phí dự kiến:
                </span>
                <span className="text-lg sm:text-2xl font-black text-emerald-700 tracking-tight">
                  {estimatedDisplay}
                </span>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                disabled={selectedServices.length === 0}
                className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-700 hover:from-teal-700 hover:to-indigo-800 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm py-3 px-5 sm:px-7 rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Tiến hành đặt lịch</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          initialServices={selectedServices}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            setActiveTab('history');
          }}
        />
      )}
    </div>
  );
};
