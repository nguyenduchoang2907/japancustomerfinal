/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { MenuItem as MenuItemType } from "@/types/menuItem";
import { CommentResponse } from "@/types/comment";
import { Button } from "@/components/ui/button";
import MenuItem from "@/components/detail/MenuItem";
import CommentSection from "@/components/detail/CommentSection";
import menuItemApi from "@/api/menuItemApi";
import commentApi from "@/api/commentApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";

export default function FoodDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<MenuItemType | null>(null);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  const extractCommentText = (raw: any): string => {
    if (typeof raw === "string") return raw;
    if (typeof raw === "object" && raw !== null) {
      if ("comment" in raw && typeof raw.comment === "string") {
        return raw.comment;
      }
      return JSON.stringify(raw);
    }
    return String(raw);
  };

  const fetchItem = useCallback(async () => {
    if (!id) return;
    try {
      const response = await menuItemApi.getById(Number(id));
      const rawData = response.data;

      const parsedData: MenuItemType = {
        ...rawData,
        price: Number(rawData.price),
        discount_percent: Number(rawData.discount_percent),
        stock_quantity:
          rawData.stock_quantity !== undefined
            ? Number(rawData.stock_quantity)
            : undefined,
      };

      setItem(parsedData);
    } catch (error) {
      console.error("Lỗi khi lấy món ăn:", error);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const response = await commentApi.getByMenuItemId(id);
      const cleanedComments = response.data.map((c: any) => ({
        ...c,
        comment: extractCommentText(c.comment),
      }));
      setComments(cleanedComments);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
    fetchComments();
  }, [fetchItem, fetchComments]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {!item ? (
          <div className="text-center py-10 text-gray-500">
            Không tìm thấy món ăn.{" "}
            <Link to="/" className="text-primary underline">
              Quay lại trang chủ
            </Link>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-4 py-10">
            <MenuItem item={item} quantity={quantity} setQuantity={setQuantity} />
            <CommentSection
              comments={comments}
              setComments={setComments}
              itemId={Number(item.item_id)}
              refreshComments={fetchComments}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
