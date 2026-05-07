<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewRatingRequest;
use App\Models\Lab;
use App\Models\Review;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    use AuthorizesRequests;

    /**
     * レビューを作成する
     */
    public function store(ReviewRatingRequest $request, Lab $lab): RedirectResponse
    {
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

    /**
     * レビューを更新する
     */
    public function update(ReviewRatingRequest $request, Review $review): RedirectResponse
    {

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

    /**
     * レビューを削除する
     */
    public function destroy(Review $review): RedirectResponse
    {
        // ポリシーで認可をチェック
        $this->authorize('delete', $review);

        $labId = $review->lab_id;

        $review->delete();
        return redirect()->route('labs.show', ['lab' => $labId])->with('success', 'レビューが削除されました。');
    }
}
