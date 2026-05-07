import Modal from "./Modal";
import AlertCancelButton from "./AlertCancelButton";
import AlertActionButton from "./AlertActionButton";

/**
 * アラートモーダルコンポーネント
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる関数
 * @param {string} props.title - アラートのタイトル
 * @param {string} props.message - アラートのメッセージ
 * @param {string} [props.actionLabel='削除する'] - アクションボタンのラベル
 * @param {Function} props.onAction - アクションボタン押下時のコールバック
 * @param {string} [props.cancelLabel='キャンセル'] - キャンセルボタンのラベル
 * @param {boolean} [props.isProcessing=false] - 処理中かどうか
 */
const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  actionLabel = "削除する",
  onAction,
  cancelLabel = "キャンセル",
  isProcessing = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600">{message}</p>

      <div className="mt-6 flex justify-end gap-3">
        <AlertCancelButton
          onClick={onClose}
          disabled={isProcessing}
          label={cancelLabel}
        />

        <AlertActionButton
          onClick={onAction}
          disabled={isProcessing}
          label={actionLabel}
          isProcessing={isProcessing}
        />
      </div>
    </Modal>
  );
};

export default AlertModal;
