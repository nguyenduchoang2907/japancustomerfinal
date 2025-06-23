import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer/Footer";
import FoodCard from "@/components/foodmenu/FoodCard";
import { useToast } from "@/components/ui/use-toast";
import { MenuItem } from "@/types/menuItem";
import { Category } from "@/types/category";
import categoryApi from "@/api/categoryApi";
import menuItemApi from "@/api/menuItemApi";

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Fetch categories & menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, menuItemRes] = await Promise.all([
          categoryApi.getAll(),
          menuItemApi.getAll(),
        ]);

        setCategories(categoryRes.data);
        setMenuItems(menuItemRes.data);

        if (categoryRes.data.length > 0) {
          setSelectedCategory(categoryRes.data[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to load menu or categories", err);
      }
    };

    fetchData();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }, []);

  // Handle add to cart
  const handleAddToCart = (item: MenuItem, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.item.item_id === item.item_id);

    let updatedCart: CartItem[];

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
      updatedCart = updatedCartItems;
    } else {
      const newCartItems = [...cartItems, { item, quantity }];
      setCartItems(newCartItems);
      updatedCart = newCartItems;
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${quantity} x ${item.name}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-primary/10 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Thực đơn</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá thực đơn phong phú của chúng tôi với các món ăn được chế biến từ nguyên liệu tươi ngon nhất
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="mb-8 flex overflow-x-auto pb-2 justify-start">
              {categories.map(category => (
<TabsTrigger
  key={category.id}
  value={category.id.toString()}
  className={`
    relative px-6 py-3 text-gray-600 
    data-[state=active]:text-primary
    rounded-lg transition-all duration-300
    overflow-hidden
    group
  `}
>
  {/* Text with transition */}
  <span className="relative z-10 transition-all duration-300 group-hover:scale-105">
    {category.name}
  </span>
  
  {/* Active indicator */}
  <span className="
    absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 
    opacity-0 data-[state=active]:opacity-100
    transition-opacity duration-300
    rounded-lg
  " />
  
  {/* Hover effect */}
  <span className="
    absolute bottom-0 left-1/2 h-0.5 w-0 
    bg-primary
    transition-all duration-300
    group-hover:w-4/5 group-hover:left-[10%]
    data-[state=active]:w-4/5 data-[state=active]:left-[10%]
  " />
  
  {/* Glow effect */}
  <span className="
    absolute inset-0 rounded-lg
    shadow-[0_0_8px_transparent]
    group-hover:shadow-[0_0_8px_var(--primary)]
    transition-shadow duration-500
  " />
</TabsTrigger>
              ))}
            </TabsList>

            {categories.map(category => (
              <TabsContent key={category.id} value={category.id.toString()} className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems
                    .filter(item => item.is_available && item.category_id?.toString() === category.id.toString())
                    .map(item => (
                      <FoodCard
                        key={item.item_id}
                        item={item}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Menu;
