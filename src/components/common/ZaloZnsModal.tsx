import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  Phone,
  Activity,
  PhoneCall,
} from 'lucide-react';

export const ZaloZnsModal: React.FC = () => {
  const { activeZnsModal, setActiveZnsModal, hotlinePhone } = useApp();

  if (!activeZnsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Zalo Header Branding */}
        <div className="bg-[#0068FF] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0068FF] font-black text-xl shadow-sm">
              Z
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-base leading-tight">
                <span>Truyền Dịch Tại Nhà Cần Thơ</span>
                <CheckCircle className="w-4 h-4 fill-white text-[#0068FF]" />
              </div>
              <p className="text-xs text-sky-100">BS. Phúc – Hotline: {hotlinePhone}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveZnsModal(null)}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ZNS Message Body (Realistic Template) */}
        <div className="p-5 space-y-4 text-slate-800 bg-[#F4F5F7]">
          {/* Banner notification pill */}
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-semibold">Tin nhắn Zalo ZNS chính thức: </span>
              <span>Đã gửi tin nhắn xác nhận lịch hẹn qua Zalo ZNS đến số điện thoại của bạn</span>
            </div>
          </div>

          {/* White Card representing ZNS Content */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600">
                THÔNG BÁO Y TẾ TẠI NHÀ CẦN THƠ
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-0.5">
                {activeZnsModal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mã ca truyền: <span className="font-mono font-bold text-slate-800">{activeZnsModal.appointmentId}</span>
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Người nhận:</span>
                <span className="font-semibold text-slate-800">{activeZnsModal.recipientName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Số điện thoại nhận:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-sky-500" />
                  {activeZnsModal.recipientPhone}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Dịch vụ chỉ định:</span>
                <span className="font-semibold text-teal-800 text-right max-w-[210px]">
                  {activeZnsModal.servicesSummary}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Chi phí dự kiến / chốt:</span>
                <span className="font-extrabold text-emerald-700 text-sm">
                  {activeZnsModal.estimatedFee}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Thời gian dự kiến đến:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-500" />
                  {activeZnsModal.appointmentDate} | <Clock className="w-3 h-3 text-amber-500" /> {activeZnsModal.timeSlot}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Bác sĩ phụ trách:</span>
                <span className="font-semibold text-teal-700">{activeZnsModal.doctorName || 'BS. Phúc (0969799467)'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Khu vực phục vụ:</span>
                <span className="font-medium text-slate-700 text-right flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  Tận nhà tại TP. Cần Thơ (Kèm hộp chống sốc vô khuẩn)
                </span>
              </div>
            </div>

            {/* QR check-in and Security Notice */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200 flex items-center justify-between">
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-700">Mã QR Y Bác Sĩ Đến Nhà</div>
                <div className="text-[10px] text-slate-400">Kiểm tra thông tin BS. Phúc khi đến nhà</div>
              </div>
              <div className="w-12 h-12 bg-white p-1 rounded border border-slate-200 flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
            </div>

            <p className="text-[11px] text-slate-600 bg-sky-50/70 p-2.5 rounded-lg text-left border border-sky-100 leading-relaxed">
              {activeZnsModal.content}
            </p>
          </div>

          {/* Footer note */}
          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <span>Thời gian phát: {activeZnsModal.sentAt}</span>
            <span>•</span>
            <span className="text-emerald-600 font-medium">Hạ tầng Zalo ZNS</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
          <a
            href={`tel:${hotlinePhone}`}
            className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 px-3 rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-rose-200"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Gọi BS. Phúc: {hotlinePhone}</span>
          </a>
          <button
            onClick={() => setActiveZnsModal(null)}
            className="flex-1 bg-[#0068FF] hover:bg-blue-600 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition shadow-sm cursor-pointer"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
