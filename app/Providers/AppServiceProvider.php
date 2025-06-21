<?php

namespace App\Providers;

use App\Models\Review; // 追加
use App\Policies\ReviewPolicy; // 追加
use Illuminate\Support\Facades\Gate; // 追加
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

        // 追加: ポリシーを登録
        Gate::policy(Review::class, ReviewPolicy::class);
    }
}
