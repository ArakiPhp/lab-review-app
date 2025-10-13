<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DeletionRequestController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\LabController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UniversityController;
use App\Models\Lab;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// URLを'/auth'に変更
Route::get('/auth', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/', [LabController::class, 'home'])->name('labs.home');

// 追加: ソーシャルログイン
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

Route::get('/faculty/{faculty}/labs', [LabController::class, 'index'])->name('labs.index');
Route::get('/labs/{lab}', [LabController::class, 'show'])->name('labs.show');
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{university}/faculties', [FacultyController::class, 'index'])->name('faculties.index');
Route::get('/universities/{university}/history', [UniversityController::class, 'history'])->name('university.history');
Route::get('/faculties/{faculty}/history', [FacultyController::class, 'history'])->name('faculty.history');
Route::get('/labs/{lab}/history', [LabController::class, 'history'])->name('lab.history');

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
    Route::get('/faculties/{faculty}/edit', [FacultyController::class, 'edit'])->name('faculty.edit');
    Route::put('/faculties/{faculty}', [FacultyController::class, 'update'])->name('faculty.update');
    
    // 研究室関連
    Route::get('/faculties/{faculty}/labs/create', [LabController::class, 'create'])->name('lab.create');
    Route::post('/faculties/{faculty}/labs', [LabController::class, 'store'])->name('lab.store');
    Route::get('/labs/{lab}/edit', [LabController::class, 'edit'])->name('lab.edit');
    Route::put('/labs/{lab}', [LabController::class, 'update'])->name('lab.update');

    // コメント関連
    Route::get('/labs/{lab}/comments/create', [CommentController::class, 'create'])->name('comment.create');
    Route::post('/labs/{lab}/comments', [CommentController::class, 'store'])->name('comment.store');
    Route::get('/comments/{comment}/edit', [CommentController::class, 'edit'])->name('comment.edit');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comment.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comment.destroy');

    // ブックマーク関連
    Route::post('/bookmarks', [BookmarkController::class, 'store'])->name('bookmark.store');
    Route::delete('/bookmarks/{bookmark}', [BookmarkController::class, 'destroy'])->name('bookmark.destroy');

    // マイページ関連
    Route::get('/mypage', [MyPageController::class, 'showUser'])->name('mypage.index');
    Route::get('/mypage/edit', [MyPageController::class, 'editUser'])->name('mypage.edit');
    Route::put('/mypage', [MyPageController::class, 'updateUser'])->name('mypage.update');
    Route::delete('/mypage', [MyPageController::class, 'deleteUser'])->name('mypage.delete');
    Route::get('/mypage/bookmarks', [MyPageController::class, 'showBookmarks'])->name('mypage.bookmarks');
    Route::delete('/mypage/bookmarks/{bookmark}', [MyPageController::class, 'removeBookmark'])->name('mypage.bookmark.remove');

    // 追加: 削除依頼関連
    Route::get('/deletion-requests/create/{type}/{id}', [DeletionRequestController::class, 'create'])->name('deletion_requests.create');
    Route::post('/deletion-requests', [DeletionRequestController::class, 'store'])->name('deletion_requests.store');

    // 追加: 通知関連
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');

    // 管理者用ルート
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::delete('/universities/{university}', [AdminController::class, 'destroyUniversity'])->name('universities.destroy');
        Route::delete('/faculties/{faculty}', [AdminController::class, 'destroyFaculty'])->name('faculties.destroy');
        Route::delete('/labs/{lab}', [AdminController::class, 'destroyLab'])->name('labs.destroy');
        Route::delete('/comments/{comment}', [AdminController::class, 'destroyComment'])->name('comments.destroy');
        Route::get('/deletion-requests', [DeletionRequestController::class, 'index'])->name('deletion_requests.index'); // 追加
    });
});

require __DIR__.'/auth.php';
