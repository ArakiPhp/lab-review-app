<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\FacultyPolicy;
use PHPUnit\Framework\TestCase;

class FacultyPolicyTest extends TestCase
{
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
