import { useForm } from '@inertiajs/react';
import Modal from '../Common/Modal';
import UniversitySubmitButton from './UniversitySubmitButton';
import InputField from '../Common/InputField';

/**
 * 大学作成モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */

const CreateUniversityModal = ({ isOpen, onClose }) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="大学を作成する"
      size='sm'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1">
          <CreateUniversityForm onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * 大学作成フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const CreateUniversityForm = ({ onClose }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    type: 'national',
  });

  const submit = e => {
    e.preventDefault();
    post(route('universities.store'), {
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
          placeholder="大学名（正式名称）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 大学種別ラジオボタン */}
        <div className="mb-4">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="national"
                checked={data.type === 'national'}
                onChange={() => setData('type', 'national')}
                className="mr-1"
                style={{ accentColor: '#297FF0' }}
              />
              国立
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="public"
                checked={data.type === 'public'}
                onChange={() => setData('type', 'public')}
                className="mr-1"
                style={{ accentColor: '#297FF0' }}
              />
              公立
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="private"
                checked={data.type === 'private'}
                onChange={() => setData('type', 'private')}
                className="mr-1"
                style={{ accentColor: '#297FF0' }}
              />
              私立
            </label>
          </div>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="mt-6 flex justify-center">
        <UniversitySubmitButton mode="create" disabled={processing} />
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default CreateUniversityModal;