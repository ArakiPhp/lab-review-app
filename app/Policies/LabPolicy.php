<?php

namespace App\Policies;

use App\Models\User;

class LabPolicy
{
    // ユーザーが研究室を作成できるかどうかを判定
    public function create(User $user)
    {
        // 研究室を作成できるのはログインユーザーのみ
        return $user->exists;
    }
}
