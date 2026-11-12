import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Laptop,
  Check,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminSecurityTab: React.FC = () => {
  const {
    changeAdminPassword,
    trustedDevices,
    toggleApproveDevice,
    lastAdminUnlockTime,
    lockAdmin,
  } = useApp();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Chưa nhập', color: 'bg-slate-200', text: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Yếu', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score <= 4) return { score: 2, label: 'Trung bình', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score: 3, label: 'Rất mạnh & An toàn', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!currentPassword) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập mật khẩu hiện tại!' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Xác nhận lại mật khẩu mới không khớp!' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await changeAdminPassword(currentPassword, newPassword);
      setIsSubmitting(false);

      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // changeAdminPassword already locks Admin session and sets sessionStorage flag!
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    } catch {
      setIsSubmitting(false);
      setFeedback({ type: 'error', message: 'Đã xảy ra lỗi khi đổi mật khẩu. Vui lòng thử lại!' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trung Tâm An Toàn &amp; Bảo Mật Y Tế</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Cài Đặt Bảo Mật &amp; Đổi Mật Khẩu Admin
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Mật khẩu quản trị được mã hóa một chiều chuẩn SHA-256 an toàn. Đổi mật khẩu định kỳ giúp bảo vệ thông tin bệnh nhân và ngăn chặn truy cập trái phép.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={lockAdmin}
            className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Khóa phiên ngay</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Change Password Form (Left) & Security Status & Devices (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form: Change Password */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Đổi Mật Khẩu Quản Trị Hệ Thống
              </h3>
              <p className="text-xs text-slate-500">
                Thay thế mật khẩu mặc định bằng mật khẩu riêng của bạn.
              </p>
            </div>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-2xl flex items-start gap-2.5 text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-50 text-rose-800 border border-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input 1: Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Mật khẩu hiện tại <span className="text-rose-500">*</span>:
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  placeholder="Nhập mật khẩu đang sử dụng..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-base sm:text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showCurrent ? 'Ẩn' : 'Hiện'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input 2: New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Mật khẩu mới <span className="text-rose-500">*</span>:
                </label>
                {newPassword && (
                  <span className={`text-[11px] font-bold ${strength.text}`}>
                    Độ mạnh: {strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  placeholder="Tối thiểu 6 ký tự (nên gồm chữ hoa, số & ký tự đặc biệt)..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-base sm:text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showNew ? 'Ẩn' : 'Hiện'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength progress bar */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{
                        width: strength.score === 1 ? '33%' : strength.score === 2 ? '66%' : '100%',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Input 3: Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Xác nhận lại mật khẩu mới <span className="text-rose-500">*</span>:
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  placeholder="Gõ lại chính xác mật khẩu mới bên trên..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-base sm:text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showConfirm ? 'Ẩn' : 'Hiện'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Safety Auto-lock Callout */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Quy trình bảo mật tự động:</span>
              </div>
              <p className="leading-relaxed">
                Sau khi bấm <strong>"Lưu Mật Khẩu Mới"</strong>, hệ thống sẽ tự động khóa phiên làm việc hiện tại và đưa bạn trở về màn hình đăng nhập. Bạn sẽ cần nhập mật khẩu mới vừa đổi để xác thực.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] py-3.5 px-5 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang xử lý mã hóa...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Lưu Mật Khẩu Mới &amp; Khóa Phiên Kiểm Tra</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Security Status & Trusted Devices */}
        <div className="lg:col-span-5 space-y-6">
          {/* Security Status Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Hiện Trạng Bảo Mật Hệ Thống</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-600">Thuật toán mã hóa:</span>
                <span className="font-mono font-bold text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                  SHA-256 (256-bit)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-600">Trạng thái phiên:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Đang hoạt động
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-600">Mở khóa gần nhất:</span>
                <span className="font-semibold text-slate-800">
                  {lastAdminUnlockTime || 'Vừa xong'}
                </span>
              </div>
            </div>
          </div>

          {/* Trusted Devices Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                  Thiết Bị Truy Cập Đã Duyệt
                </h3>
              </div>
              <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                {trustedDevices.filter((d) => d.isApproved).length} thiết bị
              </span>
            </div>

            <div className="space-y-3">
              {trustedDevices.map((device) => (
                <div
                  key={device.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{device.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleApproveDevice(device.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                        device.isApproved
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {device.isApproved ? 'Khóa quyền' : 'Phê duyệt'}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
                    <span>IP: {device.ip}</span>
                    <span>Trình duyệt: {device.browser}</span>
                    <span>Hoạt động: {device.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
