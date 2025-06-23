import { useEffect, useState } from 'react';
import { MenuItem } from '../../types/menuItem';
import menuItemApi from '../../api/menuItemApi';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const PopularDishesSection = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    menuItemApi
      .getAll()
      .then((res) => {
        const randomItems = getRandomItems(res.data, 4);
        setMenuItems(randomItems);
      })
      .catch((err) => {
        console.error('Failed to fetch menu items:', err);
      });
  }, []);

  return (
    <div className="py-20 bg-gradient-to-b from-japanese-washi to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="japanese-title text-4xl font-bold mb-4">Món Ăn Phổ Biến</h2>
          <p className="japanese-text text-japanese-stone text-lg max-w-3xl mx-auto leading-relaxed">
            Giới thiệu những món ăn đặc sắc được các đầu bếp tâm huyết chế biến<br />
            Hương vị Nhật Bản đích thực từ nguyên liệu tươi và kỹ thuật truyền thống
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 items-stretch">
          {menuItems.map((dish, index) => (
            <div
              key={dish.item_id}
              className="japanese-card flex flex-col h-full overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={dish.image_url || '/fallback-image.jpg'}
                  alt={dish.name}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"

                />
                <div className="absolute inset-0 bg-gradient-to-t from-japanese-sumi/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="japanese-title font-semibold text-xl mb-2">{dish.name}</h3>
                  <p className="japanese-text text-japanese-stone text-sm mb-4 leading-relaxed">
                    {dish.description || 'Không có mô tả.'}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-primary font-bold text-lg font-japanese">
                    {(dish.price * (1 - dish.discount_percent / 100)).toLocaleString()}₫
                  </span>
                  <Link to="/menu">
                    <Button size="sm" className="zen-button font-japanese">
                      Đặt Món
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/menu">
            <Button className="zen-button px-8 py-3 text-lg font-japanese">
              Xem Tất Cả Món
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopularDishesSection;
