import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MenuItem } from "@/types/menuItem";

type FoodCardProps = {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity: number) => void;
};

const FoodCard = ({ item, onAddToCart }: FoodCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${quantity} x ${item.name}`,
    });
    setQuantity(1);
  };

  const finalPrice =
    item.price * (1 - (item.discount_percent ?? 0) / 100);

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white">
      <Link to={`/food/${item.item_id}`} className="block h-48 overflow-hidden">
        <img
          src={item.image_url || "/no-image.png"}
          alt={item.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform"
        />
      </Link>
      <div className="p-4">
        <Link to={`/food/${item.item_id}`} className="block">
          <h3 className="font-bold text-xl mb-2 hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">
          {item.description || "Không có mô tả."}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-primary">
            {finalPrice.toLocaleString()} ₫
            {item.discount_percent ? (
              <span className="text-sm text-gray-500 line-through ml-2">
                {item.price.toLocaleString()} ₫
              </span>
            ) : null}
          </span>
          <div className="flex items-center">
            <div className="flex border rounded mr-2">
              <button
                className="px-2 py-1 border-r hover:bg-gray-100"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-3 py-1">{quantity}</span>
              <button
                className="px-2 py-1 border-l hover:bg-gray-100"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              <span>Thêm</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
