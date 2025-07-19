<?php

namespace App\Policies;

use App\Models\User;

class CommentPolicy
{
    // ユーザーが研究室を作成できるかどうかを判定
    public function create(User $user)
    {
        // 研究室を作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // ユーザーがコメントを編集できるかどうかを判定
    public function update(User $user, $comment)
    {
        // 自分が投稿したコメントのみ編集可能
        return $user->id === $comment->user_id;
    }

    // ユーザーがコメントを削除できるかどうかを判定
    public function delete(User $user, $comment)
    {
        // 自分が投稿したコメントのみ削除可能
        return $user->id === $comment->user_id;
    }
}
