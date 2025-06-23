
import React, { createContext, useContext, useState, useEffect } from 'react';

export type VipTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface VipStatus {
  points: number;
  tier: VipTier;
  totalSpent: number;
  nextTierPoints: number;
  discountRate: number;
  freeShippingThreshold: number;
  specialOffers: string[];
}

interface VipContextType {
  vipStatus: VipStatus;
  addPoints: (amount: number) => void;
  getVipBenefits: () => string[];
  getTierColor: (tier: VipTier) => string;
}

const VipContext = createContext<VipContextType | undefined>(undefined);

const VIP_TIERS = {
  Bronze: { threshold: 0, discount: 0, freeShipping: 500000, nextTier: 1000000 },
  Silver: { threshold: 1000000, discount: 5, freeShipping: 300000, nextTier: 3000000 },
  Gold: { threshold: 3000000, discount: 10, freeShipping: 200000, nextTier: 7000000 },
  Platinum: { threshold: 7000000, discount: 15, freeShipping: 0, nextTier: 15000000 },
  Diamond: { threshold: 15000000, discount: 20, freeShipping: 0, nextTier: Infinity },
};

const calculateTier = (totalSpent: number): VipTier => {
  if (totalSpent >= VIP_TIERS.Diamond.threshold) return 'Diamond';
  if (totalSpent >= VIP_TIERS.Platinum.threshold) return 'Platinum';
  if (totalSpent >= VIP_TIERS.Gold.threshold) return 'Gold';
  if (totalSpent >= VIP_TIERS.Silver.threshold) return 'Silver';
  return 'Bronze';
};

const getSpecialOffers = (tier: VipTier): string[] => {
  const offers = {
    Bronze: ['Miễn phí giao hàng cho đơn từ 500k'],
    Silver: ['Giảm 5% tất cả đơn hàng', 'Miễn phí giao hàng từ 300k', 'Ưu tiên đặt bàn'],
    Gold: ['Giảm 10% tất cả đơn hàng', 'Miễn phí giao hàng từ 200k', 'Món tráng miệng miễn phí', 'Đặt bàn VIP'],
    Platinum: ['Giảm 15% tất cả đơn hàng', 'Miễn phí giao hàng', 'Món khai vị + tráng miệng miễn phí', 'Phòng riêng VIP'],
    Diamond: ['Giảm 20% tất cả đơn hàng', 'Miễn phí giao hàng', 'Set menu đặc biệt', 'Butler service', 'Event độc quyền'],
  };
  return offers[tier] || [];
};

export const VipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vipStatus, setVipStatus] = useState<VipStatus>(() => {
    const saved = localStorage.getItem('vipStatus');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      points: 0,
      tier: 'Bronze' as VipTier,
      totalSpent: 0,
      nextTierPoints: VIP_TIERS.Silver.threshold,
      discountRate: 0,
      freeShippingThreshold: VIP_TIERS.Bronze.freeShipping,
      specialOffers: getSpecialOffers('Bronze'),
    };
  });

  useEffect(() => {
    localStorage.setItem('vipStatus', JSON.stringify(vipStatus));
  }, [vipStatus]);

  const addPoints = (amount: number) => {
    setVipStatus(prev => {
      const newTotalSpent = prev.totalSpent + amount;
      const points = Math.floor(amount / 1000); // 1 điểm cho mỗi 1000đ
      const newPoints = prev.points + points;
      const newTier = calculateTier(newTotalSpent);
      const tierInfo = VIP_TIERS[newTier];
      
      return {
        points: newPoints,
        tier: newTier,
        totalSpent: newTotalSpent,
        nextTierPoints: tierInfo.nextTier,
        discountRate: tierInfo.discount,
        freeShippingThreshold: tierInfo.freeShipping,
        specialOffers: getSpecialOffers(newTier),
      };
    });
  };

  const getVipBenefits = (): string[] => {
    return getSpecialOffers(vipStatus.tier);
  };

  const getTierColor = (tier: VipTier): string => {
    const colors = {
      Bronze: 'text-orange-600 bg-orange-100',
      Silver: 'text-gray-600 bg-gray-100',
      Gold: 'text-yellow-600 bg-yellow-100',
      Platinum: 'text-purple-600 bg-purple-100',
      Diamond: 'text-blue-600 bg-blue-100',
    };
    return colors[tier];
  };

  return (
    <VipContext.Provider value={{ vipStatus, addPoints, getVipBenefits, getTierColor }}>
      {children}
    </VipContext.Provider>
  );
};

export const useVip = () => {
  const context = useContext(VipContext);
  if (context === undefined) {
    throw new Error('useVip must be used within a VipProvider');
  }
  return context;
};
