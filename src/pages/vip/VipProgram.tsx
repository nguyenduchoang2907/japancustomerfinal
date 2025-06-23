import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import VipStatusCard from "@/components/vip/VipStatusCard";
import vipAPi from "@/api/vipApi";
import { VipLevel, VipBenefits } from "@/types/vip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, Gift } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // đường dẫn này tùy thuộc vào cấu trúc dự án của bạn


interface TierDisplay {
  name: string;
  threshold: string;
  benefits: string[];
  icon: string;
  color: string;
  minTotal: number;
}

const tierIcons: Record<string, string> = {
  bronze: "🥉",
  sliver: "🥈",
  gold: "🥇",
  Platinum: "💎",
  Diamond: "👑",
};

const tierColors: Record<string, string> = {
  Bronze: "bg-yellow-400 text-black",
  Silver: "bg-gray-400 text-white",
  Gold: "bg-yellow-500 text-black",
  Platinum: "bg-blue-400 text-white",
  Diamond: "bg-purple-500 text-white",
};

const renderBenefits = (benefits?: VipBenefits | null): string[] => {
  if (!benefits) return [];

  const offers: string[] = [];

  if (benefits.freeDelivery) offers.push("Miễn phí giao hàng");
  if (benefits.prioritySupport) offers.push("Hỗ trợ ưu tiên");
  if (benefits.monthlyVouchers)
    offers.push(`Voucher hàng tháng x${benefits.monthlyVouchers}`);
  if (benefits.birthdayGift) offers.push("Quà sinh nhật");
  if (benefits.vipRoomAccess) offers.push("Truy cập phòng VIP");
  if (benefits.exclusiveEvents) offers.push("Tham gia sự kiện độc quyền");
  if (benefits.notifyPromotions) offers.push("Ưu tiên nhận khuyến mãi");
  if (benefits.priorityReservation) offers.push("Ưu tiên đặt bàn");
  if (benefits.freeDessert) offers.push("Tặng món tráng miệng");

  return offers;
};


const VipProgram: React.FC = () => {
  const [tiers, setTiers] = useState<TierDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTier, setCurrentTier] = useState<TierDisplay | null>(null);
  const [nextTier, setNextTier] = useState<TierDisplay | null>(null);
  const [remainingToNextTier, setRemainingToNextTier] = useState<number | null>(null);

const user = useSelector((state: RootState) => state.auth.user);
const userTotalSpent = parseFloat(
  user?.customer?.total_spent !== undefined && user?.customer?.total_spent !== null
    ? String(user.customer.total_spent)
    : "0"
);
const userPoints = Math.floor(userTotalSpent / 1000);

  useEffect(() => {
    vipAPi
      .getAll()
      .then((res) => {
        const levels: VipLevel[] = res.data;
        const sorted = levels.sort((a, b) => a.min_total_spent - b.min_total_spent);

        const mapped: TierDisplay[] = sorted.map((lv) => ({
          name: lv.name,
threshold: new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
}).format(Number(lv.min_total_spent)),          benefits: renderBenefits(lv.benefits),
          icon: tierIcons[lv.name.toLowerCase()] || "🌟",
          color: tierColors[lv.name] || "bg-gray-300 text-black",
          minTotal: lv.min_total_spent,
        }));

        setTiers(mapped);

        // Xác định hạng hiện tại và hạng tiếp theo
        let current: TierDisplay | null = null;
        let next: TierDisplay | null = null;

        for (let i = 0; i < mapped.length; i++) {
          if (userTotalSpent >= mapped[i].minTotal) {
            current = mapped[i];
          } else {
            next = mapped[i];
            break;
          }
        }

        setCurrentTier(current);
        setNextTier(next);

        if (next && next.minTotal > userTotalSpent) {
          setRemainingToNextTier(next.minTotal - userTotalSpent);
        } else {
          setRemainingToNextTier(null); // Đã đạt cấp cao nhất
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-gradient-to-r from-primary/20 to-purple-100 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Crown className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Chương trình VIP Tokime</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tích điểm với mỗi đơn và nhận ưu đãi hấp dẫn: cấp càng cao, quyền lợi càng nhiều!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div>
              <VipStatusCard
                userTotalSpent={userTotalSpent}
                userPoints={userPoints}
              />
              <div className="mt-4 text-sm text-gray-700">
                {currentTier && (
                  <p>
                    🎖️ Hạng hiện tại:{" "}
                    <strong className="text-primary">{currentTier.name}</strong>
                  </p>
                )}
                {nextTier && remainingToNextTier !== null ? (
                  <p>
                    🔜 Còn{" "}
                    <strong className="text-red-500">
                      {remainingToNextTier.toLocaleString()}đ
                    </strong>{" "}
                    để lên hạng{" "}
                    <strong className="text-primary">{nextTier.name}</strong>
                  </p>
                ) : (
                  <p>🏆 Bạn đã đạt hạng cao nhất!</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Cách thức hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {["Đặt hàng & tích điểm", "Lên hạng VIP", "Nhận ưu đãi"].map(
                      (step, idx) => (
                        <div key={step} className="text-center">
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                            {idx + 1}
                          </div>
                          <h3 className="font-medium mb-2">{step}</h3>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center mb-8">Các hạng VIP</h2>
            {loading ? (
              <p className="text-center">Đang tải...</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {tiers.map((tier, idx) => (
                  <Card
                    key={tier.name}
                    className={`relative ${
                      idx >= 3 ? "border-2 border-primary" : ""
                    }`}
                  >
                    {idx >= 3 && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-white">Cao cấp</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-3">
                      <div className="text-4xl mb-2">{tier.icon}</div>
                      <Badge className={`text-lg py-2 px-4 ${tier.color}`}>
                        {tier.name}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-2">
                        Từ {tier.threshold}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.benefits.map((b, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm"
                          >
                            <Star className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="mt-16">
            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Làm sao để tích điểm?</h4>
                    <p className="text-gray-600 text-sm">
                      Bạn nhận 1 điểm cho mỗi 1,000đ chi tiêu.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Điểm có hết hạn không?</h4>
                    <p className="text-gray-600 text-sm">
                      Hạng VIP được đánh giá lại hàng năm.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">
                      Khi nào ưu đãi VIP được áp dụng?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Ưu đãi được áp dụng tự động dựa trên hạng VIP của bạn.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VipProgram;
