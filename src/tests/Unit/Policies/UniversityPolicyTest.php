<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\UniversityPolicy;
use PHPUnit\Framework\TestCase;

class UniversityPolicyTest extends TestCase
{
    public function test_ログイン済みユーザーは大学を作成できる(): void
    {
        $user = new User();
        $user->exists = true;
        $policy = new UniversityPolicy();

        $this->assertTrue($policy->create($user));
    }

    public function test_未ログインユーザーは大学を作成できない(): void
    {
        $user = new User();
        $user->exists = false;
        $policy = new UniversityPolicy();

        $this->assertFalse($policy->create($user));
    }

    public function test_ログイン済みユーザーは大学を更新できる(): void
    {
        $user = new User();
        $user->exists = true;
        $policy = new UniversityPolicy();

        $this->assertTrue($policy->update($user));
    }

    public function test_未ログインユーザーは大学を更新できない(): void
    {
        $user = new User();
        $user->exists = false;
        $policy = new UniversityPolicy();

        $this->assertFalse($policy->update($user));
    }

    public function test_管理者は大学を削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = true;
        $policy = new UniversityPolicy();

        // Act
        $result = $policy->delete($user);

        // Assert
        $this->assertTrue($result);
    }

    public function test_一般ユーザーは大学を削除できない(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = false;
        $policy = new UniversityPolicy();

        // Act
        $result = $policy->delete($user);

        // Assert
        $this->assertFalse($result);
    }
}
