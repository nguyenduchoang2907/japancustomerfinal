import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import CouponCard from "@/components/voucher/CouponCard";
import { Voucher } from "@/types/voucher";
import voucherApi from "@/api/voucherApi";
import { Loader2 } from "lucide-react";

const Coupons = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const res = await voucherApi.getAll();
        setVouchers(res.data);
      } catch (err) {
        console.error("Lỗi khi tải voucher:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const isNewVoucher = (voucher: Voucher) => {
    const createdAt = new Date(voucher.created_at);
    const now = new Date();
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 7;
  };

  const isLimitedVoucher = (voucher: Voucher) =>
    voucher.usage_limit !== null && voucher.usage_limit <= 10;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-primary/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Mã giảm giá</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá các mã giảm giá độc quyền và tiết kiệm khi đặt món tại Délice
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white p-6 rounded-lg shadow-md mb-10">
            <h2 className="text-xl font-semibold mb-4">Cách sử dụng mã giảm giá</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step}
                  </div>
                  <h3 className="font-medium mb-2">
                    {["Chọn mã giảm giá", "Đặt món hoặc đặt bàn", "Áp dụng mã giảm giá"][i]}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {[
                      "Sao chép mã giảm giá mà bạn muốn sử dụng",
                      "Chọn món ăn hoặc đặt bàn theo nhu cầu của bạn",
                      "Dán mã vào ô mã giảm giá khi thanh toán",
                    ][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Mã giảm giá hiện có</h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
            </div>
          ) : vouchers.length === 0 ? (
            <p className="text-gray-500">Không có mã giảm giá nào.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vouchers.map((voucher) => (
                <CouponCard
                  key={voucher.voucher_id}
                  voucher={voucher}
                  title={voucher.code}
                  isNew={isNewVoucher(voucher)}
                  isLimited={isLimitedVoucher(voucher)}
                />
              ))}
            </div>
          )}


        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Coupons;