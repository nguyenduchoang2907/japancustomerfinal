import { formatInTimeZone } from "date-fns-tz";
import { OrderModel } from "@/types/order";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { getStatusBadge, getPaymentIcon } from "./utils";

interface ReservationsTableProps {
  reservations: OrderModel[];
  onPrint: (orderId: string) => void;
}

const ReservationsTable = ({ reservations, onPrint }: ReservationsTableProps) => {
  if (reservations.length === 0) {
    return <div className="text-center py-8 text-gray-500">Không có đặt bàn nào trong vòng 1 tháng qua</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-black"> {/* Đổi màu header sang đen */}
            <TableHead className="text-black">Mã đặt bàn</TableHead>
            <TableHead className="text-black">Ngày</TableHead>
            <TableHead className="text-black">Số khách</TableHead>
            <TableHead className="text-black">Bàn</TableHead>
            <TableHead className="text-black">Trạng thái</TableHead>
            <TableHead className="text-black">Thanh toán</TableHead>
            <TableHead className="text-black text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((res) => (
            <TableRow key={res.id}>
              <TableCell className="font-medium">{res.id}</TableCell>
              <TableCell>
                {formatInTimeZone(new Date(res.reservation_time), "UTC", "dd/MM/yyyy HH:mm")} (UTC)
              </TableCell>
              <TableCell>{res.guest_count} người</TableCell>
              <TableCell>
                {res.tables && res.tables.length > 0
                  ? res.tables.map((t) => `Bàn #${t.table_number}`).join(", ")
                  : "Chưa chỉ định"}
              </TableCell>
              <TableCell>{getStatusBadge(res.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getPaymentIcon(res.payment_method)}
                  <span>{res.payment_method}</span>
                  <span className="mx-1">-</span>
                  <span>{getStatusBadge(res.is_paid ? "Đã thanh toán" : "Chưa thanh toán")}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="outline" onClick={() => onPrint(String(res.id))}>
                  In hóa đơn
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReservationsTable;
