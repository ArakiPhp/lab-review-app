<?php

namespace App\Policies;

use App\Models\User;

class UniversityPolicy
{
    // ユーザーが大学を作成できるかどうかを判定
    public function create(User $user)
    {
        // 大学を作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // 追加: ユーザーが大学を更新できるかどうかを判定
    public function update(User $user)
    {
        // 大学を更新できるのはログインユーザーのみ
        return $user->exists;
    }
}
