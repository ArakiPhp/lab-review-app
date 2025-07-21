<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Lab;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request)
    {
        // ポリシーで認可をチェック
        $this->authorize('create', Bookmark::class);

        // バリデーション
        $request->validate([
            'lab_id' => 'required|exists:labs,id',
        ]);

        // 既にブックマークされているか確認
        $existingBookmark = Bookmark::where('user_id', Auth::id())
            ->where('lab_id', $request->input('lab_id'))
            ->exists();

        if ($existingBookmark) {
            return redirect()->route('lab.show', $request->input('lab_id'))
                ->with('error', 'この研究室は既にブックマークされています。');
        }

        // ブックマークの作成
        $bookmark = new Bookmark();
        $bookmark->user_id = Auth::id();
        $bookmark->lab_id = $request->input('lab_id');
        $bookmark->save();

        return redirect()->route('labs.show', $bookmark->lab_id)->with('success', 'ブックマークが保存されました。');
    }

    public function destroy(Bookmark $bookmark)
    {
        // ポリシーで認可をチェック
        $this->authorize('delete', $bookmark);

        // 削除前にIDを保存
        $lab_id = $bookmark->lab_id;

        // ブックマークの削除
        $bookmark->delete();

        return redirect()->route('labs.show', $lab_id)->with('success', 'ブックマークが削除されました。');
    }
}
