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
        //  作成者を管理者に設定
        $adminId = User::where('email', 'admin@example.com')->value('id')
            ?? User::first()->id; // 念のため、管理者がいなければ最初のユーザーを使用
        // テストデータを修正
        University::create([
            'name' => 'テストA国立大学',
            'type' => 'national',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストB国立大学',
            'type' => 'national',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストC国立大学',
            'type' => 'national',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストD国立大学',
            'type' => 'national',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストE県立大学',
            'type' => 'public',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストF県立大学',
            'type' => 'public',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストG市立大学',
            'type' => 'public',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストH市立大学',
            'type' => 'public',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストI私立大学',
            'type' => 'private',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストJ私立大学',
            'type' => 'private',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストK私立大学',
            'type' => 'private',
            'created_by' => $adminId,
        ]);

        University::create([
            'name' => 'テストL私立大学',
            'type' => 'private',
            'created_by' => $adminId,
        ]);
    }
}
