<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Comment;
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // destroyUniversity
    // -------------------------

    public function test_管理者は大学を削除できる(): void
    {
        // Arrange
        $admin = User::factory()->create(['is_admin' => true]);
        $university = University::factory()->create();

        // Act
        $response = $this->actingAs($admin)
            ->delete(route('admin.universities.destroy', $university));

        // Assert
        $response->assertRedirect(route('home'));
        $this->assertNotNull($university->fresh()->deleted_at);
    }

    public function test_一般ユーザーは大学を削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->delete(route('admin.universities.destroy', $university));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('universities', ['id' => $university->id]);
    }

    public function test_未認証ユーザーは大学を削除できない(): void
    {
        // Arrange
        $university = University::factory()->create();

        // Act
        $response = $this->delete(route('admin.universities.destroy', $university));

        // Assert
        $response->assertRedirect('/');
        $this->assertDatabaseHas('universities', ['id' => $university->id]);
    }

    // -------------------------
    // destroyFaculty
    // -------------------------

    public function test_管理者は学部を削除できる(): void
    {
        // Arrange
        $admin = User::factory()->create(['is_admin' => true]);
        $faculty = Faculty::factory()->create();

        // Act
        $response = $this->actingAs($admin)
            ->delete(route('admin.faculties.destroy', $faculty));

        // Assert
        $response->assertRedirect(route('faculties.index', ['university' => $faculty->university_id]));
        $this->assertNotNull($faculty->fresh()->deleted_at);
    }

    public function test_一般ユーザーは学部を削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->delete(route('admin.faculties.destroy', $faculty));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('faculties', ['id' => $faculty->id]);
    }

    public function test_未認証ユーザーは学部を削除できない(): void
    {
        // Arrange
        $faculty = Faculty::factory()->create();

        // Act
        $response = $this->delete(route('admin.faculties.destroy', $faculty));

        // Assert
        $response->assertRedirect('/');
        $this->assertDatabaseHas('faculties', ['id' => $faculty->id]);
    }

    // -------------------------
    // destroyLab
    // -------------------------

    public function test_管理者は研究室を削除できる(): void
    {
        // Arrange
        $admin = User::factory()->create(['is_admin' => true]);
        $lab = Lab::factory()->create();

        // Act
        $response = $this->actingAs($admin)
            ->delete(route('admin.labs.destroy', $lab));

        // Assert
        $response->assertRedirect(route('labs.index', ['faculty' => $lab->faculty_id]));
        $this->assertNotNull($lab->fresh()->deleted_at);
    }

    public function test_一般ユーザーは研究室を削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->delete(route('admin.labs.destroy', $lab));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('labs', ['id' => $lab->id]);
    }

    public function test_未認証ユーザーは研究室を削除できない(): void
    {
        // Arrange
        $lab = Lab::factory()->create();

        // Act
        $response = $this->delete(route('admin.labs.destroy', $lab));

        // Assert
        $response->assertRedirect('/');
        $this->assertDatabaseHas('labs', ['id' => $lab->id]);
    }

    // -------------------------
    // destroyComment
    // -------------------------

    public function test_管理者は任意のコメントを削除できる(): void
    {
        // Arrange
        $admin = User::factory()->create(['is_admin' => true]);
        $comment = Comment::factory()->create();

        // Act
        $response = $this->actingAs($admin)
            ->delete(route('admin.comments.destroy', $comment));

        // Assert
        $response->assertRedirect(route('labs.show', ['lab' => $comment->lab_id]));
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }

    public function test_一般ユーザーは他人のコメントを削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create(['user_id' => $otherUser->id]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('admin.comments.destroy', $comment));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }

    public function test_未認証ユーザーはコメントを削除できない(): void
    {
        // Arrange
        $comment = Comment::factory()->create();

        // Act
        $response = $this->delete(route('admin.comments.destroy', $comment));

        // Assert
        $response->assertRedirect('/');
        $this->assertDatabaseHas('comments', ['id' => $comment->id]);
    }
}
