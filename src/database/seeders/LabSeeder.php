<?php

namespace Database\Seeders;

use App\Models\Lab;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminId = User::where('email', 'admin@example.com')->value('id')
            ?? User::first()->id;

        Lab::create([
            'faculty_id' => 5,
            'name' => '機械工学科 テストA研究室',
            'description' => '材料の力学的性質を調べる研究室です。',
            'url' => 'https://example.com/lab1',
            'professor_name' => 'テストA太郎',
            'professor_url' => 'https://example.com/professor1',
            'gender_ratio_male' => 7,
            'gender_ratio_female' => 3,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '機械工学科 テストB研究室',
            'description' => '材料の力学的性質を調べる研究室です。',
            'professor_name' => 'テストB太郎',
            'url' => 'https://example.com/lab2',
            'professor_url' => 'https://example.com/professor2',
            'gender_ratio_male' => 7,
            'gender_ratio_female' => 3,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '情報工学科 テストC研究室',
            'description' => '情報処理技術を学ぶ研究室です。',
            'url' => 'https://example.com/lab3',
            'professor_name' => 'テストC太郎',
            'professor_url' => 'https://example.com/professor3',
            'gender_ratio_male' => 8,
            'gender_ratio_female' => 2,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '情報工学科 テストD研究室',
            'description' => '情報処理技術を学ぶ研究室です。',
            'professor_name' => 'テストD太郎',
            'url' => 'https://example.com/lab4',
            'professor_url' => 'https://example.com/professor4',
            'gender_ratio_male' => 8,
            'gender_ratio_female' => 2,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '応用化学科 テストE研究室',
            'description' => '化学の応用を学ぶ研究室です。',
            'url' => 'https://example.com/lab5',
            'professor_name' => 'テストE太郎',
            'professor_url' => 'https://example.com/professor5',
            'gender_ratio_male' => 6,
            'gender_ratio_female' => 4,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '応用化学科 テストF研究室',
            'description' => '化学の応用を学ぶ研究室です。',
            'url' => 'https://example.com/lab6',
            'professor_name' => 'テストF太郎',
            'professor_url' => 'https://example.com/professor6',
            'gender_ratio_male' => 6,
            'gender_ratio_female' => 4,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '機能材料工学科 テストG研究室',
            'description' => '機能性材料の研究を行う研究室です。',
            'url' => 'https://example.com/lab7',
            'professor_name' => 'テストG太郎',
            'professor_url' => 'https://example.com/professor7',
            'gender_ratio_male' => 9,
            'gender_ratio_female' => 1,
            'created_by' => $adminId,
        ]);

        Lab::create([
            'faculty_id' => 5,
            'name' => '機能材料工学科 テストH研究室',
            'description' => '機能性材料の研究を行う研究室です。',
            'url' => 'https://example.com/lab8',
            'professor_name' => 'テストH太郎',
            'professor_url' => 'https://example.com/professor8',
            'gender_ratio_male' => 9,
            'gender_ratio_female' => 1,
            'created_by' => $adminId,
        ]);
    }
}
