import React, { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: "vi";
  setLanguage: (lang: "vi") => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  vi: {
    home: "Trang chủ",
    menu: "Thực đơn",
    reservation: "Đặt bàn",
    coupons: "Khuyến mãi",
    vip: "VIP",
    orders: "Đơn hàng",
    cart: "Giỏ hàng",
    reservationTitle: "Đặt bàn",
    reservationSubtitle:
      "Đặt bàn trước để đảm bảo trải nghiệm ẩm thực tuyệt vời tại nhà hàng Sakura",
    reservationInfo: "Thông tin đặt bàn",
    openingHours: "Giờ mở cửa",
    reservationPolicy: "Chính sách đặt bàn",
    needSupport: "Cần hỗ trợ?",
    contactUs: "Liên hệ với chúng tôi qua số điện thoại hoặc email:",
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    email: "Email",
    guests: "Số khách",
    date: "Ngày",
    time: "Giờ",
    notes: "Ghi chú",
    selectedTables: "Bàn đã chọn",
    selectTables: "Chọn bàn",
    submit: "Đặt bàn",
    processing: "Đang xử lý...",
    enterName: "Nhập họ tên của bạn",
    enterPhone: "Nhập số điện thoại",
    enterEmail: "Nhập email của bạn",
    selectGuests: "Chọn số người",
    selectDate: "Chọn ngày",
    selectTime: "Chọn giờ",
    enterNotes: "Ghi chú thêm (nếu có)",
    weekdays: "Thứ 2 - Thứ 6",
    weekend: "Thứ 7 - Chủ nhật",
    lunch: "Bữa trưa",
    dinner: "Bữa tối",
    policy1: "Vui lòng đến đúng giờ. Chúng tôi sẽ giữ bàn trong vòng 15 phút.",
    policy2: "Đối với những dịp đặc biệt, chúng tôi có thể yêu cầu đặt cọc.",
    policy3: "Hủy đặt bàn vui lòng thông báo trước ít nhất 4 giờ.",
    policy4: "Đối với nhóm trên 10 người, vui lòng liên hệ trực tiếp.",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<"vi">(() => {
    const saved = localStorage.getItem("language");
    return (saved as "vi") || "vi";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["vi"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
