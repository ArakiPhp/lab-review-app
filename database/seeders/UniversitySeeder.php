<?php

namespace Database\Seeders;

use App\Models\University;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UniversitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 追加: 作成者を管理者に設定
        $adminId = User::where('email', 'admin@example.com')->value('id')
            ?? User::first()->id; // 念のため、管理者がいなければ最初のユーザーを使用
        // 大学を適当に３つ作成
        University::create([
            'name' => '荒木大学',
            'created_by' => $adminId, // 追加
        ]);

        University::create([
            'name' => '荒木県立大学',
            'created_by' => $adminId, // 追加
        ]);

        University::create([
            'name' => '荒木市立大学',
            'created_by' => $adminId, // 追加
        ]);
    }
}
