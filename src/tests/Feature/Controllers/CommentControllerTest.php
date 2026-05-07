<?php

namespace Tests\Feature\Controllers;

use App\Models\Comment;
use App\Models\Lab;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // store
    // -------------------------

    public function test_認証済みユーザーがコメントを投稿できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->postJson(route('comments.store', $lab), [
                'content' => 'テストコメントです。',
            ]);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('comments', [
            'user_id' => $user->id,
            'lab_id' => $lab->id,
            'content' => 'テストコメントです。',
        ]);
    }

    public function test_未認証ユーザーはコメントを投稿できない(): void
    {
        // Arrange
        $lab = Lab::factory()->create();

        // Act
        $response = $this->postJson(route('comments.store', $lab), [
            'content' => 'テストコメントです。',
        ]);

        // Assert
        $response->assertUnauthorized();
    }

    public function test_バリデーションエラーでコメントを投稿できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act（content が空）
        $response = $this->actingAs($user)
            ->postJson(route('comments.store', $lab), [
                'content' => '',
            ]);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('content');
        $this->assertDatabaseMissing('comments', [
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);
    }

    // -------------------------
    // update
    // -------------------------

    public function test_自分のコメントを更新できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'content' => '更新前のコメント',
        ]);

        // Act
        $response = $this->actingAs($user)
            ->putJson(route('comments.update', $comment), [
                'content' => '更新後のコメント',
            ]);

        // Assert
        $response->assertOk();
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => '更新後のコメント',
        ]);
    }

    public function test_バリデーションエラーでコメントを更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'content' => '更新前のコメント',
        ]);

        // Act（content が空）
        $response = $this->actingAs($user)
            ->putJson(route('comments.update', $comment), [
                'content' => '',
            ]);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('content');
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'content' => '更新前のコメント',
        ]);
    }

    public function test_他人のコメントは更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->putJson(route('comments.update', $comment), [
                'content' => '書き換えようとしたコメント',
            ]);

        // Assert
        $response->assertForbidden();
    }

    // -------------------------
    // destroy
    // -------------------------

    public function test_自分のコメントを削除できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->deleteJson(route('comments.destroy', $comment));

        // Assert
        $response->assertOk();
        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id,
        ]);
    }

    public function test_管理者は他人のコメントを削除できる(): void
    {
        // Arrange
        $admin = User::factory()->create(['is_admin' => true]);
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        // Act
        $response = $this->actingAs($admin)
            ->deleteJson(route('comments.destroy', $comment));

        // Assert
        $response->assertOk();
        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id,
        ]);
    }

    public function test_他人のコメントは削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->deleteJson(route('comments.destroy', $comment));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
        ]);
    }

    // -------------------------
    // index
    // -------------------------

    public function test_コメント一覧を取得できる(): void
    {
        // Arrange
        $lab = Lab::factory()->create();
        Comment::factory()->count(3)->create(['lab_id' => $lab->id]);

        // Act
        $response = $this->getJson(route('comments.index', $lab));

        // Assert
        $response->assertOk();
        $response->assertJsonStructure([
            'comments' => [['id', 'content', 'user']],
            'hasMore',
            'nextCursor',
        ]);
        $response->assertJsonCount(3, 'comments');
    }

    public function test_カーソルを使って続きを取得できる(): void
    {
        // Arrange
        $lab = Lab::factory()->create();
        // 新しい順に3件作成（idが小さい順に作成）
        $comments = Comment::factory()->count(3)->create(['lab_id' => $lab->id]);
        // 最も新しいコメントをカーソルとして指定すると、それより古い2件が返る
        $cursor = $comments->last()->id;

        // Act
        $response = $this->getJson(route('comments.index', ['lab' => $lab, 'cursor' => $cursor]));

        // Assert
        $response->assertOk();
        // カーソル指定のコメント自体は含まれず、それより古い2件が返る
        $response->assertJsonCount(2, 'comments');
        $response->assertJsonPath('hasMore', false);
    }

    public function test_コメントがlimitより多い場合はhasMoreがtrueになる(): void
    {
        // Arrange
        $lab = Lab::factory()->create();
        // デフォルト limit=20 を超える21件作成
        Comment::factory()->count(21)->create(['lab_id' => $lab->id]);

        // Act
        $response = $this->getJson(route('comments.index', $lab));

        // Assert
        $response->assertOk();
        $response->assertJsonPath('hasMore', true);
        $response->assertJsonCount(20, 'comments');
    }

    public function test_limitを指定して件数を絞れる(): void
    {
        // Arrange
        $lab = Lab::factory()->create();
        Comment::factory()->count(5)->create(['lab_id' => $lab->id]);

        // Act（limit=3 を指定）
        $response = $this->getJson(route('comments.index', ['lab' => $lab, 'limit' => 3]));

        // Assert
        $response->assertOk();
        $response->assertJsonCount(3, 'comments');
        $response->assertJsonPath('hasMore', true);
    }

    public function test_コメントが0件の場合は空配列が返る(): void
    {
        // Arrange
        $lab = Lab::factory()->create();

        // Act
        $response = $this->getJson(route('comments.index', $lab));

        // Assert
        $response->assertOk();
        $response->assertJsonCount(0, 'comments');
        $response->assertJsonPath('hasMore', false);
        $response->assertJsonPath('nextCursor', null);
    }
}

