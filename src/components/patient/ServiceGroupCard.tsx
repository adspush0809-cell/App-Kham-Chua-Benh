import React, { useState } from 'react';
import { ServiceGroup, ServiceItem, SelectedServiceItem } from '../../types';
import { formatVND } from '../../utils/formatters';
import {
  Check,
  Plus,
  Minus,
  Sparkles,
  Info,
  Droplets,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ServiceGroupCardProps {
  group: ServiceGroup;
  selectedItems: SelectedServiceItem[];
  onToggleItem: (item: ServiceItem, group: ServiceGroup) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  defaultExpanded?: boolean;
}

export const ServiceGroupCard: React.FC<ServiceGroupCardProps> = ({
  group,
  selectedItems,
  onToggleItem,
  onUpdateQuantity,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const selectedCount = group.items.filter((item) =>
    selectedItems.some((s) => s.itemId === item.id)
  ).length;

  const getTheme = () => {
    switch (group.colorTheme) {
      case 'blue':
        return {
          border: 'border-sky-200 hover:border-sky-400',
          badge: 'bg-sky-50 text-sky-700 border-sky-200',
          header: 'from-sky-50 to-blue-50/50',
          dot: 'bg-sky-500',
        };
      case 'emerald':
        return {
          border: 'border-emerald-200 hover:border-emerald-400',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          header: 'from-emerald-50 to-teal-50/50',
          dot: 'bg-emerald-500',
        };
      case 'amber':
        return {
          border: 'border-amber-200 hover:border-amber-400',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          header: 'from-amber-50/70 to-orange-50/40',
          dot: 'bg-amber-500',
        };
      case 'rose':
        return {
          border: 'border-rose-200 hover:border-rose-400',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          header: 'from-rose-50/70 to-pink-50/40',
          dot: 'bg-rose-500',
        };
      case 'purple':
        return {
          border: 'border-purple-200 hover:border-purple-400',
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          header: 'from-purple-50 to-indigo-50/40',
          dot: 'bg-purple-500',
        };
      case 'teal':
        return {
          border: 'border-teal-200 hover:border-teal-400',
          badge: 'bg-teal-50 text-teal-700 border-teal-200',
          header: 'from-teal-50 to-emerald-50/40',
          dot: 'bg-teal-500',
        };
      case 'cyan':
        return {
          border: 'border-cyan-200 hover:border-cyan-400',
          badge: 'bg-cyan-50 text-cyan-700 border-cyan-200',
          header: 'from-cyan-50 to-sky-50/40',
          dot: 'bg-cyan-500',
        };
      case 'indigo':
        return {
          border: 'border-indigo-200 hover:border-indigo-400',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          header: 'from-indigo-50 to-purple-50/40',
          dot: 'bg-indigo-500',
        };
      case 'orange':
        return {
          border: 'border-orange-200 hover:border-orange-400 ring-2 ring-orange-500/15',
          badge: 'bg-orange-50 text-orange-700 border-orange-200',
          header: 'from-orange-50 to-amber-50/50',
          dot: 'bg-orange-500',
        };
      default:
        return {
          border: 'border-slate-200 hover:border-slate-300',
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
          header: 'from-slate-50 to-gray-50',
          dot: 'bg-slate-500',
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg overflow-hidden flex flex-col justify-between ${
        theme.border
      } ${selectedCount > 0 ? 'ring-2 ring-teal-500/20' : ''}`}
    >
      {/* Group Card Header (Clickable Accordion) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full text-left p-4 sm:p-5 bg-gradient-to-b ${theme.header} border-b border-slate-100 cursor-pointer select-none transition hover:opacity-95 focus:outline-none`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${theme.dot}`}></span>
              Nhóm {group.groupNumber}
            </span>
            {selectedCount > 0 && (
              <span className="bg-teal-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                Đã chọn {selectedCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {group.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                {group.badge}
              </span>
            )}
            <div className="w-7 h-7 rounded-lg bg-white/70 border border-slate-200 flex items-center justify-center text-slate-600">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-900 leading-snug">
          {group.name.replace(`Nhóm ${group.groupNumber}: `, '')}
        </h3>
        <p className="text-xs text-slate-600 font-medium mt-0.5">{group.subtitle}</p>

        {isExpanded ? (
          <p className="text-[11px] text-slate-500 mt-2 italic leading-relaxed">
            "{group.description}"
          </p>
        ) : (
          <div className="mt-2 text-[11px] font-semibold text-teal-700 flex items-center gap-1">
            <span>{group.items.length} dịch vụ trong nhóm</span>
            <span>• Chạm để xem chi tiết</span>
          </div>
        )}
      </button>

      {/* Items in this group (Collapsible) */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 space-y-2.5 flex-1 animate-in fade-in duration-150">
        {group.items.map((item) => {
          const selected = selectedItems.find((s) => s.itemId === item.id);
          const isSelected = !!selected;

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-sky-50/80 border-sky-400 ring-1 ring-sky-400/40 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleItem(item, group)}
                    className="mt-0.5 w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">
                      {item.name}
                    </span>
                    {item.description && (
                      <span className="text-[11px] text-slate-500 block mt-0.5 leading-snug">
                        {item.description}
                      </span>
                    )}
                  </div>
                </label>

                <div className="text-right shrink-0">
                  <span className="font-extrabold text-xs text-teal-800 block">
                    {item.priceDisplay || formatVND(item.price)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{item.unit}</span>
                </div>
              </div>

              {/* Quantity counter if selected */}
              {isSelected && (
                <div className="mt-2.5 pt-2 border-t border-sky-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-sky-800">Số lượng:</span>
                  <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-sky-300">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="text-slate-500 hover:text-rose-600 font-bold p-0.5 cursor-pointer"
                      title="Giảm"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-xs text-slate-900 w-5 text-center font-mono">
                      {selected.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="text-slate-500 hover:text-emerald-600 font-bold p-0.5 cursor-pointer"
                      title="Tăng"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
