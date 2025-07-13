<?php

use App\Http\Controllers\FacultyController;
use App\Http\Controllers\LabController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UniversityController;
use App\Models\Lab;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 修正: URLを'/auth'に変更
Route::get('/auth', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [LabController::class, 'home'])->name('labs.home'); // 追加

Route::get('/faculty/{faculty}/labs', [LabController::class, 'index'])->name('labs.index'); // 修正
Route::get('/labs/{lab}', [LabController::class, 'show'])->name('labs.show');
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{university}/faculties', [FacultyController::class, 'index'])->name('faculties.index');
Route::get('/universities/{university}/history', [UniversityController::class, 'history'])->name('university.history'); // 追加
Route::get('/faculties/{faculty}/history', [FacultyController::class, 'history'])->name('faculty.history'); // 追加

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // レビュー関連
    Route::get(('/labs/{lab}/reviews/create'), [ReviewController::class, 'create'])->name('review.create');
    Route::post(('/labs/{lab}/reviews'), [ReviewController::class, 'store'])->name('review.store');
    Route::get('/reviews/{review}/edit', [ReviewController::class, 'edit'])->name('review.edit');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('review.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('review.destroy');

    // 大学関連
    Route::get('/universities/create', [UniversityController::class, 'create'])->name('university.create');
    Route::post('/universities', [UniversityController::class, 'store'])->name('university.store');
    Route::get('/universities/{university}/edit', [UniversityController::class, 'edit'])->name('university.edit');
    Route::put('/universities/{university}', [UniversityController::class, 'update'])->name('university.update');

    // 学部関連
    Route::get('/universities/{university}/faculties/create', [FacultyController::class, 'create'])->name('faculty.create');
    Route::post('/universities/{university}/faculties', [FacultyController::class, 'store'])->name('faculty.store');
    Route::get('/faculties/{faculty}/edit', [FacultyController::class, 'edit'])->name('faculty.edit'); // 追加
    Route::put('/faculties/{faculty}', [FacultyController::class, 'update'])->name('faculty.update'); // 追加
    
    // 研究室関連
    Route::get('/faculties/{faculty}/labs/create', [LabController::class, 'create'])->name('lab.create');
    Route::post('/faculties/{faculty}/labs', [LabController::class, 'store'])->name('lab.store');
});

require __DIR__.'/auth.php';
