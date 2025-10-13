<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            $g = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            return redirect()->route('login')->with('status', 'Google認証に失敗しました。もう一度お試しください。');
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

        return redirect()->intended(route('labs.home'));
    }
}
