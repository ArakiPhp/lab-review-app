import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import ReviewSubmitButton from './ReviewSubmitButton';
import StarIcon from '@/Components/Lab/Star/StarIcon';
import EditIcon from '@/Assets/icons/edit.svg';
import TrashIcon from '@/Assets/icons/trash.svg';

/**
 * レビュー編集モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.review - 編集するレビューオブジェクト
 * @param {Function} props.onDelete - 削除ボタン押下時のコールバック
 * @returns {JSX.Element} コンポーネントのJSX
 */

const EditReviewModal = ({ isOpen, onClose, review, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const modalTitle = (
    <span className="flex items-center w-full">
      <span className={isEditing ? 'text-[#297FF0] border-b-2 border-[#297FF0]' : ''}>
        {isEditing ? 'レビューを編集する' : 'あなたが投稿済したレビュー'}
      </span>
      <span className="flex items-center gap-2 ml-2">
        {isEditing ? (
          <button 
            type="button" 
            onClick={() => setIsEditing(false)} 
            className="text-[#747D8C] text-sm"
          >
            キャンセル
          </button>
        ) : (
          <>
            <button type="button" onClick={() => setIsEditing(true)} aria-label="編集">
              <img src={EditIcon} alt="編集" className="w-5 h-5" />
            </button>
            <button type="button" onClick={onDelete} aria-label="削除">
              <img src={TrashIcon} alt="削除" className="w-5 h-5" />
            </button>
          </>
        )}
      </span>
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size='sm'
    >
      <div className="h-[300px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1 overflow-y-auto">
          <EditReviewForm onClose={handleClose} review={review} isEditing={isEditing} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * レビュー編集フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.review - 編集するレビューオブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */
const EditReviewForm = ({ onClose, review, isEditing }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    mentorship_style: review?.mentorship_style || 0,
    lab_atmosphere: review?.lab_atmosphere || 0,
    achievement_activity: review?.achievement_activity || 0,
    constraint_level: review?.constraint_level || 0,
    facility_quality: review?.facility_quality || 0,
    work_style: review?.work_style || 0,
    student_balance: review?.student_balance || 0,
  });

  useEffect(() => {
    reset();
    setData({
      mentorship_style: review?.mentorship_style || 0,
      lab_atmosphere: review?.lab_atmosphere || 0,
      achievement_activity: review?.achievement_activity || 0,
      constraint_level: review?.constraint_level || 0,
      facility_quality: review?.facility_quality || 0,
      work_style: review?.work_style || 0,
      student_balance: review?.student_balance || 0,
    });
  }, [review]);

  const handleRatingSelect = (field) => (value) => {
    setData(field, value);
  };

  const submit = e => {
    e.preventDefault();
    put(route('review.update', review.id), {
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

        <StarRatingInput
          label="指導スタイル"
          value={data.mentorship_style}
          error={errors.mentorship_style}
          onChange={handleRatingSelect('mentorship_style')}
          disabled={!isEditing}
        />

        <StarRatingInput
          label="雰囲気・文化"
          value={data.lab_atmosphere}
          error={errors.lab_atmosphere}
          onChange={handleRatingSelect('lab_atmosphere')}
          disabled={!isEditing}
        />

        <StarRatingInput
          label="成果・活動"
          value={data.achievement_activity}
          error={errors.achievement_activity}
          onChange={handleRatingSelect('achievement_activity')}
          disabled={!isEditing}
        />

        <StarRatingInput
          label="拘束度"
          value={data.constraint_level}
          error={errors.constraint_level}
          onChange={handleRatingSelect('constraint_level')}
          disabled={!isEditing}
        />

        <StarRatingInput
          label="設備"
          value={data.facility_quality}
          error={errors.facility_quality}
          onChange={handleRatingSelect('facility_quality')}
          disabled={!isEditing}
        />

        <StarRatingInput
          label="働き方"
          value={data.work_style}
          error={errors.work_style}
          onChange={handleRatingSelect('work_style')}
          disabled={!isEditing}
        />

        <StarRatingInput
          label="人数バランス"
          value={data.student_balance}
          error={errors.student_balance}
          onChange={handleRatingSelect('student_balance')}
          disabled={!isEditing}
        />
      </div>

      {/* 送信ボタン */}
      {isEditing && (
        <div className="mt-6 flex justify-center">
          <ReviewSubmitButton mode="edit" disabled={processing} />
        </div>
      )}
    </form>
  );
};

const StarRatingInput = ({ label, value, onChange, error, disabled = false }) => {
  const [hoverValue, setHoverValue] = useState(0);
  const activeValue = disabled ? value : (hoverValue || value);
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
        onMouseLeave={() => !disabled && setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((starValue) => {
          const isFilled = starValue <= activeValue;
          return (
            <button
              key={starValue}
              type="button"
              role="radio"
              aria-checked={value === starValue}
              disabled={disabled}
              onMouseEnter={() => !disabled && setHoverValue(starValue)}
              onFocus={() => !disabled && setHoverValue(starValue)}
              onBlur={() => !disabled && setHoverValue(0)}
              onClick={() => !disabled && onChange(starValue)}
              className={`p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#33E1ED] ${
                disabled ? 'cursor-default' : 'hover:bg-black/5'
              }`}
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

export default EditReviewModal;