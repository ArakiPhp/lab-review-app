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
}
