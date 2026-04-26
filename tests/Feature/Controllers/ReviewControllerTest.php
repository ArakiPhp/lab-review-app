<?php

namespace Tests\Feature\Controllers;

use App\Models\Lab;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_認証済みユーザーがレビューを投稿できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act
        $response = $this->actingAs($user)
            ->post(route('reviews.store', $lab), [
                'mentorship_style' => 3,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]);

        // Assert
        $response->assertRedirect(route('labs.show', $lab));
        $this->assertDatabaseHas('reviews', [
            'user_id' => $user->id,
            'lab_id' => $lab->id,
            'mentorship_style' => 3,
        ]);
    }

    public function test_未認証ユーザーはレビューを投稿できない(): void
    {
        // Arrange
        $lab = Lab::factory()->create();

        // Act
        $response = $this->post(route('reviews.store', $lab), [
            'mentorship_style' => 3,
            'lab_atmosphere' => 4,
            'achievement_activity' => 5,
            'constraint_level' => 2,
            'facility_quality' => 4,
            'work_style' => 3,
            'student_balance' => 4,
        ]);

        // Assert
        $response->assertRedirect('/');
    }

    public function test_バリデーションエラーで投稿が拒否される(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act（範囲外の値 6 を送信）
        $response = $this->actingAs($user)
            ->post(route('reviews.store', $lab), [
                'mentorship_style' => 6,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]);

        // Assert
        $response->assertSessionHasErrors('mentorship_style');
        $this->assertDatabaseMissing('reviews', [
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);
    }

    public function test_評価値0はバリデーションエラーになる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();

        // Act（prepareForValidation で 0 → null に変換 → required で弾かれる）
        $response = $this->actingAs($user)
            ->post(route('reviews.store', $lab), [
                'mentorship_style' => 0,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]);

        // Assert
        $response->assertSessionHasErrors('mentorship_style');
        $this->assertDatabaseMissing('reviews', [
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);
    }

    public function test_自分のレビューを更新できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $user->id,
            'lab_id' => $lab->id,
            'mentorship_style' => 3,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->put(route('reviews.update', $review), [
                'mentorship_style' => 5,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]);

        // Assert
        $response->assertRedirect(route('labs.show', $lab));
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'mentorship_style' => 5,
        ]);
    }

    public function test_バリデーションエラーでレビューを更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $user->id,
            'lab_id' => $lab->id,
            'mentorship_style' => 3,
        ]);

        // Act（範囲外の値 6 を送信）
        $response = $this->actingAs($user)
            ->put(route('reviews.update', $review), [
                'mentorship_style' => 6,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]);

        // Assert
        $response->assertSessionHasErrors('mentorship_style');
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
            'mentorship_style' => 3,
        ]);
    }

    public function test_他人のレビューは更新できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $lab = Lab::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $otherUser->id,
            'lab_id' => $lab->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->put(route('reviews.update', $review), [
                'mentorship_style' => 5,
                'lab_atmosphere' => 4,
                'achievement_activity' => 5,
                'constraint_level' => 2,
                'facility_quality' => 4,
                'work_style' => 3,
                'student_balance' => 4,
            ]);

        // Assert
        $response->assertForbidden();
    }

    public function test_自分のレビューを削除できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('reviews.destroy', $review));

        // Assert
        $response->assertRedirect(route('labs.show', $lab));
        $this->assertDatabaseMissing('reviews', [
            'id' => $review->id,
        ]);
    }

    public function test_他人のレビューは削除できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $lab = Lab::factory()->create();
        $review = Review::factory()->create([
            'user_id' => $otherUser->id,
            'lab_id' => $lab->id,
        ]);

        // Act
        $response = $this->actingAs($user)
            ->delete(route('reviews.destroy', $review));

        // Assert
        $response->assertForbidden();
        $this->assertDatabaseHas('reviews', [
            'id' => $review->id,
        ]);
    }
}
