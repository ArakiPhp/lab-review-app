<?php

namespace App\Providers;

use App\Models\Faculty; // 追加
use App\Models\Review;
use App\Models\University;
use App\Policies\FacultyPolicy; // 追加
use App\Policies\ReviewPolicy;
use App\Policies\UniversityPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // ポリシーを登録
        Gate::policy(Review::class, ReviewPolicy::class);
        Gate::policy(University::class, UniversityPolicy::class);
        Gate::policy(Faculty::class, FacultyPolicy::class); // 追加
    }
}
