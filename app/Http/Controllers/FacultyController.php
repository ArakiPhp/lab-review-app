<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\University;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class FacultyController extends Controller
{
    use AuthorizesRequests;

    public function create(University $university)
    {
        $this->authorize('create', Faculty::class);
        return Inertia::render('Faculty/Create', [
            'university' => $university
        ]);
    }

    public function store(Request $request, University $university)
    {
        $this->authorize('create', Faculty::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:faculties,name,NULL,id,university_id,' . $university->id,
        ]);

        $faculty = new Faculty();
        $faculty->name = $validated['name'];
        $faculty->university_id = $university->id;
        $faculty->save();

        $userId = $request->user()->id;
        $faculty->users()->attach($userId);

        return redirect()->route('labs.index', ['faculty' => $faculty])->with('success', '学部が作成されました。');
    }

    public function index(University $university)
    {
        $faculties = $university->faculties()->orderBy('name')->get();
        return Inertia::render('Faculty/Index', [
            'faculties' => $faculties,
            'university' => $university
        ]);
    }

    public function edit(Faculty $faculty)
    {
        $this->authorize('update', Faculty::class);
        return Inertia::render('Faculty/Edit', [
            'faculty' => $faculty,
        ]);
    }

    public function update(Request $request, Faculty $faculty)
    {
        $this->authorize('update', Faculty::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:universities,name,' . $faculty->id,
            'comment' => 'required|string|max:255',
            'version' => 'required|integer',
        ]);

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

            return redirect()->route('labs.index', ['faculty' => $current])->with('success', '大学情報が更新されました。');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function history(Faculty $faculty)
    {
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
        ]);
    }
}
