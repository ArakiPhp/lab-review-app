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
use Inertia\Response;

class DeletionRequestController extends Controller
{
    /**
     * 削除依頼フォームを表示する
     */
    public function create(string $type, int $id): Response
    {
        $query = request('query', '');

        $model = match ($type) {
            'university' => University::find($id),
            'faculty' => Faculty::find($id),
            'lab' => Lab::find($id),
        };

        $backUrl = match ($type) {
            'university' => route('faculties.index', ['university' => $model->id]),
            'faculty' => route('labs.index', ['faculty' => $model->id]),
            'lab' => route('labs.show', ['lab' => $model->id]),
        };

        return Inertia::render('DeletionRequest/Create', [
            'target' => [
                'id' => $model->id,
                'name' => $model->name,
                'type' => $type,
            ],
            'backUrl' => $backUrl,
            'query' => $query,
        ]);
    }

    /**
    * 削除依頼を保存する
    */
    public function store(Request $request): Response
    {
        $validated = $request->validate([
            'target_id' => 'required|integer',
            'target_type' => 'required|string|in:university,faculty,lab',
            'reason' => 'required|string|max:1000',
        ]);

        $model = match ($validated['target_type']) {
            'university' => University::class,
            'faculty' => Faculty::class,
            'lab' => Lab::class,
        };

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

        return Inertia::render('DeletionRequest/Complete');
    }

    /**
     * 管理者に削除依頼を表示
     */
    public function index(): Response
    {
        abort_unless(auth()->user()->is_admin(), 403);

        $deletionRequests = DeletionRequest::with(['requester', 'target'])
            ->where('status', 'pending')
            ->latest()
            ->get();

        return Inertia::render('DeletionRequest/Index', [
            'deletionRequests' => $deletionRequests,
        ]);
    }
}
