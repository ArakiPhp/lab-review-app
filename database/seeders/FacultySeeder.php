<?php

namespace Database\Seeders;

use App\Models\Faculty;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 作成者を管理者に設定
        $adminId = User::where('email', 'admin@example.com')->value('id')
            ?? User::first()->id;

        // 修正: 学部を適当に5つ作成
        Faculty::create([
            'university_id' => 1,
            'name' => '教養学部',
            'created_by' => $adminId,
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '経済学部',
            'created_by' => $adminId,
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '教育学部',
            'created_by' => $adminId,
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '理学部',
            'created_by' => $adminId,
        ]);

        Faculty::create([
            'university_id' => 1,
            'name' => '工学部',
            'created_by' => $adminId,
        ]);
    }
}
