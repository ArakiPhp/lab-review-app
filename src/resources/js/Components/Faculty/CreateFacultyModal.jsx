import { useForm } from '@inertiajs/react';
import Modal from '../Common/Modal';
import FacultySubmitButton from './FacultySubmitButton';
import InputField from '../Common/InputField';

/**
 * 学部作成モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.university - 学部が所属する大学オブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */

const CreateFacultyModal = ({ isOpen, onClose, university }) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="学部を作成する"
      size='sm'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1">
          <CreateFacultyForm onClose={onClose} university={university} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * 学部作成フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const CreateFacultyForm = ({ onClose, university }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const submit = e => {
    e.preventDefault();
    post(route('faculties.store', university.id), {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit} className="h-full flex flex-col">
      <div className="flex-1">
        {/* 入力欄 */}
        <ErrorSlot message={errors.name} />
        <InputField
          type="text"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          placeholder="学部名（正式名称）"
          size="sm"
          className="mb-2 w-full"
        />
      </div>

      {/* 送信ボタン */}
      <div className="mt-6 flex justify-center">
        <FacultySubmitButton mode="create" disabled={processing} />
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default CreateFacultyModal;