<?php

namespace App\Policies;

use App\Models\Lab;
use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    // ユーザーがレビューを作成できるかどうかを判定
    public function create(User $user, Lab $lab)
    {
        // 既にレビューがある場合は作成不可
        return !Review::where('user_id', $user->id)
                    ->where('lab_id', $lab->id)
                    ->exists();
    }

    // ユーザーがレビューを編集できるかどうかを判定
    public function update(User $user, Review $review)
    {
        // 自分が投稿したレビューのみ編集可能
        return $user->id === $review->user_id;
    }

    // ユーザーがレビューを削除できるかどうかを判定
    public function delete(User $user, Review $review)
    {
        // 自分が投稿したレビューのみ削除可能
        return $user->id === $review->user_id;
    }
}
