/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  deliveryMethod: string;
  user: any;
  onChange?: (updatedFields: Partial<any>) => void;
}

const CustomerInfoForm = ({ deliveryMethod, user, onChange }: Props) => {
  const { register, setValue } = useFormContext();

  useEffect(() => {
    if (user) {
      const updatedFields = {
        name: user.name,
        phone: user.phone,
        delivery_address: user.address,
        customer_id: user.customer?.customer_id,
      };

      Object.entries(updatedFields).forEach(([key, value]) => {
        setValue(key, value);
      });

      onChange?.(updatedFields);
    }
  }, [user, setValue, onChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {deliveryMethod === "delivery" ? "Thông tin giao hàng" : "Thông tin người đặt"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name">Họ tên</Label>
          <Input id="name" disabled {...register("name")} />
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" placeholder="Nhập số điện thoại" {...register("phone")} />
        </div>
      </div>

      {deliveryMethod === "delivery" && (
        <div className="mb-4">
          <Label htmlFor="delivery_address">Địa chỉ giao hàng</Label>
          <Textarea
            id="delivery_address"
            placeholder="Nhập địa chỉ giao hàng chi tiết"
            {...register("delivery_address")}
          />
        </div>
      )}

      {deliveryMethod === "pickup" && (
        <div className="mb-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Địa chỉ nhà hàng:</h3>
          <p>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
          <p className="text-sm text-gray-600 mt-2">
            Vui lòng đến đúng giờ để nhận đơn hàng của bạn.
          </p>
        </div>
      )}

      <div className="mb-4">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          id="note"
          placeholder="Ghi chú đặc biệt cho đơn hàng"
          {...register("note")}
        />
      </div>
    </div>
  );
};

export default CustomerInfoForm;
