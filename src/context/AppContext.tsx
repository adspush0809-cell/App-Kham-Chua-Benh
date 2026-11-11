import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  ServiceGroup,
  ServiceItem,
  SelectedServiceItem,
  Appointment,
  MedicalRecord,
  PatientProfile,
  Doctor,
  ZnsNotification,
  AppointmentStatus,
  CAN_THO_DISTRICTS,
} from '../types';
import {
  INITIAL_SERVICE_GROUPS,
  INITIAL_DOCTORS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_ZNS_NOTIFICATIONS,
} from '../mock/data';
import { formatVND } from '../utils/formatters';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeDoctorId: string;
  setActiveDoctorId: (id: string) => void;
  activePatientId: string;
  setActivePatientId: (id: string) => void;
  serviceGroups: ServiceGroup[];
  updateServiceGroup: (group: ServiceGroup) => void;
  updateServiceItemPrice: (groupId: string, itemId: string, newPrice: number, newPriceMax?: number) => void;
  appointments: Appointment[];
  patients: PatientProfile[];
  doctors: Doctor[];
  medicalRecords: MedicalRecord[];
  znsNotifications: ZnsNotification[];
  activeZnsModal: ZnsNotification | null;
  setActiveZnsModal: (notif: ZnsNotification | null) => void;
  bookAppointment: (data: {
    selectedServices: SelectedServiceItem[];
    date: string;
    timeSlot: string;
    fullName: string;
    phone: string;
    district: string;
    address: string;
    birthYear: number;
    gender: 'Nam' | 'Nữ' | 'Khác';
    symptoms: string;
  }) => { appointment: Appointment; notification: ZnsNotification };
  assignDoctor: (appointmentId: string, doctorId: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  confirmActualPrice: (appointmentId: string, actualPrice: number) => ZnsNotification | null;
  sendZnsReminder: (appointmentId: string) => ZnsNotification | null;
  addMedicalRecord: (data: Omit<MedicalRecord, 'id' | 'isLocked' | 'lockedAt' | 'digitalSignature'>) => MedicalRecord;
  resetToDefaultData: () => void;
  // Security Masking Helpers
  maskPhone: (phone: string) => string;
  maskAddress: (address: string) => string;
  hotlinePhone: string;
  doctorInCharge: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'medicare_ct_iv_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hotlinePhone = '0969799467';
  const doctorInCharge = 'BS. Phúc (0969799467)';

  // Load from LocalStorage or Defaults
  const [role, setRole] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEY_PREFIX + 'role') as UserRole) || 'patient';
  });

  const [activeDoctorId, setActiveDoctorId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'doc_id') || 'doc-phuc';
  });

  const [activePatientId, setActivePatientId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_PREFIX + 'pat_id') || 'pat-01';
  });

  const [serviceGroups, setServiceGroups] = useState<ServiceGroup[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'groups');
    return saved ? JSON.parse(saved) : INITIAL_SERVICE_GROUPS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'records');
    return saved ? JSON.parse(saved) : INITIAL_MEDICAL_RECORDS;
  });

  const [znsNotifications, setZnsNotifications] = useState<ZnsNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'zns');
    return saved ? JSON.parse(saved) : INITIAL_ZNS_NOTIFICATIONS;
  });

  const [activeZnsModal, setActiveZnsModal] = useState<ZnsNotification | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'doc_id', activeDoctorId);
  }, [activeDoctorId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'pat_id', activePatientId);
  }, [activePatientId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'groups', JSON.stringify(serviceGroups));
  }, [serviceGroups]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'records', JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'zns', JSON.stringify(znsNotifications));
  }, [znsNotifications]);

  // Masking helpers strictly enforced for Doctor role
  const maskPhone = (phone: string): string => {
    if (!phone) return '***';
    const clean = phone.trim();
    if (clean.length <= 4) return '***';
    return clean.slice(0, 4) + '***' + clean.slice(-2) + ' [Đã ẩn bảo mật]';
  };

  const maskAddress = (address: string): string => {
    if (!address) return '***';
    return '*** [Bảo mật địa chỉ nhà - Chỉ Admin được xem]';
  };

  // Update Service Group & Items (Admin)
  const updateServiceGroup = (updatedGroup: ServiceGroup) => {
    setServiceGroups((prev) => prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g)));
  };

  const updateServiceItemPrice = (
    groupId: string,
    itemId: string,
    newPrice: number,
    newPriceMax?: number
  ) => {
    setServiceGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        return {
          ...g,
          items: g.items.map((item) => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              price: newPrice,
              priceMax: newPriceMax,
              priceDisplay: newPriceMax && newPriceMax > newPrice
                ? `${formatVND(newPrice)} - ${formatVND(newPriceMax)}`
                : formatVND(newPrice),
            };
          }),
        };
      })
    );
  };

  // Patient Booking Flow with Multi-Service Selection
  const bookAppointment = (data: {
    selectedServices: SelectedServiceItem[];
    date: string;
    timeSlot: string;
    fullName: string;
    phone: string;
    district: string;
    address: string;
    birthYear: number;
    gender: 'Nam' | 'Nữ' | 'Khác';
    symptoms: string;
  }) => {
    const newId = `IV-CT-2026-${String(appointments.length + 1).padStart(3, '0')}`;
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Calculate Estimated Range
    let minTotal = 0;
    let maxTotal = 0;
    data.selectedServices.forEach((s) => {
      minTotal += s.price * s.quantity;
      maxTotal += (s.priceMax || s.price) * s.quantity;
    });

    // Auto-link or create patient profile
    let patient = patients.find((p) => p.phone === data.phone);
    let patientId = patient ? patient.id : `pat-${Date.now()}`;

    if (!patient) {
      const newPatient: PatientProfile = {
        id: patientId,
        fullName: data.fullName,
        phone: data.phone,
        district: data.district,
        address: data.address,
        birthYear: data.birthYear,
        gender: data.gender,
        bloodType: 'Chưa xác định',
        allergies: 'Không ghi nhận',
        totalSpent: minTotal,
        registeredAt: formattedNow.split(' ')[0],
      };
      setPatients((prev) => [newPatient, ...prev]);
    } else {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patient!.id ? { ...p, totalSpent: p.totalSpent + minTotal } : p
        )
      );
    }

    const servicesSummary = data.selectedServices
      .map((s) => `${s.name} (x${s.quantity})`)
      .join(', ');

    const estimatedDisplay =
      minTotal === maxTotal
        ? formatVND(minTotal)
        : `${formatVND(minTotal)} - ${formatVND(maxTotal)}`;

    const newAppointment: Appointment = {
      id: newId,
      patientId,
      patientName: data.fullName,
      patientPhone: data.phone,
      district: data.district,
      patientAddress: data.address,
      patientGender: data.gender,
      patientBirthYear: data.birthYear,
      selectedServices: data.selectedServices,
      estimatedPriceMin: minTotal,
      estimatedPriceMax: maxTotal,
      date: data.date,
      timeSlot: data.timeSlot,
      symptoms: data.symptoms,
      status: 'pending',
      doctorId: 'doc-phuc',
      doctorName: 'BS. Phúc (0969799467)',
      znsSent: true,
      znsSentAt: formattedNow,
      createdAt: formattedNow,
    };

    // Create Zalo ZNS simulated notification
    const znsNotif: ZnsNotification = {
      id: `zns-${Date.now()}`,
      recipientPhone: data.phone,
      recipientName: data.fullName,
      appointmentId: newId,
      title: 'Xác Nhận Đặt Lịch Truyền Dịch Tại Nhà Cần Thơ',
      content: `Kính gửi Quý khách ${data.fullName}, Dịch vụ Truyền dịch tại nhà Cần Thơ đã tiếp nhận yêu cầu. BS. Phúc (0969799467) đang chuẩn bị dịch truyền vô khuẩn và dụng cụ y tế để hỗ trợ bạn tại ${data.district}. Chi phí dự kiến: ${estimatedDisplay}.`,
      appointmentDate: data.date,
      timeSlot: data.timeSlot,
      servicesSummary,
      estimatedFee: estimatedDisplay,
      doctorName: 'BS. Phúc (0969799467)',
      sentAt: formattedNow,
      type: 'booking_confirmation',
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setZnsNotifications((prev) => [znsNotif, ...prev]);
    setActiveZnsModal(znsNotif);

    return { appointment: newAppointment, notification: znsNotif };
  };

  // Admin assigns doctor/nurse
  const assignDoctor = (appointmentId: string, doctorId: string) => {
    const doc = doctors.find((d) => d.id === doctorId);
    if (!doc) return;

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            doctorId: doc.id,
            doctorName: `${doc.name} (${doc.phone})`,
            status: apt.status === 'pending' ? 'confirmed' : apt.status,
          };
        }
        return apt;
      })
    );
  };

  // Admin updates appointment status
  const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
  };

  // Admin confirms actual final fee after clinical assessment
  const confirmActualPrice = (appointmentId: string, actualPrice: number): ZnsNotification | null => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return null;

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedAppts = appointments.map((a) =>
      a.id === appointmentId
        ? {
            ...a,
            finalActualPrice: actualPrice,
            isFinalPriceConfirmed: true,
            status: a.status === 'pending' ? ('confirmed' as AppointmentStatus) : a.status,
          }
        : a
    );
    setAppointments(updatedAppts);

    // Send Zalo Notification with confirmed actual price
    const znsNotif: ZnsNotification = {
      id: `zns-${Date.now()}`,
      recipientPhone: apt.patientPhone,
      recipientName: apt.patientName,
      appointmentId: apt.id,
      title: 'Xác Nhận Chi Phí Thực Tế Ca Truyền Dịch',
      content: `Kính gửi Quý khách ${apt.patientName}, sau khi Bác sĩ Phúc đánh giá tình trạng lâm sàng tại chỗ, chi phí thực tế trọn gói cho ca truyền dịch tại nhà của bạn đã được chốt là ${formatVND(actualPrice)}. Đã bao gồm toàn bộ công khám, kim luồn, dịch truyền và vật tư y tế.`,
      appointmentDate: apt.date,
      timeSlot: apt.timeSlot,
      servicesSummary: apt.selectedServices.map((s) => s.name).join(', '),
      estimatedFee: formatVND(actualPrice),
      doctorName: apt.doctorName || 'BS. Phúc (0969799467)',
      sentAt: formattedNow,
      type: 'actual_fee_confirmed',
    };

    setZnsNotifications((prev) => [znsNotif, ...prev]);
    setActiveZnsModal(znsNotif);

    return znsNotif;
  };

  // Admin sends Zalo ZNS reminder
  const sendZnsReminder = (appointmentId: string): ZnsNotification | null => {
    const apt = appointments.find((a) => a.id === appointmentId);
    if (!apt) return null;

    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const feeText = apt.isFinalPriceConfirmed && apt.finalActualPrice
      ? `Chi phí thực tế: ${formatVND(apt.finalActualPrice)}`
      : `Chi phí ước tính: ${formatVND(apt.estimatedPriceMin)}`;

    const znsNotif: ZnsNotification = {
      id: `zns-${Date.now()}`,
      recipientPhone: apt.patientPhone,
      recipientName: apt.patientName,
      appointmentId: apt.id,
      title: 'Nhắc Lịch Truyền Dịch Tại Nhà Cần Thơ',
      content: `Kính gửi Quý khách ${apt.patientName}, BS. Phúc (0969799467) xin nhắc lịch hẹn truyền dịch tại nhà vào khung giờ ${apt.timeSlot} ngày ${apt.date} tại ${apt.district}, TP. Cần Thơ. ${feeText}. Quý khách vui lòng chuẩn bị chỗ nằm thoáng mát.`,
      appointmentDate: apt.date,
      timeSlot: apt.timeSlot,
      servicesSummary: apt.selectedServices.map((s) => s.name).join(', '),
      estimatedFee: feeText,
      doctorName: apt.doctorName || 'BS. Phúc (0969799467)',
      sentAt: formattedNow,
      type: 'reminder',
    };

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, znsSent: true, znsSentAt: formattedNow } : a))
    );

    setZnsNotifications((prev) => [znsNotif, ...prev]);
    setActiveZnsModal(znsNotif);

    return znsNotif;
  };

  // Doctor adds new medical record - PERMANENTLY LOCKED UPON SAVE
  const addMedicalRecord = (
    data: Omit<MedicalRecord, 'id' | 'isLocked' | 'lockedAt' | 'digitalSignature'>
  ): MedicalRecord => {
    const now = new Date();
    const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newId = `IV-REC-2026-${String(medicalRecords.length + 1).padStart(3, '0')}`;

    const newRecord: MedicalRecord = {
      ...data,
      id: newId,
      isLocked: true, // STRICT IMMUTABILITY
      lockedAt: formattedNow,
      digitalSignature: `MD-SIG-CT-${data.doctorId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
    };

    setMedicalRecords((prev) => [newRecord, ...prev]);

    // Mark appointment as completed
    if (data.appointmentId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === data.appointmentId ? { ...a, status: 'completed' } : a))
      );
    }

    return newRecord;
  };

  const resetToDefaultData = () => {
    setServiceGroups(INITIAL_SERVICE_GROUPS);
    setAppointments(INITIAL_APPOINTMENTS);
    setPatients(INITIAL_PATIENTS);
    setMedicalRecords(INITIAL_MEDICAL_RECORDS);
    setZnsNotifications(INITIAL_ZNS_NOTIFICATIONS);
    setActiveDoctorId('doc-phuc');
    setActivePatientId('pat-01');
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeDoctorId,
        setActiveDoctorId,
        activePatientId,
        setActivePatientId,
        serviceGroups,
        updateServiceGroup,
        updateServiceItemPrice,
        appointments,
        patients,
        doctors,
        medicalRecords,
        znsNotifications,
        activeZnsModal,
        setActiveZnsModal,
        bookAppointment,
        assignDoctor,
        updateAppointmentStatus,
        confirmActualPrice,
        sendZnsReminder,
        addMedicalRecord,
        resetToDefaultData,
        maskPhone,
        maskAddress,
        hotlinePhone,
        doctorInCharge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
