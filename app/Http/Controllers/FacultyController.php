<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\University;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
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

        // 追加: 現在ログイン中のユーザーと関連付ける
        $userId = $request->user()->id;
        $faculty->users()->attach($userId);

        return redirect()->route('labs.index', ['faculty' => $faculty])->with('success', '学部が作成されました。'); // 修正: 学部IDを渡す
    }

    public function index(University $university)
    {
        $faculties = $university->faculties()->orderBy('name')->get();
        return Inertia::render('Faculty/Index', [
            'faculties' => $faculties,
            'university' => $university
        ]);
    }

    // 追加
    public function edit(Faculty $faculty)
    {
        $this->authorize('update', Faculty::class);
        return Inertia::render('Faculty/Edit', [
            'faculty' => $faculty,
        ]);
    }

    // 追加
    public function update(Request $request, Faculty $faculty)
    {
        $this->authorize('update', Faculty::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:universities,name,' . $faculty->id,
            'comment' => 'required|string|max:255',
        ]);

        $faculty->name = $validated['name'];
        $faculty->save();

        $userId = $request->user()->id;
        $faculty->users()->attach($userId, [
            'comment' => $validated['comment'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('labs.index', ['faculty' => $faculty])->with('success', '大学情報が更新されました。');
    }

    // 追加
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
