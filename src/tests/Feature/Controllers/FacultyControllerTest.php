<?php

namespace Tests\Feature\Controllers;

use App\Models\Faculty;
use App\Models\University;
use App\Models\User;
use App\Notifications\ModelChangedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class FacultyControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // index
    // -------------------------

    public function test_学部一覧を表示できる(): void
    {
        // Arrange
        $university = University::factory()->create();
        Faculty::factory()->count(3)->create(['university_id' => $university->id]);

        // Act
        $response = $this->get(route('faculties.index', $university));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Faculty/Index')
            ->has('faculties', 3)
            ->where('university.id', $university->id)
        );
    }

    // -------------------------
    // store
    // -------------------------

    public function test_認証済みユーザーが学部を作成できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->post(route('faculties.store', $university), [
                'name' => 'テスト学部',
            ]);

        // Assert
        $response->assertRedirect();
        $this->assertDatabaseHas('faculties', [
            'name' => 'テスト学部',
            'university_id' => $university->id,
            'created_by' => $user->id,
        ]);
    }

    public function test_未認証ユーザーは学部を作成できない(): void
    {
        // Arrange
        $university = University::factory()->create();

        // Act
        $response = $this->post(route('faculties.store', $university), [
            'name' => 'テスト学部',
        ]);

        // Assert
        $response->assertRedirect('/');
    }

    public function test_バリデーションエラーで学部を作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();

        // Act（name が空）
        $response = $this->actingAs($user)
            ->post(route('faculties.store', $university), [
                'name' => '',
            ]);

        // Assert
        $response->assertSessionHasErrors('name');
        $this->assertDatabaseMissing('faculties', ['university_id' => $university->id]);
    }

    public function test_同じ大学内で重複した学部名では作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();
        Faculty::factory()->create([
            'name' => 'テスト学部',
            'university_id' => $university->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->post(route('faculties.store', $university), [
                'name' => 'テスト学部',
            ]);

        // Assert
        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('faculties', 1);
    }

    // -------------------------
    // update
    // -------------------------

    public function test_認証済みユーザーが学部情報を更新できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create([
            'name' => '更新前学部',
            'version' => 1,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->put(route('faculties.update', $faculty), [
                'name' => '更新後学部',
                'comment' => '名称変更のため更新',
                'version' => 1,
            ]);

        // Assert
        $response->assertRedirect();
        $this->assertDatabaseHas('faculties', [
            'id' => $faculty->id,
            'name' => '更新後学部',
            'version' => 2,
        ]);
    }

    public function test_バージョン不一致の場合は更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create([
            'name' => '更新前学部',
            'version' => 2,
        ]);

        // Act（古いバージョン番号を送信）
        $response = $this->actingAs($user)
            ->put(route('faculties.update', $faculty), [
                'name' => '更新後学部',
                'comment' => '変更理由',
                'version' => 1,
            ]);

        // Assert
        $response->assertSessionHasErrors('version');
        $this->assertDatabaseHas('faculties', [
            'id' => $faculty->id,
            'name' => '更新前学部',
        ]);
    }

    public function test_他のユーザーが学部を更新すると作成者へ通知が送られる(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $updater = User::factory()->create();
        $faculty = Faculty::factory()->create([
            'created_by' => $creator->id,
            'name' => '更新前学部',
            'version' => 1,
        ]);

        // Act
        $this->actingAs($updater)
            ->put(route('faculties.update', $faculty), [
                'name' => '更新後学部',
                'comment' => '名称変更',
                'version' => 1,
            ]);

        // Assert
        Notification::assertSentTo($creator, ModelChangedNotification::class);
    }

    public function test_作成者自身が学部を更新しても通知は送られない(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $faculty = Faculty::factory()->create([
            'created_by' => $creator->id,
            'name' => '更新前学部',
            'version' => 1,
        ]);

        // Act
        $this->actingAs($creator)
            ->put(route('faculties.update', $faculty), [
                'name' => '更新後学部',
                'comment' => '自分で更新',
                'version' => 1,
            ]);

        // Assert
        Notification::assertNothingSent();
    }

    // -------------------------
    // history
    // -------------------------

    public function test_学部の編集履歴を表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create();
        $faculty->users()->attach($user->id, [
            'comment' => '初回登録',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Act
        $response = $this->get(route('faculties.history', $faculty));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Faculty/History')
            ->has('editHistory', 1)
        );
    }
}

