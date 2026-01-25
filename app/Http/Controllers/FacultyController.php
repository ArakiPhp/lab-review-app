<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\University;
use App\Notifications\ModelChangedNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class FacultyController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request, University $university): RedirectResponse
    {
        $this->authorize('create', Faculty::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:faculties,name,NULL,id,university_id,' . $university->id,
        ]);

        $faculty = new Faculty();
        $faculty->name = $validated['name'];
        $faculty->university_id = $university->id;
        $faculty->created_by = $request->user()->id;
        $faculty->save();

        $userId = $request->user()->id;
        $faculty->users()->attach($userId);

        return redirect()->route('labs.index', ['faculty' => $faculty])->with('success', '学部が作成されました。');
    }

    public function index(Request $request, University $university): Response
    {
        $query = $request->input('query', '');
        $faculties = $university->faculties()->get(); // 修正: 名前のソートを削除
        return Inertia::render('Faculty/Index', [
            'faculties' => $faculties,
            'university' => $university,
            'query' => $query,
        ]);
    }

    public function update(Request $request, Faculty $faculty): RedirectResponse
    {
        $this->authorize('update', Faculty::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:universities,name,' . $faculty->id,
            'comment' => 'required|string|max:255',
            'version' => 'required|integer',
        ]);

        // 変更前の値を保持（通知用）
        $oldValues = $faculty->only(['name']);

        // トランザクション
        DB::beginTransaction();

        try {
            // 現在のバージョンを取得して比較
            $current = Faculty::find($faculty->id);
            if ($validated['version'] !== $current->version) {
                throw ValidationException::withMessages([
                    'version' => '他のユーザーがこの学部情報を更新しました。最新の情報を確認してください。',
                ]);
            }

            // 更新
            $current->name = $validated['name'];
            $current->version += 1;
            $current->save();

            // 履歴保存
            $userId = $request->user()->id;
            $current->users()->attach($userId, [
                'comment' => $validated['comment'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        // 作成者へ通知を送信（トランザクション外）
        try {
            if ($userId !== $current->created_by && $current->creator) {
                $changes = collect($current->getChanges())
                    ->only(['name'])
                    ->map(fn($new, $key) => [
                        'old' => $oldValues[$key] ?? null,
                        'new' => $new,
                    ])
                    ->toArray();

                $current->creator->notify(
                    new ModelChangedNotification('edited', '学部', $current->name, $current->id, $changes)
                );
            }
        } catch (\Exception $e) {
            Log::error('学部更新通知の送信に失敗', ['faculty_id' => $current->id, 'message' => $e->getMessage()]);
        }

        return redirect()->route('labs.index', ['faculty' => $current])->with('success', '学部情報が更新されました。');
    }

    public function history(Faculty $faculty): Response
    {
        $query = request('query', '');

        $editHistory = $faculty->users()
            ->withPivot('comment', 'created_at', 'updated_at')
            ->get()
        ->sortByDesc(fn($user) => $user->pivot->updated_at)
        ->values()
        ->map(function ($user) {
            return [
                'user' => $user->name,
                'comment' => $user->pivot->comment,
                'created_at' => $user->pivot->created_at,
                'updated_at' => $user->pivot->updated_at,
            ];
    });

        return Inertia::render('Faculty/History', [
            'faculty' => $faculty,
            'editHistory' => $editHistory,
            'query' => $query,
        ]);
    }
}
