import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-japanese-sumi/95 text-japanese-washi relative overflow-hidden">
      {/* Họa tiết nền */}
      <div className="absolute inset-0 bg-gradient-to-br from-japanese-sakura/10 to-japanese-matcha/10"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 animate-sakura-float">🌸</div>
        <div className="absolute top-20 right-20 animate-float-delay-1">🎋</div>
        <div className="absolute bottom-32 left-32 animate-float-delay-2">🏮</div>
        <div className="absolute bottom-20 right-40 animate-float-slow">🌙</div>
        <div className="absolute top-40 left-1/2 animate-bounce-gentle">⛩️</div>
        <div className="absolute top-1/2 right-1/4 animate-sakura-float">🍃</div>
      </div>

      {/* Các biểu tượng mèo bay lơ lửng */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 right-8 text-4xl animate-float-character opacity-80">🐱</div>
        <div className="absolute top-1/3 left-8 text-3xl animate-float-delay-1 opacity-60">🐾</div>
        <div className="absolute bottom-1/3 right-16 text-2xl animate-bounce-gentle opacity-70">😺</div>
        <div className="absolute top-2/3 left-1/3 text-3xl animate-sakura-float opacity-50">🐈</div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl animate-magical-glow">🌸</span>
              <div>
                <h3 className="japanese-title text-2xl font-bold text-japanese-sakura">Tokimeレストラン</h3>
                <p className="font-japanese text-sm text-japanese-washi/90">Nhà hàng Tokime</p>
              </div>
            </div>
            <p className="japanese-text leading-relaxed text-japanese-washi/95">
              Mang đến trải nghiệm tuyệt vời nhất cho quý khách<br />
              bằng hương vị Nhật truyền thống và lòng hiếu khách chân thành.
            </p>
              <h4 className="font-semibold text-japanese-sakura mb-2 font-japanese flex items-center gap-1">
                📍 Địa chỉ
                <span className="animate-pulse">✨</span>
              </h4>
              <p className="japanese-text text-sm text-japanese-washi/90">
                123 Quận Hai Bà Trưng<br />
                Hà Nội
              </p>
          </div>

          <div className="space-y-4">
            <h3 className="japanese-title text-xl font-bold text-japanese-sakura mb-6 flex items-center gap-2">
              Giờ mở cửa
              <span className="animate-bounce-gentle">🕐</span>
            </h3>
            <div className="space-y-3">
                <p className="japanese-text text-japanese-washi/95">
                  <span className="text-japanese-matcha font-semibold">Ngày thường:</span> 11:00 - 22:00
                </p>
                <p className="japanese-text text-japanese-washi/95">
                  <span className="text-japanese-matcha font-semibold">Cuối tuần:</span> 10:00 - 23:00
                </p>
            </div>
            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-japanese-sakura font-japanese flex items-center gap-1">
                📞 Liên hệ
                <span className="animate-pulse">💫</span>
              </h4>
              <p className="japanese-text text-japanese-washi/95">Điện thoại: 0832083622</p>
              <p className="japanese-text text-japanese-washi/95">Email: tokime@vnpt.io.com</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="japanese-title text-xl font-bold text-japanese-sakura mb-6 flex items-center gap-2">
              Menu
              <span className="animate-wiggle">🍱</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="japanese-text text-japanese-washi/90 hover:text-japanese-sakura transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-wiggle transition-transform">🏮</span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/menu" className="japanese-text text-japanese-washi/90 hover:text-japanese-sakura transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-wiggle transition-transform">🍱</span>
                  Thực đơn
                </Link>
              </li>
              <li>
                <Link to="/reservation" className="japanese-text text-japanese-washi/90 hover:text-japanese-sakura transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-wiggle transition-transform">📅</span>
                  Đặt bàn
                </Link>
              </li>
              <li>
                <Link to="/coupons" className="japanese-text text-japanese-washi/90 hover:text-japanese-sakura transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-wiggle transition-transform">🎌</span>
                  Khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="/vip" className="japanese-text text-japanese-washi/90 hover:text-japanese-sakura transition-colors duration-300 flex items-center group">
                  <span className="mr-2 group-hover:animate-wiggle transition-transform">👑</span>
                  Thành viên VIP
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-japanese-sakura/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="japanese-text text-japanese-washi/80">
              &copy; {new Date().getFullYear()} ときめsレストラン (Nhà hàng Tokime). Đã đăng ký bản quyền.
            </p>
<div className="flex items-center space-x-4">
  <span className="japanese-text text-japanese-washi/80">Theo dõi chúng tôi:</span>
  <div className="flex space-x-3">
    <a
      href="https://www.facebook.com/tokime.restaurant"
      target="_blank"
      rel="noopener noreferrer"
      className="text-xl hover:animate-bounce transition-transform hover:scale-110 text-[#1877f2]"
    >
      <FaFacebookF className="w-6 h-6" />
    </a>
    <a
      href="https://zalo.me/1234567890"
      target="_blank"
      rel="noopener noreferrer"
      className="text-xl hover:animate-bounce transition-transform hover:scale-110 text-[#0068ff]"
    >
      <SiZalo className="w-6 h-6" />
    </a>
  </div>
</div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
