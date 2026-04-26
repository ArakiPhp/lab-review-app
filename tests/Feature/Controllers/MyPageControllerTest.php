<?php

namespace Tests\Feature\Controllers;

use App\Models\Bookmark;
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class MyPageControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // showUser
    // -------------------------

    public function test_マイページを表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('MyPage/Index')
            ->where('user.id', $user->id)
        );
    }

    public function test_未認証ユーザーはマイページを表示できない(): void
    {
        // Act
        $response = $this->get(route('mypage.index'));

        // Assert
        $response->assertRedirect('/');
    }

    public function test_マイページに通知が含まれる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'TestNotification',
            'data' => ['message' => 'テスト通知'],
        ]);

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('notifications', 1)
        );
    }

    public function test_マイページに通知が0件の場合も表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('notifications', 0)
        );
    }

    public function test_マイページにブックマーク済み研究室が含まれる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        Bookmark::factory()->create([
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('bookmarks', 1)
        );
    }

    public function test_マイページにブックマークが0件の場合も表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('bookmarks', 0)
        );
    }

    public function test_マイページに作成済みリソースが含まれる(): void
    {
        // Arrange
        $user = User::factory()->create();
        University::factory()->create(['created_by' => $user->id]);
        Faculty::factory()->create(['created_by' => $user->id]);
        Lab::factory()->create(['created_by' => $user->id]);

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('universities', 1)
            ->has('faculties', 1)
            ->has('createdLabs', 1)
        );
    }

    public function test_マイページに作成済みリソースが0件の場合も表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('mypage.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('universities', 0)
            ->has('faculties', 0)
            ->has('createdLabs', 0)
        );
    }

    // -------------------------
    // updateUser
    // -------------------------

    public function test_ユーザー情報を更新できる(): void
    {
        // Arrange
        $user = User::factory()->create(['name' => '更新前の名前']);

        // Act
        $response = $this->actingAs($user)
            ->put(route('mypage.update'), [
                'nickname' => '更新後の名前',
                'email' => $user->email,
            ]);

        // Assert
        $response->assertRedirect(route('mypage.index'));
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => '更新後の名前',
        ]);
    }

    public function test_パスワードを更新できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->put(route('mypage.update'), [
                'nickname' => $user->name,
                'email' => $user->email,
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        // Assert
        $response->assertRedirect(route('mypage.index'));
    }

    public function test_バリデーションエラーでユーザー情報を更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act（nickname が空）
        $response = $this->actingAs($user)
            ->put(route('mypage.update'), [
                'nickname' => '',
                'email' => $user->email,
            ]);

        // Assert
        $response->assertSessionHasErrors('nickname');
    }

    // -------------------------
    // showWithdrawal
    // -------------------------

    public function test_退会ページを表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('mypage.withdrawal'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('MyPage/Withdrawal'));
    }

    // -------------------------
    // deleteUser
    // -------------------------

    public function test_アカウントを削除できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->delete(route('mypage.delete'));

        // Assert
        $response->assertRedirect(route('home'));
        // SoftDeletes のため物理削除ではなく deleted_at がセットされる
        $this->assertNotNull($user->fresh()->deleted_at);
    }

    // -------------------------
    // removeBookmark
    // -------------------------

    public function test_ブックマークを解除できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $bookmark = Bookmark::factory()->create(['user_id' => $user->id]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('mypage.bookmarks.remove', $bookmark));

        // Assert
        $response->assertRedirect(route('mypage.bookmarks'));
        $this->assertDatabaseMissing('bookmarks', ['id' => $bookmark->id]);
    }

    public function test_他人のブックマークは解除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $bookmark = Bookmark::factory()->create(['user_id' => $otherUser->id]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('mypage.bookmarks.remove', $bookmark));

        // Assert
        $response->assertStatus(404);
        $this->assertDatabaseHas('bookmarks', ['id' => $bookmark->id]);
    }
}

