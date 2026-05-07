import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Modal from '../Common/Modal';
import UserSubmitButton from './UserSubmitButton';
import InputField from '../Common/InputField';

/**
 * ユーザー情報編集モーダル
 * @param {Object} props
 * @param {boolean} props.isOpen - モーダルの開閉状態
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.user - 編集対象のユーザーオブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */
const EditUserModal = ({ isOpen, onClose, user }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ユーザー情報を編集する"
      size='sm'
    >
      <div className="h-[400px] flex flex-col">
        {/* フォーム領域 */}
        <div className="flex-1">
          <EditUserForm onClose={onClose} user={user} />
        </div>
      </div>
    </Modal>
  );
};

/**
 * ユーザー情報編集フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Object} props.user - 編集対象のユーザーオブジェクト
 * @returns {JSX.Element} コンポーネントのJSX
 */
const EditUserForm = ({ onClose, user }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    nickname: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    reset();
    setData({
      nickname: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      password_confirmation: '',
    });
  }, [user]);

  const submit = e => {
    e.preventDefault();
    put(route('mypage.update'), {
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
        {/* ニックネーム */}
        <ErrorSlot message={errors.nickname} />
        <InputField
          type="text"
          value={data.nickname}
          onChange={e => setData('nickname', e.target.value)}
          placeholder="ニックネーム"
          size="sm"
          className="mb-2 w-full"
        />

        {/* メールアドレス */}
        <ErrorSlot message={errors.email} />
        <InputField
          type="email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
          placeholder="メールアドレス"
          size="sm"
          className="mb-2 w-full"
        />

        {/* 新しいパスワード */}
        <ErrorSlot message={errors.password} />
        <InputField
          type="password"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
          placeholder="新しいパスワード（変更する場合のみ）"
          size="sm"
          className="mb-2 w-full"
        />

        {/* パスワード確認 */}
        <ErrorSlot message={errors.password_confirmation} />
        <InputField
          type="password"
          value={data.password_confirmation}
          onChange={e => setData('password_confirmation', e.target.value)}
          placeholder="新しいパスワード（確認用）"
          size="sm"
          className="mb-2 w-full"
        />
      </div>

      {/* 送信ボタン */}
      <div className="mt-6 flex justify-center">
        <UserSubmitButton disabled={processing} />
      </div>
    </form>
  );
};

const ErrorSlot = ({ message }) => (
  <p className="h-5 text-sm leading-5 text-red-500 overflow-hidden">
    {message ?? '\u00A0'}
  </p>
);

export default EditUserModal;
