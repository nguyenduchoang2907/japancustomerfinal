/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import { OrderModel } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getStatusBadge, getPaymentIcon } from "./utils";
import paymentApi from "@/api/payment.api"; // 🆕 import API

interface FoodOrdersTableProps {
  orders: OrderModel[];
  onPrint: (orderItems: any) => void;
}

const FoodOrdersTable = ({ orders, onPrint }: FoodOrdersTableProps) => {
  if (!orders.length) {
    return <div className="text-center py-8 text-gray-500">Không có đơn hàng giao hàng nào</div>;
  }

  // 🆕 Hàm gọi API thanh toán
  const handlePayNow = async (orderId: number) => {
    try {
      const res = await paymentApi.createVNPayUrl(orderId);
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.error("❌ Lỗi tạo link thanh toán:", error);
      alert("Không thể tạo link thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Mã đơn hàng</TableHead>
            <TableHead className="text-black">Ngày đặt</TableHead>
            <TableHead className="text-black">Tổng tiền</TableHead>
            <TableHead className="text-black">Trạng thái</TableHead>
            <TableHead className="text-black">Thanh toán</TableHead>
            <TableHead className="text-black">Món đã đặt</TableHead>
            <TableHead className="text-black text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{format(new Date(order.order_date), "dd/MM/yyyy HH:mm")}</TableCell>
              <TableCell>{Number(order.final_amount).toLocaleString()}đ</TableCell>
              <TableCell>{getStatusBadge(order.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getPaymentIcon(order.payment_method)}
                  <span>{order.payment_method}</span>
                  <span className="mx-1">-</span>
                  <span>{getStatusBadge(order.is_paid ? "Đã thanh toán" : "Chưa thanh toán")}</span>
                </div>
              </TableCell>
              <TableCell>
                <ul className="list-disc list-inside space-y-1">
                  {order.order_items.map((item) => (
                    <li key={item.order_item_id}>
                      {item.menu_item?.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button size="sm" variant="outline" onClick={() => onPrint(order.order_items)}>
                  In hóa đơn
                </Button>

                {!order.is_paid && (
                  <Button size="sm" variant="default" onClick={() => handlePayNow(order.id)}>
                    Thanh toán
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FoodOrdersTable;
