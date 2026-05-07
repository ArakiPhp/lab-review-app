import { useForm } from '@inertiajs/react';
import Modal from '../Common/Modal';
import LabSubmitButton from './LabSubmitButton';
import InputField from '../Common/InputField';
import TextareaField from '../Common/TextareaField';

/**
 * 研究室作成モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.faculty - 研究室が所属する学部オブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */

const CreateLabModal = ({ isOpen, onClose, faculty }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="研究室を作成する"
      size='lg'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1 overflow-y-auto">
          <CreateLabForm onClose={onClose} faculty={faculty} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * 研究室作成フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const CreateLabForm = ({ onClose, faculty }) => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    url: '',
    professor_name: '',
    professor_url: '',
    gender_ratio_male: 5,
    gender_ratio_female: 5,
  });

  const submit = e => {
    e.preventDefault();
    post(route('labs.store', faculty.id), {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit} className="h-full flex flex-col">
      <div className="flex-1">
        {/* 入力欄 */}

        {/* 研究室名 */}
        <ErrorSlot message={errors.name} />
        <InputField
          type="text"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          placeholder="研究室名（正式名称）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 説明 */}
        <ErrorSlot message={errors.description} />
        <TextareaField
          value={data.description}
          onChange={e => setData('description', e.target.value)}
          placeholder="研究室の簡単な説明を入力してください（任意）"
          size="sm"
          rows={4}
          className="w-full"
        />

        {/* URL */}
        <ErrorSlot message={errors.url} />
        <InputField
          type="text"
          value={data.url}
          onChange={e => setData('url', e.target.value)}
          placeholder="研究室のURL（任意）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 教授名 */}
        <ErrorSlot message={errors.professor_name} />
        <InputField
          type="text"
          value={data.professor_name}
          onChange={e => setData('professor_name', e.target.value)}
          placeholder="教授名（任意）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 教授URL */}
        <ErrorSlot message={errors.professor_url} />
        <InputField
          type="text"
          value={data.professor_url}
          onChange={e => setData('professor_url', e.target.value)}
          placeholder="教授のURL（任意）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 男女比 */}
        <ErrorSlot message={errors.gender_ratio_male || errors.gender_ratio_female} />
        <div className="mb-2">
          <div className="flex h-8 w-full overflow-hidden rounded">
            <div
              className="flex h-full items-center justify-center text-center text-white whitespace-nowrap transition-[flex-basis] duration-300 ease-out"
              style={{ backgroundColor: '#7BB3CE', flexBasis: `${data.gender_ratio_male * 10}%` }}
            >
              {data.gender_ratio_male > 0 ? `男 ${data.gender_ratio_male}` : ''}
            </div>
            <div
              className="flex h-full items-center justify-center text-center text-white whitespace-nowrap transition-[flex-basis] duration-300 ease-out"
              style={{ backgroundColor: '#E89EB9', flexBasis: `${data.gender_ratio_female * 10}%` }}
            >
              {data.gender_ratio_female > 0 ? `女 ${data.gender_ratio_female}` : ''}
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={data.gender_ratio_male}
            onChange={e => {
              const male = parseInt(e.target.value, 10);
              const female = 10 - male;
              setData('gender_ratio_male', male);
              setData('gender_ratio_female', female);
            }}
            className="mt-2 w-full"
          />
        </div>
      </div>

      {/* 送信ボタン */}
      <div className="mt-6 flex justify-center">
        <LabSubmitButton mode="create" disabled={processing} />
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default CreateLabModal;