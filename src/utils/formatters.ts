import { AppointmentStatus } from '../types';

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

export const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Chờ duyệt',
        className: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
        dot: 'bg-amber-500',
      };
    case 'confirmed':
      return {
        label: 'Đã xác nhận',
        className: 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20',
        dot: 'bg-sky-500',
      };
    case 'in_progress':
      return {
        label: 'Đang khám',
        className: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20',
        dot: 'bg-indigo-500 animate-pulse',
      };
    case 'completed':
      return {
        label: 'Đã hoàn thành',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
        dot: 'bg-emerald-500',
      };
    case 'cancelled':
      return {
        label: 'Đã hủy',
        className: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-500',
      };
  }
};
