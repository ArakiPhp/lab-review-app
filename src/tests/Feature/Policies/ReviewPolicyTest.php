<?php

namespace Tests\Feature\Policies;

use App\Models\Lab;
use App\Models\Review;
use App\Models\User;
use App\Policies\ReviewPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_レビューがない場合は作成できる(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        $policy = new ReviewPolicy();

        // Act
        $result = $policy->create($user, $lab);

        // Assert
        $this->assertTrue($result);
    }

    public function test_既にレビューがある場合は作成できない(): void
    {
        // Arrange
        $user = User::factory()->create();
        $lab = Lab::factory()->create();
        Review::factory()->create([
            'user_id' => $user->id,
            'lab_id' => $lab->id,
        ]);
        $policy = new ReviewPolicy();

        // Act
        $result = $policy->create($user, $lab);

        // Assert
        $this->assertFalse($result);
    }
}

