import { useForm } from '@inertiajs/react';
import Modal from '../Common/Modal';
import FieldBar from '../Common/FieldBar';
import AuthSubmitButton from './AuthSubmitButton';

/**
 * 認証モーダル
 * @param {Object} props
 * @param {string|null} props.mode - 'login' | 'register' | null
 * @param {Function} props.onClose - モーダルを閉じる
 * @param {Function} props.onSwitchMode - モード切り替え
 * @returns {JSX.Element} コンポーネントのJSX
 */
const AuthModal = ({ mode, onClose, switchMode }) => {
  const isOpen = mode === 'login' || mode === 'register';
  const isLoginMode = mode === 'login';
  const isRegisterMode = mode === 'register';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isLoginMode ? 'ログイン' : isRegisterMode ? '新規登録' : ''}
      size="sm"
    >
      {/* タブ切り替え */}
      <div className="flex border-b mb-6">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            isLoginMode
              ? 'text-[#297FF0] border-b-2 border-[#297FF0]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ログイン
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            isRegisterMode
              ? 'text-[#297FF0] border-b-2 border-[#297FF0]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          新規登録
        </button>
      </div>

      {/* ログインフォーム */}
      {isLoginMode && <LoginForm onClose={onClose} />}

      {/* 新規登録フォーム */}
      {isRegisterMode && <RegisterForm onClose={onClose} />}
    </Modal>
  );
};

/**
 * ログインフォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const LoginForm = ({ onClose }) => {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = e => {
    e.preventDefault();
    post(route('login'), {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit}>
      {/* 入力欄 */}
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <FieldBar className="mb-4">
        <input
          type="email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
          placeholder="メールアドレス"
          className="w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </FieldBar>
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      <FieldBar className="mb-4">
        <input
          type="password"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
          placeholder="パスワード"
          className="w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </FieldBar>

      {/* Google ログイン追加部分 */}
      <div className="my-6">
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: '#747D8C' }} />
            </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#EEF5F9] px-2 text-[#747D8C]">または</span>
          </div>
        </div>

        <a
           href={typeof route === 'function' ? route('auth.google') : '/auth/google'}
           className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-[#E2EDF6] transition"
        >
          <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden="true">
            <path
              fill="#4285f4"
              d="M533.5 278.4c0-18.5-1.7-36.3-4.9-53.5H272.1v101h146.9c-6.3 34.1-25.6 62.9-54.6 82.2v68h88.2c51.6-47.5 80.9-117.6 80.9-197.7z"
            />
            <path
              fill="#34a853"
              d="M272.1 544.3c73.3 0 134.9-24.2 179.9-65.2l-88.2-68c-24.5 16.5-55.9 26.1-91.7 26.1-70.6 0-130.4-47.6-151.8-111.6H30.8v70.2c44.8 88.8 136.6 148.5 241.3 148.5z"
            />
            <path
              fill="#fbbc05"
              d="M120.3 325.6c-10.1-30.1-10.1-62.7 0-92.8v-70.2H30.8c-41.4 82.8-41.4 180.5 0 263.3l89.5-70.3z"
            />
            <path
              fill="#ea4335"
              d="M272.1 106.3c38.8-.6 76.1 13.7 104.5 39.9l78.1-78.1C407 .8 343-18.1 272.1 18.4 167.4 18.4 75.6 78.2 30.8 167l89.5 70.2c21.4-64 81.1-110.9 151.8-110.9z"
            />
          </svg>
          <span>Googleでログイン</span>
        </a>
      </div>

      {/* 送信ボタン */}
      <div className="mt-6">
        <AuthSubmitButton mode="login" disabled={processing} />
      </div>
    </form>
  );
};

/**
 * 新規登録フォーム
 * @param {Object} props
 * @param {Function} props.onClose - モーダルを閉じる
 * @returns {JSX.Element} コンポーネントのJSX
 */
const RegisterForm = ({ onClose }) => {
  const { data, setData, post, processing, errors } = useForm({
    nickname: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = e => {
    e.preventDefault();
    post(route('register'), {
      onSuccess: () => onClose(),
      preserveScroll: true,
    });
  };

  return (
    <form onSubmit={submit}>
      {errors.nickname && <p className="text-red-500 text-sm">{errors.nickname}</p>}
      <FieldBar className="mb-4">
        {/* 入力欄 */}
        <input
          type="text"
          value={data.nickname}
          onChange={e => setData('nickname', e.target.value)}
          placeholder="ニックネーム"
          className="w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </FieldBar>
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <FieldBar className="mb-4">
        <input
          type="email"
          value={data.email}
          onChange={e => setData('email', e.target.value)}
          placeholder="メールアドレス"
          className="w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </FieldBar>
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      <FieldBar className="mb-4">
        <input
          type="password"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
          placeholder="パスワード"
          className="w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </FieldBar>
      {errors.password_confirmation && (
        <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
      )}
      <FieldBar className="mb-4">
        <input
          type="password"
          value={data.password_confirmation}
          onChange={e => setData('password_confirmation', e.target.value)}
          placeholder="パスワード（確認用）"
          className="w-full outline-none bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </FieldBar>

      {/* Google ログイン追加部分 */}
      <div className="my-6">
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" style={{ borderColor: '#747D8C' }} />
            </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#EEF5F9] px-2 text-[#747D8C]">または</span>
          </div>
        </div>

        <a
           href={typeof route === 'function' ? route('auth.google') : '/auth/google'}
           className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-[#E2EDF6] transition"
        >
          <svg width="18" height="18" viewBox="0 0 533.5 544.3" aria-hidden="true">
            <path
              fill="#4285f4"
              d="M533.5 278.4c0-18.5-1.7-36.3-4.9-53.5H272.1v101h146.9c-6.3 34.1-25.6 62.9-54.6 82.2v68h88.2c51.6-47.5 80.9-117.6 80.9-197.7z"
            />
            <path
              fill="#34a853"
              d="M272.1 544.3c73.3 0 134.9-24.2 179.9-65.2l-88.2-68c-24.5 16.5-55.9 26.1-91.7 26.1-70.6 0-130.4-47.6-151.8-111.6H30.8v70.2c44.8 88.8 136.6 148.5 241.3 148.5z"
            />
            <path
              fill="#fbbc05"
              d="M120.3 325.6c-10.1-30.1-10.1-62.7 0-92.8v-70.2H30.8c-41.4 82.8-41.4 180.5 0 263.3l89.5-70.3z"
            />
            <path
              fill="#ea4335"
              d="M272.1 106.3c38.8-.6 76.1 13.7 104.5 39.9l78.1-78.1C407 .8 343-18.1 272.1 18.4 167.4 18.4 75.6 78.2 30.8 167l89.5 70.2c21.4-64 81.1-110.9 151.8-110.9z"
            />
          </svg>
          <span>Googleでログイン</span>
        </a>
      </div>

      {/* 送信ボタン */}
      <div className="mt-6">
        <AuthSubmitButton mode="register" disabled={processing} />
      </div>
    </form>
  );
};

export default AuthModal;
