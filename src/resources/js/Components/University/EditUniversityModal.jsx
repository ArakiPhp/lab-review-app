import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Modal from '../Common/Modal';
import UniversitySubmitButton from './UniversitySubmitButton';
import InputField from '../Common/InputField';
import TextareaField from '../Common/TextareaField';

/**
 * 大学編集モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.university - 編集対象の大学オブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */

const EditUniversityModal = ({ isOpen, onClose, university }) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="大学を編集する"
      size='sm'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1">
          <EditUniversityForm onClose={onClose} university={university} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * 大学編集フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const EditUniversityForm = ({ onClose, university }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: university?.name ?? '',
    type: university?.type ?? 'national',
    comment: '',
    version: university?.version ?? 1,
  });

  useEffect(() => {
    reset();
    setData({
      name: university?.name ?? '',
      type: university?.type ?? 'national',
      comment: '',
      version: university?.version ?? 1,
    })
  }, [university]);

  const submit = e => {
    e.preventDefault();
    put(route('universities.update', university.id), {
      onSuccess: () => {
        reset();
        onClose();
      },
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
        <UniversitySubmitButton mode="edit" disabled={processing} />
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default EditUniversityModal;