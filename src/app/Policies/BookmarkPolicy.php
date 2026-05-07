<?php

namespace App\Policies;

use App\Models\Bookmark;
use App\Models\User;

class BookmarkPolicy
{
    // ユーザーがブックマークを作成できるかどうかを判定
    public function create(User $user)
    {
        // ブックマークを作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // ユーザーがブックマークを削除できるかどうかを判定
    public function delete(User $user, Bookmark $bookmark)
    {
        // 自分が作成したブックマークのみ削除可能
        return $user->id === $bookmark->user_id;
    }
}
