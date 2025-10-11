<?php

namespace App\Http\Controllers\Admin; // 名前空間が他のコントローラーと異なり、整理されている

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\DeletionRequest; // 追加
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\University;
use App\Notifications\DeletionCompletedNotification; // 追加
use App\Notifications\ModelChangedNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    use AuthorizesRequests;
    
    public function destroyUniversity(University $university)
    {
        // 認可チェック
        $this->authorize('delete', $university);

        $creator = $university->creator; // 追加: 作成者を取得
        $universityName = $university->name; // 追加: 通知用に大学名を取得

        // 対象の削除依頼があれば取得
        $deletionRequest = DeletionRequest::where('target_type', University::class)
            ->where('target_id', $university->id)
            ->first();

        // 追加: 通知送信
        if ($deletionRequest) {
            $requester = $deletionRequest->requester;
            $requester->notify(new DeletionCompletedNotification($university->name, '大学'));

            $deletionRequest->processed_by = auth()->id();
            $deletionRequest->status = 'approved';
            $deletionRequest->save();
        }

        $university->delete();

        // 追加: 通知送信（作成者へ）
        if ($creator && auth()->id() !== $creator->id) {
            $creator->notify(new ModelChangedNotification(
                'deleted',
                '大学',
                $universityName
            ));
        }
        
        return redirect()->route('labs.home')->with('success', '大学が削除されました。');
    }

    public function destroyFaculty(Faculty $faculty)
    {
        // 認可チェック
        $this->authorize('delete', $faculty);

        $creator = $faculty->creator; // 追加: 作成者を取得
        $facultyName = $faculty->name; // 追加: 通知用に学部名を取得

        // 対象の削除依頼があれば取得
        $deletionRequest = DeletionRequest::where('target_type', Faculty::class)
            ->where('target_id', $faculty->id)
            ->first();

        // 追加: 通知送信
        if ($deletionRequest) {
            $requester = $deletionRequest->requester;
            $requester->notify(new DeletionCompletedNotification($faculty->name, '学部'));

            $deletionRequest->processed_by = auth()->id();
            $deletionRequest->status = 'approved';
            $deletionRequest->save();
        }

        $faculty->delete();

        // 追加: 通知送信（作成者へ）
        if ($creator && auth()->id() !== $creator->id) {
            $creator->notify(new ModelChangedNotification(
                'deleted',
                '学部',
                $facultyName
            ));
        }

        return redirect()->route('labs.home')->with('success', '学部が削除されました。');
    }

    public function destroyLab(Lab $lab)
    {
        // 認可チェック
        $this->authorize('delete', $lab);

        $creator = $lab->creator; // 追加: 作成者を取得
        $labName = $lab->name; // 追加: 通知用に研究室名を

        // 対象の削除依頼があれば取得
        $deletionRequest = DeletionRequest::where('target_type', Lab::class)
            ->where('target_id', $lab->id)
            ->first();

        // 通知送信（削除依頼者へ）
        if ($deletionRequest) {
            $requester = $deletionRequest->requester;
            $requester->notify(new DeletionCompletedNotification($lab->name, '研究室'));

            $deletionRequest->processed_by = auth()->id();
            $deletionRequest->status = 'approved';
            $deletionRequest->save();
        }

        $lab->delete();

        // 追加: 通知送信（作成者へ）
        if ($creator && auth()->id() !== $creator->id) {
            $creator->notify(new ModelChangedNotification(
                'deleted',
                '研究室',
                $labName
            ));
        }

        return redirect()->route('labs.home')->with('success', '研究室が削除されました。');
    }

    public function destroyComment(Comment $comment)
    {
        // 認可チェック
        $this->authorize('delete', $comment);

        $comment->delete();
        return redirect()->route('labs.home')->with('success', 'コメントが削除されました。');
    }
}
