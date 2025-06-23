import { CreditCard, Wallet, BanknoteIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getPaymentIcon = (method?: string | null) => {
  if (typeof method !== "string") return <CreditCard className="h-4 w-4" />;

  switch (method.toLowerCase()) {
    case "visa":
    case "mastercard":
      return <CreditCard className="h-4 w-4" />;
    case "tiền mặt":
      return <BanknoteIcon className="h-4 w-4" />;
    case "atm":
      return <Wallet className="h-4 w-4" />;
    default:
      return <CreditCard className="h-4 w-4" />;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "đã giao":
    case "hoàn thành":
    case "đã thanh toán":
    case "đã xác nhận":
      return <Badge className="bg-green-500">{status}</Badge>;
    case "đang giao":
    case "đã đặt cọc":
      return <Badge className="bg-yellow-500">{status}</Badge>;
    case "thanh toán khi giao hàng":
      return <Badge className="bg-blue-500">{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
