/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import { MenuItem } from "@/types/menuItem";
import CustomerInfoForm from "@/components/checkout/CustomerInfoForm";
import PaymentMethodSection from "@/components/checkout/PaymentMethodSection";
import { OrderCreateRequest } from "@/types/order";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import orderApi from "@/api/orderApi";
import { io } from "socket.io-client";
import { useForm, FormProvider } from "react-hook-form";


interface ExtendedOrderCreateRequest extends OrderCreateRequest {
  delivery_address: string;
  phone: string;
}

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const Checkout = () => {
  const formMethods = useForm(); 
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryMethod] = useState("delivery");
  const [isLoading, setIsLoading] = useState(false);

  const [payload, setPayload] = useState<ExtendedOrderCreateRequest>({
    customer_id: user?.customer.customer_id,
    table_ids: undefined,
    voucher_id: undefined,
    guest_count: undefined,
    order_type: "delivery",
    order_items: [],
    note: "",
    order_date: new Date().toISOString(),
    total_amount: 0,
    discount_amount: 0,
    vip_discount_percent: 0,
    shipping_fee: 0,
    free_shipping_applied: false,
    final_amount: 0,
    status: "pending",
    payment_method: "cash",
    is_paid: false,
    delivery_address: user?.address || "",
    phone: user?.phone || "",
  });

  const socketRef = useRef<any>(null);

  useEffect(() => {
    // 🔌 Kết nối socket
    socketRef.current = io("https://api.vnpt-hn.io.vn");

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  const updateQuantity = (item_id: number, newQuantity: number) => {
    const updatedCart = cartItems.map(cartItem =>
      String(cartItem.item.item_id) === String(item_id)
        ? { ...cartItem, quantity: newQuantity }
        : cartItem
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (item_id: number) => {
    const updatedCart = cartItems.filter(
      cartItem => String(cartItem.item.item_id) !== String(item_id)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast({ title: "Đã xóa sản phẩm khỏi giỏ hàng" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (cartItems.length === 0 || !payload.delivery_address || !payload.phone) {
      toast({
        title: "Thanh toán",
        description: "Vui lòng điền đầy đủ thông tin và giỏ hàng",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const orderItems = cartItems.map(cartItem => ({
        item_id: Number(cartItem.item.item_id),
        quantity: cartItem.quantity,
      }));

      const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.item.price,
        0
      );

      const finalPayload: ExtendedOrderCreateRequest = {
        ...payload,
        order_items: orderItems,
        total_amount: total,
        final_amount: total,
      };

      await orderApi.create(finalPayload);

      socketRef.current?.emit("order_created", {
        customer_id: user?.customer.customer_id,
        order_data: finalPayload,
      });

      toast({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đã được tiếp nhận.",
      });

      setCartItems([]);
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (error: any) {
      console.error("Order creation failed:", error);
      toast({
        title: "Lỗi đặt hàng",
        description: error?.response?.data?.message || "Đã xảy ra lỗi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <div className="flex flex-col min-h-screen">
    <Navbar />

    <main className="flex-grow">
      {/* Banner */}
      <div className="bg-primary/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Thanh toán</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Đơn hàng của bạn sẽ được giao tận nơi
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-600 mb-6">Hãy thêm món ăn vào giỏ hàng của bạn</p>
            <Link to="/menu">
              <Button className="bg-primary hover:bg-primary/90">Xem thực đơn</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Form section */}
            <div className="md:col-span-2">
              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <CustomerInfoForm
                    deliveryMethod={deliveryMethod}
                    user={user}
                    onChange={(updatedFields) =>
                      setPayload((prev) => ({ ...prev, ...updatedFields }))
                    }
                  />

                  <PaymentMethodSection />

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Đặt hàng"}
                  </Button>
                </form>
              </FormProvider>
            </div>

            {/* Order Summary */}
            <div>
              <OrderSummary
                cartItems={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            </div>
          </div>
        )}
      </div>
    </main>

    <Footer />
  </div>
  );
};

export default Checkout;
