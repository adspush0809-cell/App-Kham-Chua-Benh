import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export const AdminLockScreen: React.FC = () => {
  const { unlockAdmin, setRole, trustedDevices, lastAdminUnlockTime } = useApp();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  // Check if session was locked immediately after changing password
  useEffect(() => {
    const justChanged = sessionStorage.getItem('medicare_ct_iv_v2_pwd_just_changed');
    if (justChanged === 'true') {
      setSuccessNotice('Mật khẩu Admin đã được cập nhật thành công! Vui lòng nhập mật khẩu mới vừa đổi để xác thực.');
      sessionStorage.removeItem('medicare_ct_iv_v2_pwd_just_changed');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessNotice(null);

    if (!pin.trim()) {
      setError('Vui lòng nhập Mật khẩu quản trị viên!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await unlockAdmin(pin.trim());
      setIsSubmitting(false);

      if (!result.success) {
        setError(result.message || 'Mật khẩu quản trị không chính xác. Vui lòng kiểm tra lại!');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      setIsSubmitting(false);
      setError('Đã xảy ra lỗi khi xác thực mật khẩu. Vui lòng thử lại!');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const currentDevice = trustedDevices[0];

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden transition-transform duration-300 ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-7 text-center relative">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8 text-teal-300" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Khu Vực Quản Trị Cấp Cao</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Khóa Bảo Mật Admin
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            Hệ thống Dịch vụ Y tế Cần Thơ — Vui lòng nhập mật khẩu xác thực để truy cập hồ sơ khách hàng và điều phối kíp trực.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {/* Success Notice after password change */}
          {successNotice && (
            <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-800 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mật Khẩu Quản Trị (Admin Password) <span className="text-rose-500">*</span>:
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu quản trị viên..."
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  required
                  className="w-full text-base font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-600 transition"
                />
                <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPin ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Mở Khóa Quản Trị Hệ Thống</span>
                </>
              )}
            </button>
          </form>

          {/* Device & Security Verification Status Badge */}
          {currentDevice && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 truncate">
                  <Laptop className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{currentDevice.name}</span>
                </div>
                {currentDevice.isApproved ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Đã duyệt
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                    Chờ duyệt
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>IP: {currentDevice.ip}</span>
                {lastAdminUnlockTime && <span>Mở gần nhất: {lastAdminUnlockTime}</span>}
              </div>
            </div>
          )}

          {/* Secure System Notice */}
          <div className="text-center">
            <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-teal-600" />
              Mật khẩu được mã hóa an toàn chuẩn SHA-256
            </span>
          </div>

          {/* Back button */}
          <button
            type="button"
            onClick={() => setRole('patient')}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại màn hình Bệnh nhân</span>
          </button>
        </div>
      </div>
    </div>
  );
};
