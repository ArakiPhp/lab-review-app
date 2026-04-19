<?php

namespace Tests\Unit\Policies;

use App\Models\User;
use App\Models\Review;
use App\Policies\ReviewPolicy;
use PHPUnit\Framework\TestCase;

class ReviewPolicyTest extends TestCase
{
    public function test_自分のレビューは編集できる(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $review = new Review();
        $review->user_id = 1;
        $policy = new ReviewPolicy();

        // Act
        $result = $policy->update($user, $review);

        // Assert
        $this->assertTrue($result);
    }

    public function test_他人のレビューは編集できない(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $review = new Review();
        $review->user_id = 2;
        $policy = new ReviewPolicy();

        // Act
        $result = $policy->update($user, $review);

        // Assert
        $this->assertFalse($result);
    }

    public function test_自分のレビューは削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $review = new Review();
        $review->user_id = 1;
        $policy = new ReviewPolicy();

        // Act
        $result = $policy->delete($user, $review);

        // Assert
        $this->assertTrue($result);
    }

    public function test_他人のレビューは削除できない(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $review = new Review();
        $review->user_id = 2;
        $policy = new ReviewPolicy();

        // Act
        $result = $policy->delete($user, $review);

        // Assert
        $this->assertFalse($result);
    }
}