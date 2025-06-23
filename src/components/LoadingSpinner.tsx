
import { useEffect, useState } from 'react';

const LoadingSpinner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-japanese-washi/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative">
        {/* Cherry blossom spinner với animation chậm hơn */}
        <div className="animate-spin-slow rounded-full h-16 w-16 border-4 border-japanese-sakura/30 border-t-japanese-sakura">
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse-gentle">🌸</span>
        </div>
        <div className="mt-4 text-center">
          <p className="japanese-text text-japanese-sumi font-medium">読み込み中...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
