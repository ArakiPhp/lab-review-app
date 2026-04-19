<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Policies\LabPolicy;
use PHPUnit\Framework\TestCase;

class LabPolicyTest extends TestCase
{
    public function test_管理者は研究室を削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = true;
        $policy = new LabPolicy();

        // Act
        $result = $policy->delete($user);

        // Assert
        $this->assertTrue($result);
    }

    public function test_一般ユーザーは研究室を削除できない(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = false;
        $policy = new LabPolicy();

        // Act
        $result = $policy->delete($user);

        // Assert
        $this->assertFalse($result);
    }
}
