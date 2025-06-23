/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MenuItem as MenuItemType } from "@/types/menuItem";

type Props = {
  item: MenuItemType;
  quantity: number;
  setQuantity: (q: number) => void;
};

// Hàm format VND
function formatCurrency(amount: number): string {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export default function MenuItem({ item, quantity, setQuantity }: Props) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    const savedCart = localStorage.getItem("cart");
    let currentCart = savedCart ? JSON.parse(savedCart) : [];

    const existingItemIndex = currentCart.findIndex(
      (cartItem: any) => cartItem.item.item_id === item.item_id
    );

    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({ item, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${quantity} x ${item.name}`,
    });

    setQuantity(1);
  };

  // Tính toán giá
  const originalPrice: number = item.price;
  const discountPercent: number = item.discount_percent;
  const hasDiscount = discountPercent > 0;
  const finalPrice: number = hasDiscount
    ? originalPrice * (1 - discountPercent / 100)
    : originalPrice;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-lg overflow-hidden shadow-md">
        <img
          src={item.image_url || "/placeholder.jpg"}
          alt={item.name}
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{item.name}</h1>

        {/* Hiển thị giá */}
        <div className="space-y-1">
          {hasDiscount ? (
            <>
              <div className="text-gray-500 line-through text-lg">
                {formatCurrency(originalPrice)}
              </div>
              <div className="text-red-600 font-semibold">
                Giảm {discountPercent}%
              </div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(finalPrice)}
              </div>
            </>
          ) : (
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(originalPrice)}
            </div>
          )}
        </div>

        <p className="text-gray-700">
          {item.description || "Không có mô tả chi tiết"}
        </p>

        <div className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex border rounded mr-2">
              <button
                className="px-3 py-2 border-r hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-3 py-2 border-l hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90 flex items-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Thêm vào giỏ hàng</span>
            </Button>
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold">Số lượng còn lại:</h3>
          <p>{item.stock_quantity}</p>
        </div>
      </div>
    </div>
  );
}
