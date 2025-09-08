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
        Schema::create('labs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('faculty_id')->constrained('faculties')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->text('url')->nullable();
            $table->text('professor_url')->nullable();
            $table->unsignedTinyInteger('gender_ratio_male');
            $table->unsignedTinyInteger('gender_ratio_female');
            $table->timestamps();
            $table->softDeletes(); // こっちも忘れていました。追加してください。（笑）
            $table->unsignedBigInteger('version')->default(1); // 追加
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labs');
    }
};
