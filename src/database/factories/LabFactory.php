<?php

namespace Database\Factories;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lab>
 */
class LabFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->lastName() . '研究室',
            'faculty_id' => Faculty::factory(),
            'created_by' => User::factory(),
            'description' => fake()->optional()->sentence(),
            'url' => fake()->optional()->url(),
            'professor_name' => fake()->optional()->name(),
            'professor_url' => fake()->optional()->url(),
            'gender_ratio_male' => $male = fake()->numberBetween(0, 100),
            'gender_ratio_female' => 100 - $male,
        ];
    }
}
