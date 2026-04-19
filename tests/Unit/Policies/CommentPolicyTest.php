<?php

namespace Tests\Unit\Policies;

use App\Models\Comment;
use App\Models\User;
use App\Policies\CommentPolicy;
use PHPUnit\Framework\TestCase;

class CommentPolicyTest extends TestCase
{
    public function test_自分のコメントは編集できる(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $comment = new Comment();
        $comment->user_id = 1;
        $policy = new CommentPolicy();

        // Act
        $result = $policy->update($user, $comment);

        // Assert
        $this->assertTrue($result);
    }

    public function test_他人のコメントは編集できない(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $comment = new Comment();
        $comment->user_id = 2;
        $policy = new CommentPolicy();

        // Act
        $result = $policy->update($user, $comment);

        // Assert
        $this->assertFalse($result);
    }

    public function test_自分のコメントは削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $user->is_admin = false;
        $comment = new Comment();
        $comment->user_id = 1;
        $policy = new CommentPolicy();

        // Act
        $result = $policy->delete($user, $comment);

        // Assert
        $this->assertTrue($result);
    }

    public function test_管理者は他人のコメントを削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $user->is_admin = true;
        $comment = new Comment();
        $comment->user_id = 2;
        $policy = new CommentPolicy();

        // Act
        $result = $policy->delete($user, $comment);

        // Assert
        $this->assertTrue($result);
    }

    public function test_一般ユーザーは他人のコメントを削除できない(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $user->is_admin = false;
        $comment = new Comment();
        $comment->user_id = 2;
        $policy = new CommentPolicy();

        // Act
        $result = $policy->delete($user, $comment);

        // Assert
        $this->assertFalse($result);
    }
}
