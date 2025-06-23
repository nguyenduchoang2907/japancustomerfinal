// components/checkout/PaymentMethodSection.tsx
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PaymentMethodSection = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
    <RadioGroup defaultValue="cash" className="space-y-3">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="cash" id="cash" />
        <Label htmlFor="cash" className="font-medium">Tiền mặt khi nhận hàng</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="bank" id="bank" />
        <Label htmlFor="bank" className="font-medium">Chuyển khoản ngân hàng</Label>
      </div>

    </RadioGroup>
  </div>
);

export default PaymentMethodSection;
