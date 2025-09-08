<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;

class CommentPolicy
{
    // ユーザーがコメントを作成できるかどうかを判定
    public function create(User $user)
    {
        // コメントを作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // 追加: ユーザーがコメントを編集できるかどうかを判定
    public function update(User $user, Comment $comment)
    {
        // 自分が投稿したコメントのみ編集可能
        return $user->id === $comment->user_id;
    }

    // 修正: ユーザーがコメントを削除できるかどうかを判定
    public function delete(User $user, Comment $comment)
    {
        // 投稿した本人もしくは管理者のみ削除可能
        return $user->id === $comment->user_id || $user->is_admin();
    }
}
