<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Notifications\ModelChangedNotification;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
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
            'type' => 'required|string|in:national,public,private',
        ]);

        $university = new University();
        $university->name = $validated['name'];
        $university->type = $validated['type'];
        $university->created_by = $request->user()->id;
        $university->save();

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
            ->paginate(10) // 10件ずつ表示に変更
            ->withQueryString();

        return Inertia::render('University/Index', [
            'universities' => $universities,
            'query' => $query,
        ]);
    }

    public function edit(University $university)
    {
        $this->authorize('update', University::class);
        return Inertia::render('University/Edit', [
            'university' => $university,
        ]);
    }

    // versionの更新処理・トランザクション処理
    public function update(Request $request, University $university)
    {
        $this->authorize('update', University::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:universities,name,' . $university->id,
            'type' => 'required|string|in:national,public,private',
            'comment' => 'required|string|max:255',
            'version' => 'required|integer',
        ]);

        // トランザクション開始
        DB::beginTransaction();

        try {
            // 他のユーザーが更新している可能性がある
            // そのため、最初に最新の university を取得
            $current = University::find($university->id);

            if ($validated['version'] !== $current->version) {
                throw ValidationException::withMessages([
                    'version' => '他のユーザーがこの大学情報を更新しました。最新の情報を確認してください。',
                ]);
            }

            // データ更新
            $current->name = $validated['name'];
            $current->type = $validated['type'];
            $current->version += 1; // バージョンを1増やす
            $current->save();

            // 履歴保存
            $userId = $request->user()->id;
            $current->users()->attach($userId, [
                'comment' => $validated['comment'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit(); // トランザクション処理終了

            // 作成者へ通知を送信
            if ($userId !== $current->created_by && $current->creator) {
                $changes = collect($current->getChanges())
                    ->only(['name'])
                    ->map(fn($new, $key) => [
                        'old' => $old[$key] ?? null,
                        'new' => $new,
                    ])
                    ->toArray();
    
                $current->creator->notify(
                    new ModelChangedNotification('edited', '大学', $current->name, $changes)
                );
            }

             // リダイレクト
            return redirect()->route('faculties.index', ['university' => $current])->with('success', '大学情報が更新されました。');
        } catch (\Exception $e) {
            DB::rollBack(); // エラー時はロールバック
            throw $e;
        }
    }

    public function history(University $university)
    {
        $query = request('query', '');

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
            'query' => $query,
        ]);
    }
}
