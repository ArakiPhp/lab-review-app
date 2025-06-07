<?php

namespace Database\Seeders;

use App\Models\Faculty;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 学部を適当に４つ作成
        Faculty::create([
            'university_id' => 1,
            'name' => '教養学部',
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '経済学部',
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '理学部',
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '工学部',
        ]);
    }
}
