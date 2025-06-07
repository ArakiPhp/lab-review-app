<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 大学・学部・研究室のSeederクラスを呼び出す
        $this->call(([
            UniversitySeeder::class,
            FacultySeeder::class,
            LabSeeder::class,
        ]));

        // ユーザー30人分を作成、さらにリレーションを付与
        User::factory()->count(30)->create()->each(function ($user) {
            // 大学・学部・研究室のリレーションを付与
            $user->universities()->attach(rand(1, 3)); // university_id: 1~3
            $user->faculties()->attach(rand(1, 4)); // faculty_id: 1~4
            $user->labs()->attach(rand(1, 5)); // lab_id: 1~5
        });
    }
}
