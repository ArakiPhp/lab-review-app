import { useForm } from '@inertiajs/react';
import Modal from '../Common/Modal';
import FacultySubmitButton from './FacultySubmitButton';
import InputField from '../Common/InputField';
import TextareaField from '../Common/TextareaField';

/**
 * 学部編集モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.faculty - 編集対象の学部オブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */

const EditFacultyModal = ({ isOpen, onClose, faculty }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="学部を編集する"
      size='sm'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1">
          <EditFacultyForm onClose={onClose} faculty={faculty} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * 学部編集フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const EditFacultyForm = ({ onClose, faculty }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: faculty?.name ?? '',
    comment: '',
    version: faculty?.version ?? 1,
  });

  const submit = e => {
    e.preventDefault();
    put(route('faculty.update', faculty.id), {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit} className="h-full flex flex-col">
      <div className="flex-1">
        {/* 入力欄 */}
        <ErrorSlot message={errors.name} />

        {/* 大学名 */}
        <InputField
          type="text"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          placeholder="大学名（正式名称）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 編集理由 */}
        <ErrorSlot message={errors.comment} />
        <TextareaField
          value={data.comment}
          onChange={e => setData('comment', e.target.value)}
          placeholder="編集理由を入力してください"
          size="sm"
          rows={4}
          className="w-full"
        />
      </div>

      {/* 送信ボタン */}
      <div className="mt-6 flex justify-center">
        <FacultySubmitButton mode="edit" disabled={processing} />
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default EditFacultyModal;