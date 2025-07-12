<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UniversityController extends Controller
{
    use AuthorizesRequests;

    public function create()
    {
        $this->authorize('create', University::class);
        return Inertia::render('University/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', University::class);
        
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:universities,name',
        ]);

        $university = new University();
        $university->name = $validated['name'];
        $university->save();

        // 追加: 現在ログイン中のユーザーと関連付ける
        $userId = $request->user()->id;
        $university->users()->attach($userId);

        return redirect()->route('faculties.index', ['university' => $university])->with('success', '大学が作成されました。'); // 修正: リダイレクト先を変更
    }

    public function index(Request $request)
    {
        $query = $request->input('query', '');

        $universities = University::query()
            ->when($query, function ($queryBuilder) use ($query) {
                $queryBuilder->where('name', 'like', '%' . $query . '%');
            })
            ->orderBy('name')
            ->paginate(2)
            ->withQueryString();

        return Inertia::render('University/Index', [
            'universities' => $universities,
            'query' => $query,
        ]);
    }

    // 追加
    public function edit(University $university)
    {
        $this->authorize('update', University::class);
        return Inertia::render('University/Edit', [
            'university' => $university,
        ]);
    }

    // 追加
    public function update(Request $request, University $university)
    {
        $this->authorize('update', University::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:universities,name,' . $university->id,
            'comment' => 'required|string|max:255',
        ]);

        $university->name = $validated['name'];
        $university->save();

        $userId = $request->user()->id;
        $university->users()->attach($userId, [
            'comment' => $validated['comment'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('faculties.index', ['university' => $university])->with('success', '大学情報が更新されました。');
    }

    // 追加
    public function history(University $university)
    {
        $editHistory = $university->users()
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

        return Inertia::render('University/History', [
            'university' => $university,
            'editHistory' => $editHistory,
        ]);
    }
}
