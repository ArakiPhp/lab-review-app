<?php

namespace Database\Seeders;

use App\Models\Lab; // 追加
use App\Models\Review; // 追加
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
        $this->call([
            UniversitySeeder::class,
            FacultySeeder::class,
            LabSeeder::class,
        ]);

        // ユーザー30人分を作成、さらにリレーションを付与
        User::factory()->count(30)->create()->each(function ($user) {
            // 大学・学部・研究室のリレーションを付与
            $user->universities()->attach(rand(1, 3)); // university_id: 1~3
            $user->faculties()->attach(rand(1, 4)); // faculty_id: 1~4
            $user->labs()->attach(rand(1, 5)); // lab_id: 1~5
        });

        // レビューを50件作成
        // ただし、重複を回避しながら作成
        $users = User::all();
        $labs = Lab::all();
        $createdCombinations = [];
        $targetCount = 50;

        while (count($createdCombinations) < $targetCount) {
            $userId = $users->random()->id;
            $labId = $labs->random()->id;
            $combination = "{$userId}-{$labId}";

            if (!in_array($combination, $createdCombinations)) {
                Review::factory()->create([
                    'user_id' => $userId,
                    'lab_id' => $labId,
                ]);
                $createdCombinations[] = $combination;
            }
        }
    }
}
