import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceGroup, ServiceItem } from '../../types';
import { formatVND } from '../../utils/formatters';
import {
  Settings,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  DollarSign,
  Droplets,
  Edit2,
} from 'lucide-react';

export const PackageConfigTab: React.FC = () => {
  const { serviceGroups, updateServiceGroup, updateServiceItemPrice } = useApp();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(serviceGroups[0].id);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const currentGroup = serviceGroups.find((g) => g.id === selectedGroupId) || serviceGroups[0];

  // Editable local state for the active group
  const [formData, setFormData] = useState<ServiceGroup>({ ...currentGroup });

  const handleSelectGroup = (grpId: string) => {
    setSelectedGroupId(grpId);
    const target = serviceGroups.find((g) => g.id === grpId) || serviceGroups[0];
    setFormData({ ...target });
    setSaveSuccessMessage(null);
  };

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    updateServiceGroup(formData);
    setSaveSuccessMessage(
      `Đã cập nhật bảng giá ${formData.name}! Thay đổi sẽ hiển thị ngay lập tức ở giao diện Bệnh nhân đặt lịch.`
    );
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleItemPriceChange = (
    itemId: string,
    field: 'price' | 'priceMax' | 'name' | 'unit',
    val: any
  ) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id !== itemId) return item;
      const updated = { ...item, [field]: val };
      if (field === 'price' || field === 'priceMax') {
        const pMin = field === 'price' ? Number(val) : item.price;
        const pMax = field === 'priceMax' ? (val ? Number(val) : undefined) : item.priceMax;
        updated.priceDisplay =
          pMax && pMax > pMin
            ? `${formatVND(pMin)} - ${formatVND(pMax)}`
            : formatVND(pMin);
      }
      return updated;
    });

    setFormData({ ...formData, items: updatedItems });
  };

  const handleAddNewItem = () => {
    const newItem: ServiceItem = {
      id: `s-${formData.groupNumber}-${Date.now()}`,
      name: 'Dịch vụ truyền dịch mới',
      price: 350000,
      priceDisplay: '350.000đ',
      unit: '1 chai',
      description: 'Mô tả chi tiết kỹ thuật vô khuẩn và theo dõi...',
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    setFormData({ ...formData, items: formData.items.filter((i) => i.id !== itemId) });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 p-6 rounded-2xl text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Cấu Hình Bảng Giá Dịch Vụ
            </span>
            <span className="text-xs text-slate-300">
              Quản trị 9 nhóm dịch vụ truyền dịch tại nhà TP. Cần Thơ
            </span>
          </div>
          <h2 className="text-xl font-bold mt-1">Cấu Hình Giá 9 Nhóm Dịch Vụ &amp; Thuốc</h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Admin có quyền cập nhật giá đơn vị, giá khoảng (min - max), tên thuốc và đơn vị tính của từng dịch vụ.
          </p>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)}>✕</button>
        </div>
      )}

      {/* 9 Groups Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {serviceGroups.map((grp) => {
          const isSelected = grp.id === selectedGroupId;
          return (
            <button
              key={grp.id}
              onClick={() => handleSelectGroup(grp.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-white ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <span className="font-extrabold text-xs text-slate-900 block truncate">
                Nhóm {grp.groupNumber}
              </span>
              <span className="text-[11px] text-teal-800 font-semibold block truncate mt-0.5">
                {grp.name.replace(`Nhóm ${grp.groupNumber}: `, '')}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {grp.items.length} dịch vụ
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Edit Form for the selected group */}
      <form onSubmit={handleSaveGroup} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-teal-600" />
              Chỉnh Sửa Nhóm {formData.groupNumber}: <span className="text-teal-700">{formData.name}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{formData.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddNewItem}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm dòng thuốc / dịch vụ</span>
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Lưu bảng giá nhóm này</span>
            </button>
          </div>
        </div>

        {/* Group Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tên nhóm dịch vụ:
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Phụ đề / Hoạt chất chính:
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2.5"
            />
          </div>
        </div>

        {/* Items List in this Group */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Chi tiết các dịch vụ trong nhóm ({formData.items.length} dịch vụ):
          </label>

          <div className="space-y-3">
            {formData.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                      Tên dịch vụ / Thuốc:
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemPriceChange(item.id, 'name', e.target.value)}
                      className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                      Giá niêm yết / Giá Min (VNĐ):
                    </label>
                    <input
                      type="number"
                      step="10000"
                      value={item.price}
                      onChange={(e) => handleItemPriceChange(item.id, 'price', Number(e.target.value))}
                      className="w-full text-xs font-bold text-emerald-700 bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                      Giá Max (nếu có):
                    </label>
                    <input
                      type="number"
                      step="10000"
                      placeholder="Không có"
                      value={item.priceMax || ''}
                      onChange={(e) =>
                        handleItemPriceChange(
                          item.id,
                          'priceMax',
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-full text-xs font-bold text-emerald-700 bg-white border border-slate-300 rounded-lg px-2.5 py-2"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-[11px] text-slate-500 font-semibold mb-1">
                      Đơn vị:
                    </label>
                    <input
                      type="text"
                      value={item.unit}
                      onChange={(e) => handleItemPriceChange(item.id, 'unit', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded-lg px-2 py-2 text-center"
                    />
                  </div>

                  <div className="sm:col-span-1 text-center pt-5 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded"
                      title="Xóa dịch vụ này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>
                    Hiển thị trên màn hình khách: <strong>{item.priceDisplay}</strong> / {item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu bảng giá nhóm {formData.groupNumber}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
