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

    // ユーザーが研究室を更新できるかどうかを判定
    public function update(User $user)
    {
        // 研究室を作成できるのはログインユーザーのみ
        return $user->exists;
    }

    // ユーザーが研究室を削除できるかどうかを判定
    public function delete(User $user)
    {
        // 研究室を削除できるのは管理者のみ
        return $user->is_admin();
    }
}
