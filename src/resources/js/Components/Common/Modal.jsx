import { useEffect, useCallback } from "react";

/**
 * 汎用モーダルコンポーネント
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる関数
 * @param {React.ReactNode} props.children - モーダル内のコンテンツ
 * @param {string} [props.title] - モーダルのタイトル（オプション）
 * @param {string} [props.size='md'] - モーダルのサイズ ('sm' | 'md' | 'lg')
 */

const Modal = ({ isOpen, onClose, children, title, size = 'md' }) => {
  // Escキーでモーダルを閉じる
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && isOpen) onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.classList.add('overflow-hidden');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, handleEscape]);

  // サイズに応じたクラス名
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <>
      {/* オーバーレイ */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 transition-opacity duration-300 z-50
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      />

      {/* 本体 */}
      <div
       role="dialog"
       aria-modal="true"
       aria-activedescendant={title ? 'modal-title' : undefined}
       className={`
          fixed inset-0 z-[60] flex items-center justify-center p-4
          transition-all duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      >
        <div
         className={`
            w-full ${sizeClasses[size]}
            bg-[#EEF7FB] rounded-lg shadow-xl
            transform transition-all duration-300
            ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-4'}
          `}
        >

          {/* 閉じるボタン */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 text-[#747D8C] hover:opacity-80 transition"
            aria-label="閉じる"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* タイトル */}
          {title && (
            <div className="px-6 pt-5 pb-0">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            </div>
          )}

          {/* コンテンツ */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;