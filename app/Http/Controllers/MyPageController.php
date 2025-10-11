<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyPageController extends Controller
{
    public function showUser()
    {
        $user = Auth::user();

        // 管理者・一般ユーザー問わず通知を取得
        $notifications = $user->notifications()->latest()->get();

        return Inertia::render('MyPage/Index', [
            'user' => $user,
            'notifications' => $notifications,
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

    public function updateUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . Auth::id(),
        ]);

        /** @var User $user */
        $user = Auth::user();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return redirect()->route('mypage.index')->with('success', 'ユーザー情報を更新しました');
    }

    public function deleteUser()
    {
        /** @var User $user */
        $user = Auth::user();
        $user->delete();

        return redirect()->route('labs.home')->with('success', 'アカウントを削除しました');
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
