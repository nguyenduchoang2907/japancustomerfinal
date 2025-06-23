import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import PopularDishesSection from "@/components/index/menuItem";
import CustomerTestimonialsSection from "@/components/index/comment";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section - Tokime Restaurant */}
      <div className="relative h-[600px] bg-zen-pattern bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-japanese-sumi/70 via-japanese-sumi/50 to-japanese-sumi/70">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white p-8 japanese-card bg-black/30 backdrop-blur-sm">
            <div className="mb-6 animate-float">
              <span className="text-6xl md:text-8xl">✨</span>
            </div>
            <h1 className="japanese-title text-4xl md:text-7xl font-bold mb-4 text-white animate-fade-slide">
              Tokimeレストラン
            </h1>
            <h2 className="text-2xl md:text-3xl mb-2 font-japanese-serif text-japanese-sakura">
              Nhà hàng Tokime
            </h2>
            <p className="text-lg md:text-xl mb-8 japanese-text text-japanese-washi max-w-2xl mx-auto leading-relaxed">
              Mang đến trải nghiệm tuyệt vời nhất cho quý khách
              <br />
              bằng hương vị Nhật truyền thống và lòng hiếu khách chân thành
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/menu">
                <Button className="zen-button px-8 py-4 text-lg font-japanese">
                  🍱 Xem Thực Đơn
                </Button>
              </Link>
              <Link to="/reservation">
                <Button className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-japanese-sumi px-8 py-4 text-lg font-japanese transition-all duration-300">
                  🏮 Đặt Bàn
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dịch vụ */}
      <div className="py-20 washi-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="japanese-title text-4xl font-bold mb-4">
              Dịch Vụ Của Chúng Tôi
            </h2>
            <p className="japanese-text text-japanese-stone text-lg max-w-3xl mx-auto">
              Đón tiếp khách hàng bằng ẩm thực Nhật Bản đích thực và lòng hiếu
              khách truyền thống
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ẩm thực Nhật */}
            <div className="japanese-card p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-japanese-vermillion rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <span className="text-3xl">🍱</span>
              </div>
              <h3 className="japanese-title text-2xl font-semibold mb-4">
                Ẩm Thực Nhật Bản Chính Thống
              </h3>
              <p className="japanese-text text-japanese-stone mb-6 leading-relaxed">
                Sushi, ramen, tempura được chế biến
                <br />
                từ nguyên liệu tươi ngon và phương pháp truyền thống
              </p>
              <Link to="/menu">
                <Button
                  variant="link"
                  className="text-primary font-japanese hover:text-japanese-vermillion"
                >
                  Xem Thực Đơn →
                </Button>
              </Link>
            </div>

            {/* Không gian Nhật */}
            <div className="japanese-card p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-japanese-matcha rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <span className="text-3xl">🏮</span>
              </div>
              <h3 className="japanese-title text-2xl font-semibold mb-4">
                Không Gian Nhật Bản
              </h3>
              <p className="japanese-text text-japanese-stone mb-6 leading-relaxed">
                Phòng truyền thống với chiếu tatami và cửa shoji
                <br />
                Thưởng thức bữa ăn trong sự yên tĩnh và thanh lịch
              </p>
              <Link to="/reservation">
                <Button
                  variant="link"
                  className="text-primary font-japanese hover:text-japanese-vermillion"
                >
                  Đặt Bàn →
                </Button>
              </Link>
            </div>

            {/* Ưu đãi */}
            <div className="japanese-card p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-japanese-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-float">
                <span className="text-3xl">🎌</span>
              </div>
              <h3 className="japanese-title text-2xl font-semibold mb-4">
                Ưu Đãi Đặc Biệt
              </h3>
              <p className="japanese-text text-japanese-stone mb-6 leading-relaxed">
                Thực đơn theo mùa và ưu đãi đặc biệt
                <br />
                dành riêng cho hội viên
              </p>
              <Link to="/coupons">
                <Button
                  variant="link"
                  className="text-primary font-japanese hover:text-japanese-vermillion"
                >
                  Xem Khuyến Mãi →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Món ăn phổ biến */}


          <PopularDishesSection />


      {/* Cảm nhận khách hàng */}
      <CustomerTestimonialsSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
