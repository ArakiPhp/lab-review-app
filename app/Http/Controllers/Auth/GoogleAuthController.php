<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\RedirectResponse;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $g = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            Log::error('Google認証エラー: ' . $e->getMessage());
            return redirect()->route('home')->with('error', 'Google認証に失敗しました。もう一度お試しください。');
        }

        // メール一致で既存ユーザーに紐付け（重複防止）
        $user = User::updateOrCreate(
            ['email' => $g->getEmail()],
            [
                'name' => $g->getName() ?: $g->getNickname() ?: 'Google User',
                'google_id' => $g->getId(),
                // 非NULL制約ならダミーPWを入れる（使われない）
                'password' => Hash::make(Str::random(40)),
                'email_verified_at' => now(),
            ]
        );

        Auth::login($user, remember: true);

        return redirect()->intended(route('home'))->with('success', 'Googleアカウントでログインしました。');
    }
}
