<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // 外部キー
            $table->foreignId('lab_id')->constrained()->onDelete('cascade'); // 外部キー
            $table->unsignedTinyInteger('mentorship_style'); // 指導スタイル
            $table->unsignedTinyInteger('lab_atmosphere'); // 雰囲気・文化
            $table->unsignedTinyInteger('achievement_activity'); // 成果・活動
            $table->unsignedTinyInteger('constraint_level'); // 拘束度
            $table->unsignedTinyInteger('facility_quality'); // 設備
            $table->unsignedTinyInteger('work_style'); // 働き方
            $table->unsignedTinyInteger('student_balance'); // 人数バランス
            $table->timestamps();
            $table->unique(['user_id', 'lab_id']); // ユーザーと研究室の組み合わせは一意
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
