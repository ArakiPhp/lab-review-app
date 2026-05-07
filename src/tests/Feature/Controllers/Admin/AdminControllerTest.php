<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Comment;
use App\Models\DeletionRequest;
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\University;
use App\Models\User;
use App\Notifications\DeletionCompletedNotification;
use App\Notifications\ModelChangedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
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

    public function test_大学削除時に削除依頼者へDeletionCompletedNotificationが送られる(): void
    {
        // Arrange
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $requester = User::factory()->create();
        $university = University::factory()->create();
        DeletionRequest::create([
            'requested_by' => $requester->id,
            'target_type'  => University::class,
            'target_id'    => $university->id,
            'status'       => 'pending',
        ]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.universities.destroy', $university));

        // Assert
        Notification::assertSentTo($requester, DeletionCompletedNotification::class);
    }

    public function test_大学削除時に作成者へModelChangedNotificationが送られる(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);
        $university = University::factory()->create(['created_by' => $creator->id]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.universities.destroy', $university));

        // Assert
        Notification::assertSentTo($creator, ModelChangedNotification::class);
    }

    public function test_管理者自身が作成した大学を削除しても作成者へ通知は送られない(): void
    {
        // Arrange
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $university = University::factory()->create(['created_by' => $admin->id]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.universities.destroy', $university));

        // Assert
        Notification::assertNothingSent();
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

    public function test_学部削除時に削除依頼者へDeletionCompletedNotificationが送られる(): void
    {
        // Arrange
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $requester = User::factory()->create();
        $faculty = Faculty::factory()->create();
        DeletionRequest::create([
            'requested_by' => $requester->id,
            'target_type'  => Faculty::class,
            'target_id'    => $faculty->id,
            'status'       => 'pending',
        ]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.faculties.destroy', $faculty));

        // Assert
        Notification::assertSentTo($requester, DeletionCompletedNotification::class);
    }

    public function test_学部削除時に作成者へModelChangedNotificationが送られる(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);
        $faculty = Faculty::factory()->create(['created_by' => $creator->id]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.faculties.destroy', $faculty));

        // Assert
        Notification::assertSentTo($creator, ModelChangedNotification::class);
    }

    public function test_管理者自身が作成した学部を削除しても作成者へ通知は送られない(): void
    {
        // Arrange
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $faculty = Faculty::factory()->create(['created_by' => $admin->id]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.faculties.destroy', $faculty));

        // Assert
        Notification::assertNothingSent();
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

    public function test_研究室削除時に削除依頼者へDeletionCompletedNotificationが送られる(): void
    {
        // Arrange
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $requester = User::factory()->create();
        $lab = Lab::factory()->create();
        DeletionRequest::create([
            'requested_by' => $requester->id,
            'target_type'  => Lab::class,
            'target_id'    => $lab->id,
            'status'       => 'pending',
        ]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.labs.destroy', $lab));

        // Assert
        Notification::assertSentTo($requester, DeletionCompletedNotification::class);
    }

    public function test_研究室削除時に作成者へModelChangedNotificationが送られる(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);
        $lab = Lab::factory()->create(['created_by' => $creator->id]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.labs.destroy', $lab));

        // Assert
        Notification::assertSentTo($creator, ModelChangedNotification::class);
    }

    public function test_管理者自身が作成した研究室を削除しても作成者へ通知は送られない(): void
    {
        // Arrange
        Notification::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $lab = Lab::factory()->create(['created_by' => $admin->id]);

        // Act
        $this->actingAs($admin)
            ->delete(route('admin.labs.destroy', $lab));

        // Assert
        Notification::assertNothingSent();
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
