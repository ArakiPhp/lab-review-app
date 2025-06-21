<?php

namespace Database\Factories;

use App\Models\Lab;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'lab_id' => Lab::inRandomOrder()->first()->id,
            'mentorship_style' => $this->faker->numberBetween(1, 5),
            'lab_atmosphere' => $this->faker->numberBetween(1, 5),
            'achievement_activity' => $this->faker->numberBetween(1, 5),
            'constraint_level' => $this->faker->numberBetween(1, 5),
            'facility_quality' => $this->faker->numberBetween(1, 5),
            'work_style' => $this->faker->numberBetween(1, 5),
            'student_balance' => $this->faker->numberBetween(1, 5),
        ];
    }
}
