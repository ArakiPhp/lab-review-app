<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Lab;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Inertia\Inertia;

class CommentController extends Controller
{
    use AuthorizesRequests;

    public function create(Lab $lab)
    {
        // ポリシーで認可をチェック
        $this->authorize('create', Comment::class);
        return Inertia::render('Comment/Create', [
            'lab' => $lab,
        ]);
    }

    public function store(Request $request, Lab $lab)
    {
        // ポリシーで認可をチェック
        $this->authorize('create', Comment::class);

        // バリデーション
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // バリデーション済みのデータを保存
        $comment = new Comment();
        $comment->user_id = FacadesAuth::id();
        $comment->lab_id = $lab->id;
        $comment->content = $validated['content'];
        $comment->save();

        return redirect()->route('labs.show', ['lab' => $lab])->with('success', 'コメントが保存されました。');
    }

    // 追加するメソッド
    public function edit(Comment $comment)
    {
        // ポリシーで認可をチェック
        $this->authorize('update', $comment);
        return Inertia::render('Comment/Edit', [
            'comment' => $comment,
        ]);
    }

    public function update(Request $request, Comment $comment)
    {
        // ポリシーで認可をチェック
        $this->authorize('update', $comment);

        // バリデーション
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        // バリデーション済みのデータを更新
        $comment->content = $validated['content'];
        $comment->save();

        return redirect()->route('labs.show', ['lab' => $comment->lab])->with('success', 'コメントが更新されました。');
    }

    public function destroy(Comment $comment)
    {
        // ポリシーで認可をチェック
        $this->authorize('delete', $comment);

        // コメントを削除
        $comment->delete();

        return redirect()->route('labs.show', ['lab' => $comment->lab])->with('success', 'コメントが削除されました。');
    }
}
