import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

const FlashToast = () => {
  const { flash } = usePage().props;

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash.success, flash.error]);

  return null; // 描画はsonnerの<Toaster />が担当
};

export default FlashToast;
