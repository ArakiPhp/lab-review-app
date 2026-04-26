<?php

namespace Tests\Feature\Controllers;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_未認証ユーザーはホームページを表示できる(): void
    {
        // Act
        $response = $this->get(route('home'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Home'));
    }

    public function test_認証済みユーザーもホームページを表示できる(): void
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)->get(route('home'));

        // Assert
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Home'));
    }
}
