<?php

namespace Tests\Feature\Controllers;

use App\Models\Bookmark;
use App\Models\Lab;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookmarkControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // store
    // -------------------------

    public function test_認証済みユーザーがブックマークを登録できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->post(route('bookmarks.store'), [
                'lab_id' => $lab->id,
            ]);

        // Assert
        $response->assertRedirect(route('labs.show', $lab));
        $this->assertDatabaseHas('bookmarks', [
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);
    }

    public function test_未認証ユーザーはブックマークを登録できない(): void
    {
        // Arrange
        $lab = Lab::factory()->create();

        // Act
        $response = $this->post(route('bookmarks.store'), [
            'lab_id' => $lab->id,
        ]);

        // Assert
        $response->assertRedirect('/');
    }

    public function test_同じ研究室を重複してブックマークできない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        Bookmark::factory()->create([
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);

        // Act（同じ研究室に再度ブックマーク）
        $response = $this->actingAs($user)
            ->post(route('bookmarks.store'), [
                'lab_id' => $lab->id,
            ]);

        // Assert（エラーメッセージ付きでリダイレクト）
        $response->assertRedirect(route('labs.show', $lab));
        $response->assertSessionHas('error');
        $this->assertDatabaseCount('bookmarks', 1);
    }

    // -------------------------
    // destroy
    // -------------------------

    public function test_自分のブックマークを削除できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $bookmark = Bookmark::factory()->create([
            'user_id' => $user->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('bookmarks.destroy', $bookmark));

        // Assert
        $response->assertRedirect(route('labs.show', $bookmark->lab_id));
        $this->assertDatabaseMissing('bookmarks', [
            'id' => $bookmark->id,
        ]);
    }

    public function test_他人のブックマークは削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $bookmark = Bookmark::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('bookmarks.destroy', $bookmark));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('bookmarks', [
            'id' => $bookmark->id,
        ]);
    }
}
