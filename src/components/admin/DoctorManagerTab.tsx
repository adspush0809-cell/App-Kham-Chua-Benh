import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, TrustedDevice } from '../../types';
import {
  UserPlus,
  Edit2,
  Trash2,
  Upload,
  Image,
  Phone,
  Award,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  KeyRound,
  Laptop,
  Check,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

const PRESET_AVATARS = [
  {
    label: 'Bác sĩ Nam (Trẻ trung)',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bác sĩ Nam (Kinh nghiệm)',
    url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bác sĩ Nữ (Hồi sức)',
    url: 'https://images.unsplash.com/photo-1594824813583-b9d99a4cbeec?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Bác sĩ Nữ (Nội khoa)',
    url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
  },
  {
    label: 'Điều dưỡng Nam (Cấp cứu)',
    url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
  },
];

interface DoctorManagerTabProps {
  onNavigateToSecurity?: () => void;
}

export const DoctorManagerTab: React.FC<DoctorManagerTabProps> = ({ onNavigateToSecurity }) => {
  const {
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    appointments,
    trustedDevices,
    toggleApproveDevice,
    updateAdminPin,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [room, setRoom] = useState('');
  const [experience, setExperience] = useState('');
  const [status, setStatus] = useState<'active' | 'on_duty'>('on_duty');
  const [avatar, setAvatar] = useState(PRESET_AVATARS[0].url);

  // Status feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Change PIN states
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinFeedback, setPinFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenAdd = () => {
    setEditingDoctor(null);
    setName('');
    setTitle('Bác sĩ Chuyên khoa');
    setSpecialty('Nội khoa & Hồi sức Cấp cứu');
    setPhone('0969799467');
    setRoom('Đội truyền dịch lưu động TP. Cần Thơ');
    setExperience('5 năm kinh nghiệm lâm sàng');
    setStatus('on_duty');
    setAvatar(PRESET_AVATARS[0].url);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setName(doc.name);
    setTitle(doc.title);
    setSpecialty(doc.specialty);
    setPhone(doc.phone);
    setRoom(doc.room);
    setExperience(doc.experience);
    setStatus(doc.status);
    setAvatar(doc.avatar);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Vui lòng chọn tệp hình ảnh (PNG, JPG, WEBP).' });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Ảnh đại diện không nên vượt quá 3MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Vui lòng nhập họ tên bác sĩ.' });
      return;
    }

    if (editingDoctor) {
      updateDoctor({
        ...editingDoctor,
        name: name.trim(),
        title: title.trim(),
        specialty: specialty.trim(),
        phone: phone.trim(),
        room: room.trim(),
        experience: experience.trim(),
        status,
        avatar,
      });
      setFeedback({ type: 'success', message: `Đã cập nhật hồ sơ bác sĩ "${name.trim()}" thành công!` });
    } else {
      addDoctor({
        name: name.trim(),
        title: title.trim(),
        specialty: specialty.trim(),
        phone: phone.trim(),
        room: room.trim(),
        experience: experience.trim(),
        status,
        avatar,
      });
      setFeedback({ type: 'success', message: `Đã thêm bác sĩ "${name.trim()}" vào kíp trực y khoa!` });
    }

    setIsModalOpen(false);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDelete = (doc: Doctor) => {
    const res = deleteDoctor(doc.id);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinFeedback(null);

    if (newPinInput !== confirmPinInput) {
      setPinFeedback({ type: 'error', message: 'Mật khẩu mới và xác nhận mật khẩu không trùng khớp!' });
      return;
    }

    const res = await updateAdminPin(currentPinInput, newPinInput);
    if (res.success) {
      setPinFeedback({ type: 'success', message: res.message });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinFeedback(null);
      }, 1500);
    } else {
      setPinFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Kíp Trực Y Khoa TP. Cần Thơ</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Quản Lý Danh Sách &amp; Hồ Sơ Bác Sĩ
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Thêm mới, cập nhật ảnh đại diện bác sĩ trực tiếp, quản lý quyền phân công ca truyền và bảo mật thiết bị đăng nhập.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToSecurity) {
                onNavigateToSecurity();
              } else {
                setIsPinModalOpen(true);
              }
            }}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition cursor-pointer"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Cài Đặt Bảo Mật &amp; Đổi Mật Khẩu</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Thêm Bác Sĩ Mới</span>
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doc) => {
          const isLead = doc.id === 'doc-phuc';
          const assignedCount = appointments.filter((a) => a.doctorId === doc.id).length;

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-xs flex flex-col justify-between ${
                isLead ? 'border-teal-400 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        doc.status === 'on_duty' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      title={doc.status === 'on_duty' ? 'Đang trực sẵn sàng' : 'Nghỉ ca'}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-black text-slate-900 truncate">{doc.name}</h3>
                      {isLead && (
                        <span className="bg-teal-100 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                          Trưởng Kíp
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-teal-700 mt-0.5">{doc.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{doc.specialty}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{doc.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.experience}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-500">{doc.room}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  {assignedCount} ca đã phân công
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(doc)}
                    className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                    title="Chỉnh sửa hồ sơ & Avatar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>

                  {!isLead && (
                    <button
                      type="button"
                      onClick={() => handleDelete(doc)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold text-xs"
                      title="Xóa bác sĩ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Device Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-teal-700" />
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Bảo Mật Thiết Bị Đăng Nhập Hệ Thống
              </h3>
              <p className="text-xs text-slate-500">
                Phê duyệt hoặc thu hồi quyền truy cập của các thiết bị Admin để bảo vệ hồ sơ bệnh nhân.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full">
            {trustedDevices.filter((d) => d.isApproved).length} thiết bị đã duyệt
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {trustedDevices.map((device) => (
            <div key={device.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800">{device.name}</span>
                  {device.isApproved ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Hợp lệ
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Đã khóa
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap gap-x-3">
                  <span>Trình duyệt: {device.browser}</span>
                  <span>IP: {device.ip}</span>
                  <span>Hoạt động: {device.lastActive}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleApproveDevice(device.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-center ${
                  device.isApproved
                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                }`}
              >
                {device.isApproved ? 'Khóa quyền' : 'Phê duyệt thiết bị'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add or Edit Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-500/20 text-teal-300 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold">
                  {editingDoctor ? 'Chỉnh Sửa Hồ Sơ Bác Sĩ' : 'Thêm Bác Sĩ Vào Kíp Trực'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-4">
              {/* Avatar Uploader Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ảnh Đại Diện Bác Sĩ (Avatar) <span className="text-rose-500">*</span>:
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
                    />
                    <span className="absolute -bottom-1.5 -right-1.5 bg-teal-600 text-white p-1 rounded-full text-[10px]">
                      <Check className="w-3 h-3" />
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-teal-600" />
                      <span>Tải ảnh từ máy / điện thoại</span>
                    </button>
                    <p className="text-[11px] text-slate-500">
                      Hỗ trợ ảnh thẻ y khoa PNG, JPG hoặc ảnh chụp thực tế.
                    </p>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                    Hoặc chọn nhanh ảnh mẫu có sẵn:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_AVATARS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition cursor-pointer ${
                          avatar === preset.url
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img src={preset.url} alt="" className="w-4 h-4 rounded-full object-cover" />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Họ và tên bác sĩ <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: BS. Nguyễn Văn Phúc"
                    className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Số điện thoại liên hệ <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0969799467"
                    className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Học vị / Chức danh:
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VD: Bác sĩ Trưởng kíp Y khoa / BS. CKI"
                    className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Chuyên khoa đào tạo:
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="VD: Hồi Sức Cấp Cứu & Nội Tổng Quát"
                    className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Kinh nghiệm lâm sàng:
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="VD: 10 năm kinh nghiệm lâm sàng"
                    className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1 font-semibold">
                    Trạng thái trực:
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30 cursor-pointer"
                  >
                    <option value="on_duty">Sẵn sàng nhận ca (On Duty)</option>
                    <option value="active">Nghỉ ca / Dự phòng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold">
                  Địa bàn / Đội phụ trách lưu động:
                </label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="VD: Đội lưu động Quận Ninh Kiều & Cái Răng"
                  className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingDoctor ? 'Cập Nhật Hồ Sơ' : 'Lưu Bác Sĩ Mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Admin PIN */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold">Đổi Mã Khóa Bảo Mật Admin</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePin} className="p-5 sm:p-6 space-y-4">
              {pinFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    pinFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pinFeedback.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold">
                  Mã PIN hiện tại <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="password"
                  required
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại..."
                  className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold">
                  Mã PIN mới <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="password"
                  required
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-600 mb-1 font-semibold">
                  Xác nhận mã PIN mới <span className="text-rose-500">*</span>:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Nhập lại mã PIN mới"
                  className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPinModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Xác Nhận Đổi PIN</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
