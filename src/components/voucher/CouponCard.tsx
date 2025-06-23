import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Voucher } from "@/types/voucher";

type CouponCardProps = {
  voucher: Voucher;
  title: string;
  isNew?: boolean;
  isLimited?: boolean;
};

const CouponCard = ({ voucher, title, isNew, isLimited }: CouponCardProps) => {
  const { toast } = useToast();
  const { code, value, type, expires_at } = voucher;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã sao chép mã",
      description: `Mã ${code} đã được sao chép vào clipboard`,
    });
  };

  const formattedDiscount =
    type === "percent" ? `${value}%` : `${Number(value).toLocaleString()}đ`;

  const formattedExpiry = expires_at
    ? new Date(expires_at).toLocaleDateString("vi-VN")
    : "Không giới hạn";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white relative">
        <div className="absolute top-0 right-0 -mt-2 -mr-2 flex">
          {isNew && <Badge className="bg-green-500 hover:bg-green-600">Mới</Badge>}
          {isLimited && <Badge className="bg-amber-500 hover:bg-amber-600 ml-1">Sắp hết</Badge>}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm opacity-90">Giảm {formattedDiscount}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gray-100 px-3 py-2 rounded-lg font-mono text-sm">
            {code}
          </div>
          <Button onClick={handleCopy} variant="outline" size="sm">
            Sao chép
          </Button>
        </div>

        <div className="text-xs text-gray-500">Hạn sử dụng: {formattedExpiry}</div>
      </div>
    </div>
  );
};

export default CouponCard;
