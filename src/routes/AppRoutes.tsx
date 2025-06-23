import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorPopup from "@/components/error/ErrorPopup";
import chatbotResponseApi from "@/api/chatbotResponseApi";
import { ChatbotResponse } from "@/types/chatbotResponse";
import { useLoading } from "@/context/LoadingContext";
import AuthChecker from "@/components/ui/AuthChecker";
import ChatBot from "@/pages/chatbot/ChatBot";

// ⏳ Lazy load pages
const Index = lazy(() => import("@/pages/index/Index"));
const Menu = lazy(() => import("@/pages/Foodmenu/Menu"));
const Reservation = lazy(() => import("@/pages/Reservation"));
const Checkout = lazy(() => import("@/pages/checkout/Checkout"));
const Coupons = lazy(() => import("@/pages/voucher/Coupons"));
const FoodDetail = lazy(() => import("@/pages/foodDetail/FoodDetail"));
const Orders = lazy(() => import("@/pages/Order/Orders"));
const VipProgram = lazy(() => import("@/pages/vip/VipProgram"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const GoogleSuccess = lazy(() => import("@/pages/auth/GoogleSuccess"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Login = lazy(() => import("@/pages/auth/Login"));
const UserProfile = lazy(() => import("@/pages/profile/ProfileForm"));
const EditProfileForm = lazy(() => import("@/pages/profile/EditProfileForm"));
const OrdersReturn = lazy(() => import("@/pages/OrdersReturn"))

const AppRoutes = () => {
  const { error, setError } = useLoading();
  const [responses, setResponses] = useState<ChatbotResponse[]>([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await chatbotResponseApi.getAll();
        setResponses(res.data);
      } catch (err) {
        setError("Không thể tải dữ liệu chatbot.");
      }
    };

    fetchResponses();
  }, [setError]);

  return (
    <>
      <ErrorPopup isOpen={!!error} onClose={() => setError(null)} message={error || ""} />

      <Suspense fallback={<div>Đang tải trang...</div>}>
        <Routes>
          {/* 🟢 Public Routes */}
          <Route path="/account/login" element={<Login />} />
          <Route path="/account/register" element={<Register />} />
          <Route path="/google-success" element={<GoogleSuccess />} />

          {/* 🔐 Authenticated Routes */}
          <Route path="/" element={<AuthChecker><Index /></AuthChecker>} />
          <Route path="/menu" element={<AuthChecker><Menu /></AuthChecker>} />
          <Route path="/reservation" element={<AuthChecker><Reservation /></AuthChecker>} />
          <Route path="/checkout" element={<AuthChecker><Checkout /></AuthChecker>} />
          <Route path="/profile" element={<AuthChecker><UserProfile /></AuthChecker>} />
          <Route path="/edit-profile" element={<AuthChecker><EditProfileForm /></AuthChecker>} />
          <Route path="/coupons" element={<AuthChecker><Coupons /></AuthChecker>} />
          <Route path="/food/:id" element={<AuthChecker><FoodDetail /></AuthChecker>} />
          <Route path="/orders" element={<AuthChecker><Orders /></AuthChecker>} />
          <Route path="/vip" element={<AuthChecker><VipProgram /></AuthChecker>} />
          <Route path="*" element={<AuthChecker><NotFound /></AuthChecker>} />
          <Route path="/order-return" element={<AuthChecker><OrdersReturn /></AuthChecker>} />

        </Routes>
      </Suspense>

      <ChatBot responses={responses} />
    </>
  );
};

export default AppRoutes;
