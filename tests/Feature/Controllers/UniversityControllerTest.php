<?php

namespace Tests\Feature\Controllers;

use App\Models\University;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UniversityControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // index
    // -------------------------

    public function test_大学一覧を表示できる(): void
    {
        // Arrange
        University::factory()->count(3)->create();

        // Act
        $response = $this->get(route('universities.index'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('University/Index')
            ->has('universities.data', 3)
        );
    }

    public function test_キーワードで大学を検索できる(): void
    {
        // Arrange
        University::factory()->create(['name' => '東京大学']);
        University::factory()->create(['name' => '大阪大学']);

        // Act
        $response = $this->get(route('universities.index', ['query' => '東京']));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('University/Index')
            ->has('universities.data', 1)
            ->where('query', '東京')
        );
    }

    // -------------------------
    // store
    // -------------------------

    public function test_認証済みユーザーが大学を作成できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->post(route('universities.store'), [
                'name' => 'テスト大学',
                'type' => 'national',
            ]);

        // Assert
        $response->assertRedirect();
        $this->assertDatabaseHas('universities', [
            'name' => 'テスト大学',
            'type' => 'national',
            'created_by' => $user->id,
        ]);
    }

    public function test_未認証ユーザーは大学を作成できない(): void
    {
        // Act
        $response = $this->post(route('universities.store'), [
            'name' => 'テスト大学',
            'type' => 'national',
        ]);

        // Assert
        $response->assertRedirect('/');
    }

    public function test_バリデーションエラーで大学を作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act（name が空）
        $response = $this->actingAs($user)
            ->post(route('universities.store'), [
                'name' => '',
                'type' => 'national',
            ]);

        // Assert
        $response->assertSessionHasErrors('name');
        $this->assertDatabaseMissing('universities', ['type' => 'national']);
    }

    public function test_重複した大学名では作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        University::factory()->create(['name' => 'テスト大学']);

        // Act
        $response = $this->actingAs($user)
            ->post(route('universities.store'), [
                'name' => 'テスト大学',
                'type' => 'national',
            ]);

        // Assert
        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('universities', 1);
    }

    // -------------------------
    // update
    // -------------------------

    public function test_認証済みユーザーが大学情報を更新できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create([
            'name' => '更新前大学',
            'type' => 'national',
            'version' => 1,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->put(route('universities.update', $university), [
                'name' => '更新後大学',
                'type' => 'public',
                'comment' => '名称変更のため更新',
                'version' => 1,
            ]);

        // Assert
        $response->assertRedirect();
        $this->assertDatabaseHas('universities', [
            'id' => $university->id,
            'name' => '更新後大学',
            'type' => 'public',
            'version' => 2,
        ]);
    }

    public function test_バージョン不一致の場合は更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create([
            'name' => '更新前大学',
            'version' => 2,
        ]);

        // Act（古いバージョン番号を送信）
        $response = $this->actingAs($user)
            ->put(route('universities.update', $university), [
                'name' => '更新後大学',
                'type' => 'national',
                'comment' => '変更理由',
                'version' => 1,
            ]);

        // Assert
        $response->assertSessionHasErrors('version');
        $this->assertDatabaseHas('universities', [
            'id' => $university->id,
            'name' => '更新前大学',
        ]);
    }

    // -------------------------
    // history
    // -------------------------

    public function test_大学の編集履歴を表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $university = University::factory()->create();
        $university->users()->attach($user->id, [
            'comment' => '初回登録',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Act
        $response = $this->get(route('universities.history', $university));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('University/History')
            ->has('editHistory', 1)
        );
    }
}
