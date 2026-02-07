import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import Modal from '../Common/Modal';
import ReviewSubmitButton from './ReviewSubmitButton';
import StarIcon from '@/Components/Lab/Star/StarIcon';

/**
 * レビュー作成モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.lab - 研究室オブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */

const CreateReviewModal = ({ isOpen, onClose, lab }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="レビューを作成する"
      size='sm'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1 overflow-y-auto">
          <CreateReviewForm onClose={onClose} lab={lab} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * レビュー作成フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.lab - 研究室オブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */
const CreateReviewForm = ({ onClose, lab }) => {
  const { data, setData, post, processing, errors, reset } = useForm({
    mentorship_style: 0,
    lab_atmosphere: 0,
    achievement_activity: 0,
    constraint_level: 0,
    facility_quality: 0,
    work_style: 0,
    student_balance: 0,
  });

  const handleRatingSelect = (field) => (value) => {
    setData(field, value);
  };

  const submit = e => {
    e.preventDefault();
    post(route('review.store', lab.id), {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit} className="h-full flex flex-col">
      <div className="flex-1">
        {/* 入力欄 */}

        <StarRatingInput
          label="指導スタイル"
          value={data.mentorship_style}
          error={errors.mentorship_style}
          onChange={handleRatingSelect('mentorship_style')}
        />

        <StarRatingInput
          label="雰囲気・文化"
          value={data.lab_atmosphere}
          error={errors.lab_atmosphere}
          onChange={handleRatingSelect('lab_atmosphere')}
        />

        <StarRatingInput
          label="成果・活動"
          value={data.achievement_activity}
          error={errors.achievement_activity}
          onChange={handleRatingSelect('achievement_activity')}
        />

        <StarRatingInput
          label="拘束度"
          value={data.constraint_level}
          error={errors.constraint_level}
          onChange={handleRatingSelect('constraint_level')}
        />

        <StarRatingInput
          label="設備"
          value={data.facility_quality}
          error={errors.facility_quality}
          onChange={handleRatingSelect('facility_quality')}
        />

        <StarRatingInput
          label="働き方"
          value={data.work_style}
          error={errors.work_style}
          onChange={handleRatingSelect('work_style')}
        />

        <StarRatingInput
          label="人数バランス"
          value={data.student_balance}
          error={errors.student_balance}
          onChange={handleRatingSelect('student_balance')}
        />
      </div>

      {/* 送信ボタン */}
      <div className="mt-6 flex justify-center">
        <ReviewSubmitButton mode="create" disabled={processing} />
      </div>
    </form>
  );
};

const StarRatingInput = ({ label, value, onChange, error }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const activeValue = hoverValue || value;
  const inputId = `star-rating-${label}`;

  return (
    <div className="mb-4">
      <div className="flex items-baseline">
        <label id={inputId} className="text-sm font-medium text-black">
          {label}
        </label>
      </div>

      <ErrorSlot message={error} />

      <div
        role="radiogroup"
        aria-labelledby={inputId}
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeValue;
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              onMouseEnter={() => setHoverValue(starValue)}
              onFocus={() => setHoverValue(starValue)}
              onBlur={() => setHoverValue(0)}
              onClick={() => onChange(starValue)}
              className="p-1 rounded hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#33E1ED]"
            >
              <StarIcon size={24} fillPercentage={isFilled ? 100 : 0} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default CreateReviewModal;