<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DeletionRequestController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LabController;
use App\Http\Controllers\MyPageController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UniversityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// ホームページ
Route::get('/', [HomeController::class, 'home'])->name('home');

// ソーシャルログイン
Route::get('/auth/google', [GoogleAuthController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('auth.google.callback');

Route::get('/faculties/{faculty}/labs', [LabController::class, 'index'])->name('labs.index');
Route::get('/labs/{lab}', [LabController::class, 'show'])->name('labs.show');
Route::get('/universities', [UniversityController::class, 'index'])->name('universities.index');
Route::get('/universities/{university}/faculties', [FacultyController::class, 'index'])->name('faculties.index');
Route::get('/universities/{university}/history', [UniversityController::class, 'history'])->name('universities.history');
Route::get('/faculties/{faculty}/history', [FacultyController::class, 'history'])->name('faculties.history');
Route::get('/labs/{lab}/history', [LabController::class, 'history'])->name('labs.history');
Route::get('/labs/{lab}/comments', [CommentController::class, 'index'])->name('comments.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // レビュー関連
    Route::post(('/labs/{lab}/reviews'), [ReviewController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // 大学関連
    Route::post('/universities', [UniversityController::class, 'store'])->name('universities.store');
    Route::put('/universities/{university}', [UniversityController::class, 'update'])->name('universities.update');

    // 学部関連
    Route::post('/universities/{university}/faculties', [FacultyController::class, 'store'])->name('faculties.store');
    Route::put('/faculties/{faculty}', [FacultyController::class, 'update'])->name('faculties.update');
    
    // 研究室関連
    Route::post('/faculties/{faculty}/labs', [LabController::class, 'store'])->name('labs.store');
    Route::put('/labs/{lab}', [LabController::class, 'update'])->name('labs.update');

    // コメント関連
    Route::post('/labs/{lab}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // ブックマーク関連
    Route::post('/bookmarks', [BookmarkController::class, 'store'])->name('bookmarks.store');
    Route::delete('/bookmarks/{bookmark}', [BookmarkController::class, 'destroy'])->name('bookmarks.destroy');

    // マイページ関連
    Route::get('/mypage', [MyPageController::class, 'showUser'])->name('mypage.index');
    Route::put('/mypage', [MyPageController::class, 'updateUser'])->name('mypage.update');
    Route::delete('/mypage', [MyPageController::class, 'deleteUser'])->name('mypage.delete');
    Route::get('/mypage/bookmarks', [MyPageController::class, 'showBookmarks'])->name('mypage.bookmarks');
    Route::get('/mypage/withdrawal', [MyPageController::class, 'showWithdrawal'])->name('mypage.withdrawal');
    Route::delete('/mypage/bookmarks/{bookmark}', [MyPageController::class, 'removeBookmark'])->name('mypage.bookmarks.remove');

    // 削除依頼関連
    Route::get('/deletion-requests/create/{type}/{id}', [DeletionRequestController::class, 'create'])->name('deletion_requests.create');
    Route::post('/deletion-requests', [DeletionRequestController::class, 'store'])->name('deletion_requests.store');

    // 通知関連
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');

    // 管理者用ルート
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::delete('/universities/{university}', [AdminController::class, 'destroyUniversity'])->name('universities.destroy');
        Route::delete('/faculties/{faculty}', [AdminController::class, 'destroyFaculty'])->name('faculties.destroy');
        Route::delete('/labs/{lab}', [AdminController::class, 'destroyLab'])->name('labs.destroy');
        Route::delete('/comments/{comment}', [AdminController::class, 'destroyComment'])->name('comments.destroy');
        Route::get('/deletion-requests', [DeletionRequestController::class, 'index'])->name('deletion_requests.index');
    });
});

require __DIR__.'/auth.php';
