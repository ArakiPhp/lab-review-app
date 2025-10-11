<?php

namespace App\Http\Controllers;

use App\Models\DeletionRequest;
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\University;
use App\Models\User;
use App\Notifications\DeletionRequestNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeletionRequestController extends Controller
{
    // 一般ユーザーが削除依頼を作成するためのフォーム表示
    public function create(string $type, int $id)
    {
        $model = match ($type) {
            'university' => University::find($id),
            'faculty' => Faculty::find($id),
            'lab' => Lab::find($id),
            default => null,
        };

        if (!$model) {
            return redirect()->back()->withErrors(['target' => '対象が見つかりませんでした。']);
        }

        return Inertia::render('DeletionRequest/Create', [
            'target' => [
                'id' => $model->id,
                'name' => $model->name,
                'type' => $type,
            ]
        ]);
    }

    // 削除依頼の保存
    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_id' => 'required|integer',
            'target_type' => 'required|string|in:university,faculty,lab',
            'reason' => 'nullable|string|max:1000',
        ]);

        $model = match ($validated['target_type']) {
            'university' => University::class,
            'faculty' => Faculty::class,
            'lab' => Lab::class,
            default => null,
        };

        if (!$model || !$model::find($validated['target_id'])) {
            return redirect()->back()->withErrors(['target_id' => '無効な対象IDです。']);
        }

        $deletionRequests = new DeletionRequest();
        $deletionRequests->requested_by = $request->user()->id;
        $deletionRequests->target_id = $validated['target_id'];
        $deletionRequests->target_type = $model;
        $deletionRequests->reason = $validated['reason'] ?? null;
        $deletionRequests->status = 'pending';

        $deletionRequests->save();

        $admins = User::where('is_admin', true)->get();

        foreach ($admins as $admin) {
            $admin->notify(new DeletionRequestNotification(
                $model::find($validated['target_id'])->name,
                $validated['target_type'],
                $validated['target_id']
            ));
        }

        return redirect()->route('mypage.index')->with('success', '削除依頼が送信されました。');
    }

    // 管理者に削除依頼を表示
    public function index()
    {
        $deletionRequests = DeletionRequest::with(['requester', 'target'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('DeletionRequest/Index', [
            'deletionRequests' => $deletionRequests,
        ]);
    }
}
