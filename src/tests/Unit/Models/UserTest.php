<?php

namespace Tests\Unit\Models;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function test_管理者フラグがtrueの場合(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = true;

        // Act
        $result = $user->is_admin();

        // Assert
        $this->assertTrue($result);
    }

    public function test_管理者フラグがfalseの場合(): void
    {
        // Arrange
        $user = new User();
        $user->is_admin = false;

        // Act
        $result = $user->is_admin();

        // Assert
        $this->assertFalse($result);
    }
}
