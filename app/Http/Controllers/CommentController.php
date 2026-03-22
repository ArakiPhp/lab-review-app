<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Lab;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class CommentController extends Controller
{
    use AuthorizesRequests;

    /**
     * コメントを保存する
     */
    public function store(Request $request, Lab $lab): JsonResponse
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

        return response()->json($comment->load('user'), 201);
    }

    /**
     * コメントを更新する
     */
    public function update(Request $request, Comment $comment): JsonResponse
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

        return response()->json($comment->load('user'));
    }

    /**
    * コメントを削除する
    */
    public function destroy(Comment $comment): JsonResponse
    {
        // ポリシーで認可をチェック
        $this->authorize('delete', $comment);

        // コメントを削除
        $comment->delete();

        return response()->json(['message' => 'コメントが削除されました。']);
    }

    /**
     * コメントの一覧を取得する
     */
    public function index(Lab $lab, Request $request): JsonResponse
    {
        // 取得上限数を定義する
        $limit = min((int) $request->input('limit', 20), 50);
        // カーソル（どこまで進んでいるか）を定義
        $cursor = $request->input('cursor');

        // コメントのクエリを作成
        $query = $lab->comments()
        ->with('user')
        ->latest()
        ->orderBy('id', 'desc');

        // データの開始位置をカーソルで指定
        // 念のため、created_at と id の組み合わせでカーソルを処理
        if ($cursor) {
            $cursorComment = Comment::find($cursor);
            if ($cursorComment) {
                $query->where(function ($q) use ($cursorComment) {
                    $q->where('created_at', '<', $cursorComment->created_at)
                    ->orWhere(function ($q2) use ($cursorComment) {
                        $q2->where('created_at', '=', $cursorComment->created_at)
                            ->where('id', '<', $cursorComment->id);
                    });
                });
            }
        }

        $comments = $query->limit($limit + 1)->get();

        // 次のページがあるかどうかを判定
        $hasMore = $comments->count() > $limit;
        if ($hasMore) {
            $comments = $comments->slice(0, $limit);
        }

        return response()->json([
            'comments' => $comments->values(),
            'hasMore' => $hasMore,
            'nextCursor' => $comments->last()?->id,
        ]);
    }
}
