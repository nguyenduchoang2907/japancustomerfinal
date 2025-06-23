import { useState, useEffect, useRef } from "react";
import { subMonths, isAfter } from "date-fns";
import { useAppSelector } from "@/redux/hooks"; // 👈 để lấy auth state
import { io, Socket } from "socket.io-client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import orderApi from "@/api/orderApi";
import { OrderModel } from "@/types/order";
import FoodOrdersTable from "@/components/orderManagement/FoodOrdersTable";
import ReservationsTable from "@/components/orderManagement/ReservationsTable";

const SOCKET_URL = "https://api.vnpt-hn.io.vn";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("food-orders");
  const [foodOrders, setFoodOrders] = useState<OrderModel[]>([]);
  const [reservations, setReservations] = useState<OrderModel[]>([]);
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);

  const auth = useAppSelector((state) => state.auth);
  const customerId = auth.user.customer.customer_id;

  const loadOrders = async () => {
    if (!customerId) return;

    try {
      const orders = await orderApi.getByCustomerId(customerId);
      console.log("📦 All orders:", orders);

      const oneMonthAgo = subMonths(new Date(), 1);

      const recentFoodOrders = orders.filter(
        (order) =>
          order.order_type === "delivery" &&
          isAfter(new Date(order.order_date), oneMonthAgo)
      );

      const recentReservations = orders.filter(
        (order) =>
          order.order_type === "reservation" &&
          isAfter(new Date(order.order_date), oneMonthAgo)
      );

      setFoodOrders(recentFoodOrders);
      setReservations(recentReservations);
    } catch (error) {
      toast({
        title: "Lỗi khi tải dữ liệu",
        description: "Không thể tải đơn hàng hoặc đặt bàn",
        variant: "destructive",
      });
    }
  };

useEffect(() => {
  loadOrders(); // Lần đầu tải dữ liệu

  socketRef.current = io(SOCKET_URL, {
    transports: ["websocket"],
  });

  const socket = socketRef.current;

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  // Khi tạo đơn hàng
  socket.on("order-created", (newOrder: OrderModel) => {
    if (newOrder.customer_id !== customerId) return;

    toast({
      title: "Đơn hàng mới!",
      description: `Đã tạo đơn hàng mới: ${newOrder.id}`,
    });

    loadOrders(); // 👈 Tải lại đơn hàng từ API
  });

  // Khi cập nhật đơn hàng
  socket.on("order-updated", (updatedOrder: OrderModel) => {
    if (updatedOrder.customer_id !== customerId) return;

    toast({
      title: "Đơn hàng cập nhật",
      description: `Cập nhật đơn hàng: ${updatedOrder.id}`,
    });

    loadOrders(); // 👈 Tải lại đơn hàng từ API
  });

  return () => {
    socket.disconnect();
  };
}, [customerId]);


  const handlePrintReceipt = (id: string) => {
    toast({
      title: "Đang in hóa đơn",
      description: `Hóa đơn ${id} đang được in...`,
    });
  };
  console.log("🍽 foodOrders:", foodOrders);
  console.log("📅 reservations:", reservations);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600">
              Xem và quản lý đơn hàng và đặt bàn của bạn trong vòng 1 tháng qua
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng và đặt bàn</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="food-orders" className="flex-1">
                    Đơn hàng thức ăn
                  </TabsTrigger>
                  <TabsTrigger value="reservations" className="flex-1">
                    Đặt bàn
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="food-orders">
                  <FoodOrdersTable
                    orders={foodOrders}
                    onPrint={handlePrintReceipt}
                  />
                </TabsContent>

                <TabsContent value="reservations">
                  <ReservationsTable
                    reservations={reservations}
                    onPrint={handlePrintReceipt}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Orders;
