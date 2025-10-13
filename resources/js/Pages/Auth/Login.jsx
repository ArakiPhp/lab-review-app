import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>

                {/* Google ログイン追加部分 */}
                <div className="my-6">
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">
                                or
                            </span>
                        </div>
                    </div>

                    <a
                        href={
                            typeof route === 'function'
                                ? route('auth.google')
                                : '/auth/google'
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 533.5 544.3"
                            aria-hidden="true"
                        >
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
            </form>
        </GuestLayout>
    );
}
