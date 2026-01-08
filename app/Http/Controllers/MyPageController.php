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

        // ブックマーク済み研究室とそのレビュー情報・総合評価を取得
        $bookmarks = $user->bookmarks()->with(['lab.reviews'])->get()->map(function($bookmark) {
            $lab = $bookmark->lab;
            if (!$lab) return null;

            // 評価項目
            $ratingColumns = [
                'mentorship_style',
                'lab_atmosphere',
                'achievement_activity',
                'constraint_level',
                'facility_quality',
                'work_style',
                'student_balance',
            ];
            // 各項目の平均値
            $averagePerItem = collect($ratingColumns)->mapWithKeys(function ($column) use ($lab) {
                return [$column => $lab->reviews->avg($column)];
            });
            // 総合評価値
            $overallAverage = $averagePerItem->avg();

            $lab->overall_avg = $overallAverage;
            foreach ($ratingColumns as $column) {
                $lab->{"avg_{$column}"} = $averagePerItem[$column];
            }
            // reviews_countも追加
            $lab->reviews_count = $lab->reviews->count();

            // 大学・学部名も追加
            $lab->load(['faculty.university']);

            return $lab;
        })->filter();

        return Inertia::render('MyPage/Index', [
            'title' => "{$user->name}さんのマイページ",
            'user' => $user,
            'notifications' => $notifications,
            'bookmarks' => $bookmarks,
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
