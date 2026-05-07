<?php

namespace App\Policies;

use App\Models\User;

class FacultyPolicy
{
    // ユーザーが学部を作成できるかどうかを判定
    public function create(User $user)
    {
        // 学部を作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // ユーザーが学部を更新できるかどうかを判定
    public function update(User $user)
    {
        // 学部を作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // 追加: ユーザーが学部を削除できるかどうかを判定
    public function delete(User $user)
    {
        // 学部を削除できるのは管理者のみ
        return $user->is_admin();
    }
}
