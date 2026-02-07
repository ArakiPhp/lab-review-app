<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewRatingRequest;
use App\Models\Lab;
use App\Models\Review;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use AuthorizesRequests;
    
    public function create(Lab $lab) {
        // ポリシーで認可をチェック
        $this->authorize('create', [Review::class, $lab]);
        return Inertia::render('Review/Create', ['lab' => $lab]);
    }

    public function store(ReviewRatingRequest $request, Lab $lab) {
        // ポリシーで認可をチェック
        $this->authorize('create', [Review::class, $lab]);
        $validated = $request->validated();

        // バリデーション済みのデータを保存
        $review = new Review();
        $review->user_id = Auth::id();
        $review->lab_id = $lab->id;
        $review->mentorship_style = $validated['mentorship_style'];
        $review->lab_atmosphere = $validated['lab_atmosphere'];
        $review->achievement_activity = $validated['achievement_activity'];
        $review->constraint_level = $validated['constraint_level'];
        $review->facility_quality = $validated['facility_quality'];
        $review->work_style = $validated['work_style'];
        $review->student_balance = $validated['student_balance'];
        $review->save();

        return redirect()->route('labs.show', ['lab' => $lab])->with('success', 'レビューが保存されました。');
    }

    public function edit(Review $review) {
        // ポリシーで認可をチェック
        $this->authorize('update', $review);
        $review->load('lab');
        return Inertia::render('Review/Edit', ['review' => $review,]);
    }

    public function update(ReviewRatingRequest $request, Review $review) {
        // ポリシーで認可をチェック
        $this->authorize('update', $review);
        $validated = $request->validated();

        // バリデーション済みのデータを更新
        $review->mentorship_style = $validated['mentorship_style'];
        $review->lab_atmosphere = $validated['lab_atmosphere'];
        $review->achievement_activity = $validated['achievement_activity'];
        $review->constraint_level = $validated['constraint_level'];
        $review->facility_quality = $validated['facility_quality'];
        $review->work_style = $validated['work_style'];
        $review->student_balance = $validated['student_balance'];
        $review->save();

        return redirect()->route('labs.show', ['lab' => $review->lab_id])->with('success', 'レビューが更新されました。');
    }

    public function destroy(Review $review) {
        // ポリシーで認可をチェック
        $this->authorize('delete', $review);

        $labId = $review->lab_id; // 追加: 研究室IDを取得

        $review->delete();
        return redirect()->route('labs.show', ['lab' => $labId])->with('success', 'レビューが削除されました。');
    }
}
