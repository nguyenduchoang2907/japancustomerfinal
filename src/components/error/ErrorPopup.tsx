
import { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const ErrorPopup = ({ isOpen, onClose, title = "エラー", message }: ErrorPopupProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="japanese-card border-red-500/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 japanese-title text-red-600">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            {title}
          </DialogTitle>
          <DialogDescription className="japanese-text text-japanese-sumi">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            onClick={onClose}
            className="zen-button bg-red-600 hover:bg-red-700"
          >
            <span className="relative z-10">閉じる</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorPopup;
