/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CommentResponse, CreateCommentPayload } from "@/types/comment";
import commentApi from "@/api/commentApi";
import { useAppSelector } from "@/redux/hooks";

type Props = {
  comments: CommentResponse[];
  setComments: (comments: CommentResponse[]) => void;
  itemId: number;
  refreshComments: () => void; // ✅ Thêm hàm từ cha
};

export default function CommentSection({
  comments,
  setComments,
  itemId,
  refreshComments,
}: Props) {
  const [newCommentText, setNewCommentText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const { toast } = useToast();

  const user = useAppSelector((state) => state.auth.user);
  const customerId = user?.customer?.customer_id || null;
  const name = user?.name || "Ẩn danh";

  function extractCommentText(raw: any): string {
    if (typeof raw === "string") return raw;
    if (typeof raw === "object" && raw !== null) {
      if ("comment" in raw && typeof raw.comment === "string") {
        return raw.comment;
      }
      return JSON.stringify(raw);
    }
    return String(raw);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCommentText.trim()) {
      toast({
        title: "Vui lòng nhập bình luận",
        description: "Nội dung bình luận không được để trống.",
        variant: "destructive",
      });
      return;
    }

    if (!customerId) {
      toast({
        title: "Không thể gửi đánh giá",
        description: "Bạn cần đăng nhập để đánh giá.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: CreateCommentPayload = {
        item_id: itemId,
        customer_id: customerId,
        rating: newRating,
        comment: newCommentText,
      };

      await commentApi.create(payload);

      toast({
        title: "Đã gửi đánh giá",
        description: "Cảm ơn bạn đã đánh giá món ăn này!",
      });

      setNewCommentText("");
      setNewRating(5);

      // ✅ Gọi lại hàm để reload comment từ server
      refreshComments();
    } catch (error) {
      toast({
        title: "Gửi đánh giá thất bại",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Đánh giá và bình luận</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Viết đánh giá của bạn</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Tên người dùng</label>
            <p className="font-semibold">{name}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Đánh giá</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= newRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setNewRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Nội dung bình luận</label>
            <Textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Chia sẻ cảm nhận về món ăn..."
              rows={4}
              required
            />
          </div>

          <Button type="submit">Gửi đánh giá</Button>
        </form>
      </div>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Chưa có đánh giá nào. Hãy là người đầu tiên!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-white p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">
                    {comment.commenter?.user_info?.name || "Ẩn danh"}
                  </h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= comment.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <p>{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
