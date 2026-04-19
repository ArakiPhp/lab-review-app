<?php

namespace Tests\Unit\Policies;

use App\Models\Bookmark;
use App\Models\User;
use App\Policies\BookmarkPolicy;
use PHPUnit\Framework\TestCase;

class BookmarkPolicyTest extends TestCase
{
    public function test_自分のブックマークは削除できる(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $bookmark = new Bookmark();
        $bookmark->user_id = 1;
        $policy = new BookmarkPolicy();

        // Act
        $result = $policy->delete($user, $bookmark);

        // Assert
        $this->assertTrue($result);
    }

    public function test_他人のブックマークは削除できない(): void
    {
        // Arrange
        $user = new User();
        $user->id = 1;
        $bookmark = new Bookmark();
        $bookmark->user_id = 2;
        $policy = new BookmarkPolicy();

        // Act
        $result = $policy->delete($user, $bookmark);

        // Assert
        $this->assertFalse($result);
    }
}
