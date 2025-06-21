<?php

namespace Database\Seeders;

use App\Models\Lab;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 研究室を適当に５つ作成
        Lab::create([
            'faculty_id' => 4,
            'name' => '機械工学科 材料工学研究室',
            'description' => '材料の力学的性質を調べる研究室です。',
            'url' => 'https://example.com/lab1',
            'professor_url' => 'https://example.com/professor1',
            'gender_ratio_male' => 6,
            'gender_ratio_female' => 4,
        ]);

        Lab::create([
            'faculty_id' => 4,
            'name' => '情報工学科',
            'description' => '情報処理技術を学ぶ研究室です。',
            'url' => 'https://example.com/lab2',
            'professor_url' => 'https://example.com/professor2',
            'gender_ratio_male' => 5,
            'gender_ratio_female' => 5,
        ]);

        Lab::create([
            'faculty_id' => 4,
            'name' => '応用化学科 荒木研究室',
            'description' => '化学の応用を学ぶ研究室です。',
            'url' => 'https://example.com/lab3',
            'professor_url' => 'https://example.com/professor3',
            'gender_ratio_male' => 7,
            'gender_ratio_female' => 3,
        ]);

        Lab::create([
            'faculty_id' => 4,
            'name' => '情報工学科',
            'description' => '情報処理技術を学ぶ研究室です。',
            'url' => 'https://example.com/lab4',
            'professor_url' => 'https://example.com/professor4',
            'gender_ratio_male' => 5,
            'gender_ratio_female' => 5,
        ]);

        Lab::create([
            'faculty_id' => 4,
            'name' => '機能材料工学科 荒井研究室',
            'description' => '機能性材料の研究を行う研究室です。',
            'url' => 'https://example.com/lab5',
            'professor_url' => 'https://example.com/professor5',
            'gender_ratio_male' => 4,
            'gender_ratio_female' => 6,
        ]);
    }
}
