export type UserRole = 'patient' | 'doctor' | 'admin';

export interface ServiceItem {
  id: string;
  name: string;
  price: number; // default or base price in VND
  priceMax?: number; // for range pricing e.g. 120.000 - 150.000
  priceDisplay?: string; // e.g. "350.000đ" or "120.000đ - 150.000đ"
  unit: string; // e.g. "1 chai", "2 chai", "mũi tiêm", "liều"
  description?: string;
}

export interface ServiceGroup {
  id: string;
  groupNumber: number;
  name: string;
  subtitle: string;
  badge?: string;
  description: string;
  items: ServiceItem[];
  colorTheme: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'teal' | 'indigo' | 'cyan' | 'orange';
}

export interface SelectedServiceItem {
  itemId: string;
  groupId: string;
  groupName: string;
  name: string;
  price: number;
  priceMax?: number;
  unit: string;
  quantity: number;
}

export interface VitalSigns {
  bloodPressure: string; // e.g. "120/80"
  heartRate: number; // bpm
  temperature: number; // °C
  weight: number; // kg
  spo2: number; // %
  bloodSugar?: number; // mg/dL (optional)
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  quantity: string;
  instructions: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  date: string;
  vitalSigns: VitalSigns;
  infusionDetails: {
    solutions: string; // Loại dịch truyền (NaCl, Glucose, Vitaplex...)
    dripRate: string; // Tốc độ truyền (e.g. 40 - 50 giọt/phút)
    veinSite: string; // Vị trí lấy ven (e.g. Mu bàn tay trái, Cẳng tay phải)
    toleranceStatus: string; // Đáp ứng của bệnh nhân trong lúc truyền
  };
  symptoms: string;
  clinicalDiagnosis: string;
  treatmentPlan: string;
  prescriptions: PrescriptionItem[];
  doctorAdvice: string;
  isLocked: boolean; // LOCKED PERMANENTLY
  lockedAt: string;
  digitalSignature: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  district: string; // Quận/Huyện tại TP. Cần Thơ
  patientAddress: string; // Số nhà, tên đường, phường/xã
  patientGender: 'Nam' | 'Nữ' | 'Khác';
  patientBirthYear: number;
  selectedServices: SelectedServiceItem[];
  estimatedPriceMin: number;
  estimatedPriceMax: number;
  finalActualPrice?: number; // Chi phí thực tế chốt sau khi bác sĩ khám đánh giá
  isFinalPriceConfirmed?: boolean;
  date: string;
  timeSlot: string;
  symptoms: string;
  medicalHistory: string; // Tiền sử bệnh nền (Bắt buộc)
  allergyHistory: string; // Tiền sử dị ứng (Bắt buộc)
  currentMedications: string; // Thuốc đang sử dụng (Bắt buộc)
  status: AppointmentStatus;
  doctorId?: string;
  doctorName?: string;
  znsSent: boolean;
  znsSentAt?: string;
  notes?: string;
  createdAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar: string;
  phone: string;
  room: string;
  experience: string;
  status: 'active' | 'on_duty';
}

export interface PatientProfile {
  id: string;
  fullName: string;
  phone: string;
  district: string;
  address: string;
  birthYear: number;
  gender: 'Nam' | 'Nữ' | 'Khác';
  bloodType: string;
  allergies: string;
  medicalHistory: string; // Tiền sử bệnh nền
  allergyHistory: string; // Tiền sử dị ứng
  currentMedications: string; // Thuốc đang sử dụng
  totalSpent: number;
  registeredAt: string;
}

export interface ZnsNotification {
  id: string;
  recipientPhone: string;
  recipientName: string;
  appointmentId: string;
  title: string;
  content: string;
  appointmentDate: string;
  timeSlot: string;
  servicesSummary: string;
  estimatedFee: string;
  doctorName?: string;
  sentAt: string;
  type: 'booking_confirmation' | 'reminder' | 'actual_fee_confirmed';
}

export const CAN_THO_DISTRICTS = [
  'Quận Ninh Kiều',
  'Quận Cái Răng',
  'Quận Bình Thủy',
  'Quận Ô Môn',
  'Quận Thốt Nốt',
  'Huyện Phong Điền',
  'Huyện Cờ Đỏ',
  'Huyện Thới Lai',
  'Huyện Vĩnh Thạnh',
];
