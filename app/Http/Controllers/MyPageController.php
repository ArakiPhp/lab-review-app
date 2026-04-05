<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\University;
use App\Models\Faculty;
use App\Models\Lab;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;

class MyPageController extends Controller
{
    /**
     * ユーザー情報を表示する
     */
    public function showUser(): Response
    {
        $user = Auth::user();

        // 管理者・一般ユーザー問わず通知を取得
        $notifications = $user->notifications()->latest()->get();

        // ブックマーク済み研究室とそのレビュー情報・総合評価を取得
        $bookmarks = $user->bookmarks()->with(['lab.reviews'])->get()->map(function($bookmark) {
            $lab = $bookmark->lab;
            if (!$lab) return null;

            $lab->appendRatingAverages();
            $lab->load(['faculty.university']);

            return $lab;
        })->filter();

        // ユーザーが作成した大学・学部・研究室を取得
        $universities = University::where('created_by', $user->id)->get();
        $faculties = Faculty::where('created_by', $user->id)->with('university')->get();
        $createdLabs = Lab::where('created_by', $user->id)->with(['faculty.university', 'reviews'])->get()->map(function ($lab) {
            return $lab->appendRatingAverages();
        });

        return Inertia::render('MyPage/Index', [
            'title' => "{$user->name}さんのマイページ",
            'user' => $user,
            'notifications' => $notifications,
            'bookmarks' => $bookmarks,
            'universities' => $universities,
            'faculties' => $faculties,
            'createdLabs' => $createdLabs,
        ]);
    }

    public function editUser(Request $request)
    {
        $user = Auth::user();

        return Inertia::render('MyPage/Edit', [
            'user' => $user,
            'errors' => $request->session()->get('errors'),
        ]);
    }

    /**
     * ユーザー情報を更新
     */
    public function updateUser(Request $request): RedirectResponse
    {
        $rules = [
            'nickname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ];

        if ($request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        $request->validate($rules);

        /** @var User $user */
        $user = Auth::user();
        $user->name = $request->nickname;
        $user->email = $request->email;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('mypage.index')->with('success', 'ユーザー情報を更新しました');
    }

    /**
     * 退会用ページを表示する
     */
    public function showWithdrawal(): Response
    {
        return Inertia::render('MyPage/Withdrawal');
    }

    public function deleteUser()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->delete();

        return redirect()->route('home')->with('success', 'アカウントを削除しました');
    }

    public function showBookmarks()
    {
        /** @var User $user */
        $user = Auth::user();
        $bookmarks = $user->bookmarks()->with('lab')->get();

        return Inertia::render('MyPage/Bookmarks', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function removeBookmark($bookmarksId)
    {
        /** @var User $user */
        $user = Auth::user();
        $bookmark = $user->bookmarks()->findOrFail($bookmarksId);
        $bookmark->delete();

        return redirect()->route('mypage.bookmarks')->with('success', 'ブックマークを削除しました');
    }
}
