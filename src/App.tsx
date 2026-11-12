/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoRoleSwitcher } from './components/common/DemoRoleSwitcher';
import { ZaloZnsModal } from './components/common/ZaloZnsModal';
import { PatientView } from './components/patient/PatientView';
import { DoctorView } from './components/doctor/DoctorView';
import { AdminView } from './components/admin/AdminView';
import {
  ShieldCheck,
  PhoneCall,
  Clock,
  MapPin,
  Heart,
  Droplets,
  Activity,
  FileCheck,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, hotlinePhone } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-teal-600 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Top Sticky Demo Role Switcher Toolbar */}
      <DemoRoleSwitcher />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 overflow-x-hidden">
        {role === 'patient' && <PatientView />}
        {role === 'doctor' && <DoctorView />}
        {role === 'admin' && <AdminView />}
      </main>

      {/* Global Zalo ZNS Interactive Simulation Modal */}
      <ZaloZnsModal />

      {/* Clinic Footer */}
      <footer className="no-print bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
            {/* Column 1: Brand & Slogan */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-400 text-white font-black text-lg flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-base block">
                    Truyền Dịch Tại Nhà Cần Thơ
                  </span>
                  <span className="text-[10px] text-teal-300 font-semibold">
                    BS. Phúc – 0969799467
                  </span>
                </div>
              </div>
              <p className="text-teal-200 font-bold text-xs italic">
                "Sức khỏe của bạn là ưu tiên của chúng tôi!"
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Cam kết: <strong>An toàn – Chuyên nghiệp – Tận tâm</strong>. Đội ngũ y bác sĩ, điều dưỡng giàu kinh nghiệm, phục vụ tận nhà nhanh chóng tại Cần Thơ.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Quy trình vô khuẩn • Hộp chống sốc phản vệ BYT</span>
              </div>
            </div>

            {/* Column 2: 9 Service Groups Overview */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                9 Nhóm Dịch Vụ &amp; Thuốc Kèm Theo
              </h4>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>• <strong>Nhóm 1:</strong> Bù nước, điện giải (350k - 650k)</li>
                <li>• <strong>Nhóm 2:</strong> Đạm Aminoplasma &amp; Lipid (550k - 600k)</li>
                <li>• <strong>Nhóm 3:</strong> Truyền Vitaplex, Vitamin B &amp; C (550k - 600k)</li>
                <li>• <strong>Nhóm 4:</strong> Điều trị đau, sốt (450k - 750k)</li>
                <li>• <strong>Nhóm 5:</strong> Hỗ trợ thần kinh, tiền đình (550k)</li>
                <li>• <strong>Nhóm 6:</strong> Tiêm thuốc kèm theo (120k - 150k)</li>
                <li>• <strong>Nhóm 7:</strong> Thuốc uống kèm theo (130k - 150k)</li>
                <li>• <strong>Nhóm 8:</strong> Khách có sẵn thuốc (350k - 450k)</li>
                <li>• <strong>Nhóm 9:</strong> Truyền Glutathione 1.200mg (1.050k)</li>
              </ul>
            </div>

            {/* Column 3: Contact & Hours */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Khu Vực Phục Vụ &amp; Liên Hệ
              </h4>
              <div className="space-y-2 text-slate-400 text-[11px]">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    Toàn bộ 9 Quận/Huyện Cần Thơ: Ninh Kiều, Cái Răng, Bình Thủy, Ô Môn, Thốt Nốt, Phong Điền, Cờ Đỏ, Thới Lai, Vĩnh Thạnh
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>
                    Hotline BS. Phúc: <a href={`tel:${hotlinePhone}`} className="text-white font-extrabold hover:underline">{hotlinePhone}</a> (24/7)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Thời gian tiếp nhận: 24/24 tất cả các ngày trong tuần</span>
                </div>
              </div>
            </div>

            {/* Column 4: Security Policy & Zalo ZNS */}
            <div className="space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                Bảo Mật Y Tế &amp; Zalo ZNS
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Số điện thoại và địa chỉ nhà của khách hàng được bảo mật tuyệt đối, chỉ Admin điều phối được xem, hoàn toàn ẩn với Bác sĩ để đảm bảo an toàn thông tin.
              </p>
              <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80 text-[11px] text-slate-300">
                <span className="font-bold text-[#0068FF] flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  Thông báo Zalo ZNS xác nhận tức thì
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Gửi mã xác nhận lịch hẹn và chốt chi phí thực tế qua Zalo
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
            <span>© 2026 Dịch vụ Truyền Dịch Tại Nhà Cần Thơ — BS. Phúc ({hotlinePhone}).</span>
            <span className="flex items-center gap-1 text-slate-400">
              "Sức khỏe của bạn là ưu tiên của chúng tôi!"
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
