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
}
