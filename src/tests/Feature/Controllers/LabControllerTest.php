<?php

namespace Tests\Feature\Controllers;

use App\Models\Faculty;
use App\Models\Lab;
use App\Models\Review;
use App\Models\User;
use App\Notifications\ModelChangedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class LabControllerTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------
    // show
    // -------------------------

    public function test_研究室の詳細を表示できる(): void
    {
        // Arrange
        $lab = Lab::factory()->create();

        // Act
        $response = $this->get(route('labs.show', $lab));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Lab/Show')
            ->where('lab.id', $lab->id)
        );
    }

    public function test_研究室の詳細にレビュー一覧が含まれる(): void
    {
        // Arrange
        $lab = Lab::factory()->create();
        Review::factory()->count(2)->create(['lab_id' => $lab->id]);

        // Act
        $response = $this->get(route('labs.show', $lab));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Lab/Show')
            ->has('lab.reviews', 2)
        );
    }

    // -------------------------
    // index
    // -------------------------

    public function test_研究室一覧を表示できる(): void
    {
        // Arrange
        $faculty = Faculty::factory()->create();
        Lab::factory()->count(3)->create(['faculty_id' => $faculty->id]);

        // Act
        $response = $this->get(route('labs.index', $faculty));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Lab/Index')
            ->has('labs.data', 3)
            ->where('faculty.id', $faculty->id)
        );
    }

    public function test_ソート条件を指定して研究室一覧を表示できる(): void
    {
        // Arrange
        $faculty = Faculty::factory()->create();
        Lab::factory()->count(2)->create(['faculty_id' => $faculty->id]);

        // Act
        $response = $this->get(route('labs.index', ['faculty' => $faculty, 'sort' => 'reviews_count']));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Lab/Index')
            ->where('sort', 'reviews_count')
        );
    }

    // -------------------------
    // store
    // -------------------------

    public function test_認証済みユーザーが研究室を作成できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->post(route('labs.store', $faculty), [
                'name' => 'テスト研究室',
                'description' => null,
                'url' => null,
                'professor_name' => null,
                'professor_url' => null,
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
            ]);

        // Assert
        $response->assertRedirect(route('labs.show', Lab::first()));
        $this->assertDatabaseHas('labs', [
            'name' => 'テスト研究室',
            'faculty_id' => $faculty->id,
            'created_by' => $user->id,
            'gender_ratio_male' => 6,
            'gender_ratio_female' => 4,
        ]);
    }

    public function test_未認証ユーザーは研究室を作成できない(): void
    {
        // Arrange
        $faculty = Faculty::factory()->create();

        // Act
        $response = $this->post(route('labs.store', $faculty), [
            'name' => 'テスト研究室',
            'gender_ratio_male' => 6,
            'gender_ratio_female' => 4,
        ]);

        // Assert
        $response->assertRedirect('/');
    }

    public function test_バリデーションエラーで研究室を作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create();

        // Act（name が空）
        $response = $this->actingAs($user)
            ->post(route('labs.store', $faculty), [
                'name' => '',
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
            ]);

        // Assert
        $response->assertSessionHasErrors('name');
        $this->assertDatabaseMissing('labs', ['faculty_id' => $faculty->id]);
    }

    public function test_男女比の合計が10を超えると研究室を作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create();

        // Act（合計 11 を送信）
        $response = $this->actingAs($user)
            ->post(route('labs.store', $faculty), [
                'name' => 'テスト研究室',
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 5,
            ]);

        // Assert
        $response->assertSessionHasErrors('gender_ratio_female');
        $this->assertDatabaseMissing('labs', ['faculty_id' => $faculty->id]);
    }

    public function test_同じ学部内で重複した研究室名では作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $faculty = Faculty::factory()->create();
        Lab::factory()->create([
            'name' => 'テスト研究室',
            'faculty_id' => $faculty->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->post(route('labs.store', $faculty), [
                'name' => 'テスト研究室',
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
            ]);

        // Assert
        $response->assertSessionHasErrors('name');
        $this->assertDatabaseCount('labs', 1);
    }

    // -------------------------
    // update
    // -------------------------

    public function test_認証済みユーザーが研究室情報を更新できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create([
            'name' => '更新前研究室',
            'version' => 1,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->put(route('labs.update', $lab), [
                'name' => '更新後研究室',
                'description' => null,
                'url' => null,
                'professor_name' => null,
                'professor_url' => null,
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
                'comment' => '名称変更のため更新',
                'version' => 1,
            ]);

        // Assert
        $response->assertRedirect(route('labs.show', $lab));
        $this->assertDatabaseHas('labs', [
            'id' => $lab->id,
            'name' => '更新後研究室',
            'version' => 2,
        ]);
    }

    public function test_バージョン不一致の場合は更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create([
            'name' => '更新前研究室',
            'version' => 2,
        ]);

        // Act（古いバージョン番号を送信）
        $response = $this->actingAs($user)
            ->put(route('labs.update', $lab), [
                'name' => '更新後研究室',
                'description' => null,
                'url' => null,
                'professor_name' => null,
                'professor_url' => null,
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
                'comment' => '変更理由',
                'version' => 1,
            ]);

        // Assert
        $response->assertSessionHasErrors('version');
        $this->assertDatabaseHas('labs', [
            'id' => $lab->id,
            'name' => '更新前研究室',
        ]);
    }

    public function test_他のユーザーが研究室を更新すると作成者へ通知が送られる(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $updater = User::factory()->create();
        $lab = Lab::factory()->create([
            'created_by' => $creator->id,
            'name' => '更新前研究室',
            'version' => 1,
        ]);

        // Act
        $this->actingAs($updater)
            ->put(route('labs.update', $lab), [
                'name' => '更新後研究室',
                'description' => null,
                'url' => null,
                'professor_name' => null,
                'professor_url' => null,
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
                'comment' => '名称変更',
                'version' => 1,
            ]);

        // Assert
        Notification::assertSentTo($creator, ModelChangedNotification::class);
    }

    public function test_作成者自身が研究室を更新しても通知は送られない(): void
    {
        // Arrange
        Notification::fake();

        $creator = User::factory()->create();
        $lab = Lab::factory()->create([
            'created_by' => $creator->id,
            'name' => '更新前研究室',
            'version' => 1,
        ]);

        // Act
        $this->actingAs($creator)
            ->put(route('labs.update', $lab), [
                'name' => '更新後研究室',
                'description' => null,
                'url' => null,
                'professor_name' => null,
                'professor_url' => null,
                'gender_ratio_male' => 6,
                'gender_ratio_female' => 4,
                'comment' => '自分で更新',
                'version' => 1,
            ]);

        // Assert
        Notification::assertNothingSent();
    }

    // -------------------------
    // history
    // -------------------------

    public function test_研究室の編集履歴を表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        $lab->users()->attach($user->id, [
            'comment' => '初回登録',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Act
        $response = $this->get(route('labs.history', $lab));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Lab/History')
            ->has('editHistory', 1)
        );
    }
}

