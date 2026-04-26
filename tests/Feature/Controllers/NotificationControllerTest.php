<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // index
    // -------------------------

    public function test_未認証ユーザーは通知一覧を表示できない(): void
    {
        // Act
        $response = $this->get(route('notifications.index'));

        // Assert
        $response->assertRedirect('/');
    }

    public function test_認証済みユーザーは通知一覧を表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('notifications.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Notification/Index')
            ->where('user.id', $user->id)
        );
    }

    public function test_通知が0件でも表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('notifications.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('notifications', 0)
        );
    }

    public function test_通知が含まれる場合も表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'TestNotification',
            'data' => ['message' => 'テスト通知'],
        ]);

        // Act
        $response = $this->actingAs($user)->get(route('notifications.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('notifications', 1)
        );
    }

    public function test_他のユーザーの通知は表示されない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherUser->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'TestNotification',
            'data' => ['message' => '他ユーザーの通知'],
        ]);

        // Act
        $response = $this->actingAs($user)->get(route('notifications.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('notifications', 0)
        );
    }

    // -------------------------
    // markAsRead
    // -------------------------

    public function test_未認証ユーザーは既読にできない(): void
    {
        // Act
        $response = $this->post(route('notifications.markAsRead'));

        // Assert
        $response->assertRedirect('/');
    }

    public function test_認証済みユーザーは未読通知を既読にできる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $user->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'TestNotification',
            'data' => ['message' => 'テスト通知'],
        ]);

        // Act
        $response = $this->actingAs($user)->post(route('notifications.markAsRead'));

        // Assert
        $response->assertRedirect();
        $this->assertCount(0, $user->fresh()->unreadNotifications);
    }

    public function test_既読にできるのは自分の通知のみで他ユーザーの通知は変わらない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherUser->notifications()->create([
            'id' => Str::uuid()->toString(),
            'type' => 'TestNotification',
            'data' => ['message' => '他ユーザーの通知'],
        ]);

        // Act
        $this->actingAs($user)->post(route('notifications.markAsRead'));

        // Assert（他ユーザーの通知は既読にならない）
        $this->assertCount(1, $otherUser->unreadNotifications);
    }
}
