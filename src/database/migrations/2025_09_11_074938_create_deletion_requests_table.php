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
        Schema::create('deletion_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requested_by')->constrained('users');
            $table->foreignId('processed_by')->nullable()->constrained('users');
            $table->morphs('target');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('reason')->nullable();
            $table->timestamps();
            $table->timestamp('processed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deletion_requests');
    }
};
