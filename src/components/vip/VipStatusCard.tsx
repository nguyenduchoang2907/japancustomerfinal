import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Star, Gift, Truck } from "lucide-react";
import { VipLevel, VipBenefits } from "@/types/vip";
import  vipAPi  from "@/api/vipApi"; // API fetch VIP levels

interface Props {
  userTotalSpent: number; // truyền từ bên ngoài vào
  userPoints: number; // nếu có hệ thống tích điểm riêng
}

const tierIcons: Record<string, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  Platinum: "💎",
  Diamond: "👑",
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case "Bronze":
      return "bg-yellow-400 text-black";
    case "Silver":
      return "bg-gray-400 text-white";
    case "Gold":
      return "bg-yellow-500 text-black";
    case "Platinum":
      return "bg-blue-400 text-white";
    case "Diamond":
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-300 text-black";
  }
};

const renderBenefits = (benefits?: VipBenefits | null): string[] => {
  if (!benefits) return [];

  const offers: string[] = [];

  if (benefits.freeDelivery) offers.push("Miễn phí giao hàng");
  if (benefits.prioritySupport) offers.push("Hỗ trợ ưu tiên");
  if (benefits.monthlyVouchers)
    offers.push(`Tặng ${benefits.monthlyVouchers} voucher mỗi tháng`);
  if (benefits.birthdayGift) offers.push("Quà tặng sinh nhật");
  if (benefits.vipRoomAccess) offers.push("Truy cập phòng VIP");
  if (benefits.exclusiveEvents) offers.push("Tham gia sự kiện độc quyền");

  return offers;
};

const VipStatusCard: React.FC<Props> = ({ userTotalSpent, userPoints }) => {
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<VipLevel | null>(null);
  const [nextLevel, setNextLevel] = useState<VipLevel | null>(null);

  useEffect(() => {
    const fetchVipLevels = async () => {
      const levels = await vipAPi.getAll();
      const sorted = levels.data.sort((a, b) => a.min_total_spent - b.min_total_spent);

      setVipLevels(sorted);

      let current: VipLevel | null = null;
      let next: VipLevel | null = null;

      for (let i = 0; i < sorted.length; i++) {
        const level = sorted[i];
        if (userTotalSpent >= level.min_total_spent) {
          current = level;
          next = sorted[i + 1] || null;
        }
      }

      setCurrentLevel(current);
      setNextLevel(next);
    };

    fetchVipLevels();
  }, [userTotalSpent]);

  if (!currentLevel) return null; // loading hoặc không có hạng nào phù hợp

  const progressToNextTier =
    nextLevel === null
      ? 100
      : (userTotalSpent / nextLevel.min_total_spent) * 100;

  const amountToNextTier =
    nextLevel === null ? 0 : nextLevel.min_total_spent - userTotalSpent;

  const offers = renderBenefits(currentLevel.benefits);

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <span className="text-2xl">
            {tierIcons[currentLevel.name] || "🌟"}
          </span>
          <span>Hạng VIP của bạn</span>
        </CardTitle>
        <Badge className={`text-lg py-2 px-4 ${getTierColor(currentLevel.name)}`}>
          {currentLevel.name}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">Điểm tích lũy</p>
            <p className="text-2xl font-bold text-primary">
              {userPoints.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tổng chi tiêu</p>
            <p className="text-2xl font-bold text-green-600">
              {userTotalSpent.toLocaleString()}đ
            </p>
          </div>
        </div>

        {nextLevel && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tiến độ lên hạng tiếp theo</span>
              <span>{Math.round(progressToNextTier)}%</span>
            </div>
            <Progress value={progressToNextTier} className="h-3" />
            <p className="text-xs text-gray-500 mt-1">
              Còn {amountToNextTier.toLocaleString()}đ để lên hạng{" "}
              {nextLevel.name}
            </p>
          </div>
        )}

        {offers.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Ưu đãi hiện tại
            </h4>
            <ul className="space-y-1">
              {offers.map((offer, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                  <span>{offer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-4 w-4" />
            <span className="font-medium">Miễn phí ship</span>
          </div>
          <p className="text-sm">
            {currentLevel.free_shipping_threshold === 0
              ? "Tất cả đơn hàng"
              : `Đơn hàng từ ${currentLevel.free_shipping_threshold?.toLocaleString()}đ`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VipStatusCard;
