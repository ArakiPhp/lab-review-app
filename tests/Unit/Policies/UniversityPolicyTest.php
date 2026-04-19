<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\UniversityPolicy;
use PHPUnit\Framework\TestCase;

class UniversityPolicyTest extends TestCase
{
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
