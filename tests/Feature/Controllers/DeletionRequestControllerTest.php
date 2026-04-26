<?php

namespace Tests\Feature\Controllers;

use App\Models\DeletionRequest;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeletionRequestControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // create
    // -------------------------

    public function test_未認証ユーザーは削除依頼作成フォームを表示できない(): void
    {
        // Arrange
        $university = University::factory()->create();

        // Act
        $response = $this->get(route('deletion_requests.create', ['type' => 'university', 'id' => $university->id]));

        // Assert
        $response->assertRedirect('/');
    }

    public function test_認証済みユーザーは削除依頼作成フォームを表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->get(route('deletion_requests.create', ['type' => 'university', 'id' => $university->id]));

        // Assert
        $response->assertOk();
    }

    // -------------------------
    // store
    // -------------------------

    public function test_未認証ユーザーは削除依頼を送信できない(): void
    {
        // Arrange
        $university = University::factory()->create();

        // Act
        $response = $this->post(route('deletion_requests.store'), [
            'target_id' => $university->id,
            'target_type' => 'university',
            'reason' => 'テスト理由',
        ]);

        // Assert
        $response->assertRedirect('/');
        $this->assertDatabaseMissing('deletion_requests', [
            'target_id' => $university->id,
        ]);
    }

    public function test_認証済みユーザーは削除依頼を送信できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->post(route('deletion_requests.store'), [
                'target_id' => $university->id,
                'target_type' => 'university',
                'reason' => 'テスト理由',
            ]);

        // Assert
        $response->assertOk();
        $this->assertDatabaseHas('deletion_requests', [
            'requested_by' => $user->id,
            'target_id' => $university->id,
            'status' => 'pending',
        ]);
    }

    public function test_バリデーションエラーで削除依頼が拒否される(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();

        // Act（reason が空）
        $response = $this->actingAs($user)
            ->post(route('deletion_requests.store'), [
                'target_id' => $university->id,
                'target_type' => 'university',
                'reason' => '',
            ]);

        // Assert
        $response->assertSessionHasErrors('reason');
        $this->assertDatabaseMissing('deletion_requests', [
            'requested_by' => $user->id,
        ]);
    }

    // -------------------------
    // index
    // -------------------------

    public function test_未認証ユーザーは削除依頼一覧を表示できない(): void
    {
        // Act
        $response = $this->get(route('admin.deletion_requests.index'));

        // Assert
        $response->assertRedirect('/');
    }

    public function test_一般ユーザーは削除依頼一覧を表示できない(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->get(route('admin.deletion_requests.index'));

        // Assert
        $response->assertForbidden();
    }

    public function test_管理者は削除依頼一覧を表示できる(): void
    {
        // Arrange
        $admin = User::factory()->create(['is_admin' => true]);

        // Act
        $response = $this->actingAs($admin)
            ->get(route('admin.deletion_requests.index'));

        // Assert
        $response->assertOk();
    }
}
