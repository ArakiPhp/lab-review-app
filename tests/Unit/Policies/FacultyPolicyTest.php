<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\FacultyPolicy;
use PHPUnit\Framework\TestCase;

class FacultyPolicyTest extends TestCase
{
    public function test_ログイン済みユーザーは学部を作成できる(): void
    {
        $user = new User();
        $user->exists = true;
        $policy = new FacultyPolicy();

        $this->assertTrue($policy->create($user));
    }

    public function test_未ログインユーザーは学部を作成できない(): void
    {
        $user = new User();
        $user->exists = false;
        $policy = new FacultyPolicy();

        $this->assertFalse($policy->create($user));
    }

    public function test_ログイン済みユーザーは学部を更新できる(): void
    {
        $user = new User();
        $user->exists = true;
        $policy = new FacultyPolicy();

        $this->assertTrue($policy->update($user));
    }

    public function test_未ログインユーザーは学部を更新できない(): void
    {
        $user = new User();
        $user->exists = false;
        $policy = new FacultyPolicy();

        $this->assertFalse($policy->update($user));
    }

    public function test_管理者は学部を削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = true;
        $policy = new FacultyPolicy();

        // Act
        $result = $policy->delete($user);

        // Assert
        $this->assertTrue($result);
    }

    public function test_一般ユーザーは学部を削除できない(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = false;
        $policy = new FacultyPolicy();

        // Act
        $result = $policy->delete($user);

        // Assert
        $this->assertFalse($result);
    }
}
