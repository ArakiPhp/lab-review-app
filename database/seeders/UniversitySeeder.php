<?php

namespace Database\Seeders;

use App\Models\University;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UniversitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 大学を適当に３つ作成
        University::create([
            'name' => '荒木大学',
        ]);

        University::create([
            'name' => '荒木県立大学',
        ]);

        University::create([
            'name' => '荒木市立大学',
        ]);
    }
}
