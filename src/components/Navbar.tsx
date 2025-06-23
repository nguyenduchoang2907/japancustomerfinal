import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, Home, Menu as MenuIcon, FileText, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "@/components/NotificationBell";
import UserProfile from "@/pages/profile/UserProfile";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const { t } = useLanguage();
  
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const cart = JSON.parse(savedCart);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const count = cart.reduce((total: number, item: any) => total + item.quantity, 0);
          setCartItemsCount(count);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }
    };
    
    updateCartCount();
    
    const handleStorageChange = () => updateCartCount();
    window.addEventListener("storage", handleStorageChange);
    
    const handleCustomStorageChange = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCustomStorageChange);
    
    const interval = setInterval(updateCartCount, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCustomStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="washi-paper shadow-japanese sticky top-0 z-50 border-b-2 border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <span className="text-primary font-bold text-3xl font-japanese-serif tracking-wide group-hover:animate-float">
                  🌸 桜
                </span>
                <span className="ml-2 text-japanese-sumi font-medium text-xl font-japanese">
                  Sakura
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link to="/" className="px-4 py-2 text-japanese-sumi hover:text-primary rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:bg-primary/5">
              <Home size={18} />
              <span className="font-japanese">{t('home')}</span>
            </Link>
            <Link to="/menu" className="px-4 py-2 text-japanese-sumi hover:text-primary rounded-md font-medium font-japanese transition-all duration-300 hover:bg-primary/5">
              {t('menu')}
            </Link>
            <Link to="/reservation" className="px-4 py-2 text-japanese-sumi hover:text-primary rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:bg-primary/5">
              <Calendar size={18} />
              <span className="font-japanese">{t('reservation')}</span>
            </Link>
            <Link to="/coupons" className="px-4 py-2 text-japanese-sumi hover:text-primary rounded-md font-medium font-japanese transition-all duration-300 hover:bg-primary/5">
              {t('coupons')}
            </Link>
            <Link to="/vip" className="px-4 py-2 text-japanese-sumi hover:text-primary rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:bg-primary/5">
              <Crown size={18} />
              <span className="font-japanese">{t('vip')}</span>
            </Link>
            <Link to="/orders" className="px-4 py-2 text-japanese-sumi hover:text-primary rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:bg-primary/5">
              <FileText size={18} />
              <span className="font-japanese">{t('orders')}</span>
            </Link>
            
            <div className="flex items-center space-x-2 ml-4">
              <LanguageSwitcher />
              <NotificationBell />
              <UserProfile />
              
              <Link to="/checkout" className="relative">
                <Button className="zen-button flex items-center gap-2 px-4 py-2 font-japanese">
                  <ShoppingCart size={18} />
                  <span>{t('cart')}</span>
                </Button>
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-japanese-vermillion text-white text-xs min-w-[22px] h-6 flex items-center justify-center rounded-full font-bold shadow-japanese">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <NotificationBell />
            <UserProfile />
            
            <Link to="/checkout" className="relative">
              <Button size="icon" className="zen-button">
                <ShoppingCart size={18} />
              </Button>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-japanese-vermillion text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-japanese-sumi hover:text-primary hover:bg-primary/5 transition-all duration-300"
              aria-expanded="false"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden washi-paper border-t border-primary/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('home')}
            </Link>
            <Link to="/menu" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('menu')}
            </Link>
            <Link to="/reservation" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('reservation')}
            </Link>
            <Link to="/coupons" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('coupons')}
            </Link>
            <Link to="/vip" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('vip')}
            </Link>
            <Link to="/orders" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('orders')}
            </Link>
            <Link to="/checkout" 
              className="block px-3 py-3 text-japanese-sumi hover:text-primary font-medium font-japanese transition-all duration-300 hover:bg-primary/5 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              {t('cart')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
