<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Lab;
use App\Notifications\ModelChangedNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LabController extends Controller
{
    use AuthorizesRequests;

    /**
     * 研究室の詳細を表示する
     */
    public function show(Lab $lab, Request $request): Response
    {
        // 大学・学部、レビューのデータも一緒に渡す
        // universityはfacultyを経由して取得
        $lab->load(['faculty.university', 'reviews']);

        // コメントデータを取得（投稿者情報も含む）
        $comments = $lab->comments()->with('user')->latest()->get();

        // 各評価項目の平均値と総合評価を計算
        $averagePerItem = $lab->getAveragePerItem();
        $overallAverage = $lab->getOverallAverage();

        // 現在のユーザーのレビューを取得
        $userReview = null;
        $userOverallAverage = null;
        
        if (Auth::check()) {
            $userReview = $lab->reviews->where('user_id', Auth::id())->first();
            
            if ($userReview) {
                $userOverallAverage = Lab::getUserReviewAverage($userReview);
            }
        }

        // ユーザーのブックマーク状態を取得
        $userBookmark = $lab->bookmarks()->where('user_id', Auth::id())->first();
        $bookmarkCount = $lab->bookmarks()->count();

        // 検索クエリを取得
        $searchQuery = $request->input('query', '');

        // 研究室のデータに加えて、求めたレビューの平均値とユーザーのレビュー、コメント、ブックマーク、認証情報も一緒に渡す
        return Inertia::render('Lab/Show', [
            'lab' => $lab,
            'overallAverage' => $overallAverage,
            'averagePerItem' => $averagePerItem,
            'userReview' => $userReview,
            'userOverallAverage' => $userOverallAverage,
            'userBookmark' => $userBookmark,
            'bookmarkCount' => $bookmarkCount,
            'query' => $searchQuery,
            'ratingData' => [
                'columns' => Lab::RATING_COLUMNS,
            ],
            'comments' => $comments,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * 新規研究室を作成する
     */
    public function store(Request $request, Faculty $faculty): RedirectResponse
    {
        // 認可
        $this->authorize('create', Lab::class);

        // バリデーション
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:labs,name,NULL,id,faculty_id,' . $faculty->id,
            'description' => 'nullable|string|max:150',
            'url' => 'nullable|url|max:255',
            'professor_name' => 'nullable|string|max:25',
            'professor_url' => 'nullable|url|max:255',
            'gender_ratio_male' => 'required|integer|min:0|max:10',
            'gender_ratio_female' => [
                'required',
                'integer',
                'min:0',
                'max:10',
                function ($attribute, $value, $fail) use ($request) {
                    $male = (int) $request->input('gender_ratio_male', 0);
                    $female = (int) $value;
                    if ($male + $female > 10) {
                        $fail('男女比の合計は10である必要があります。');
                    }
                },
            ],
        ]);
        
        $lab = new Lab();
        $lab->name = $validated['name'];
        $lab->description = $validated['description'];
        $lab->url = $validated['url'];
        $lab->professor_name = $validated['professor_name'];
        $lab->professor_url = $validated['professor_url'];
        $lab->gender_ratio_male = $validated['gender_ratio_male'];
        $lab->gender_ratio_female = $validated['gender_ratio_female'];
        $lab->faculty_id = $faculty->id;
        $lab->created_by = $request->user()->id;
        $lab->save();

        $userId = $request->user()->id;
        $lab->users()->attach($userId);

        return redirect()->route('labs.show', ['lab' => $lab])->with('success', '研究室が作成されました。');
    }

    /**
     * 研究室の一覧を表示する
     */
    public function index(Faculty $faculty, Request $request): Response
    {
        // UIからソート条件を取得
        $sort = $request->query('sort', 'overall');

        $query = $faculty->labs()->withRatingAverages();

        // ソートマップを生成
        $sortMap = ['overall' => 'overall_avg', 'reviews_count' => 'reviews_count'];
        foreach (Lab::RATING_COLUMNS as $column) {
            $sortMap[$column] = "avg_{$column}";
        }

        $sortColumn = $sortMap[$sort] ?? 'overall_avg';

        // 検索クエリを取得
        $searchQuery = $request->input('query', '');

        $labs = $query
            ->orderByRaw("$sortColumn IS NULL")
            ->orderByDesc($sortColumn)
            ->paginate(10)
            ->withQueryString();

        // 各ラボにランク（順位）を追加
        $labs->getCollection()->transform(function ($lab, $index) use ($labs) {
            $lab->rank = ($labs->currentPage() - 1) * $labs->perPage() + $index + 1;
            return $lab;
        });
        
        return Inertia::render('Lab/Index', [
            'labs' => $labs,
            'faculty' => $faculty->load('university'),
            'sort' => $sort,
            'query' => $searchQuery,
        ]);
    }

    /**
     * 研究室情報を更新する
     */
    public function update(Request $request, Lab $lab): RedirectResponse
    {
        $this->authorize('update', Lab::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:labs,name,' . $lab->id . ',id,faculty_id,' . $lab->faculty_id,
            'description' => 'nullable|string|max:150',
            'url' => 'nullable|url|max:255',
            'professor_name' => 'nullable|string|max:25',
            'professor_url' => 'nullable|url|max:255',
            'gender_ratio_male' => 'required|integer|min:0|max:10',
            'gender_ratio_female' => [
                'required',
                'integer',
                'min:0',
                'max:10',
                function ($attribute, $value, $fail) use ($request) {
                    $male = (int) $request->input('gender_ratio_male', 0);
                    $female = (int) $value;
                    if ($male + $female !== 10) {
                        $fail('男女比の合計は10である必要があります。');
                    }
                },
            ],
            'comment' => 'required|string|max:255',
            'version' => 'required|integer',
        ]);

        // 変更前の値を保持（通知用）
        $oldValues = $lab->only(['name']);

        DB::beginTransaction();

        try {
            // 現在のバージョンを取得して比較
            $current = Lab::find($lab->id);
            if ($validated['version'] !== $current->version) {
                throw ValidationException::withMessages([
                    'version' => '他のユーザーがこの研究室情報を更新しました。最新の情報を確認してください。',
                ]);
            }

            // 更新
            $current->name = $validated['name'];
            $current->description = $validated['description'];
            $current->url = $validated['url'];
            $current->professor_name = $validated['professor_name'];
            $current->professor_url = $validated['professor_url'];
            $current->gender_ratio_male = $validated['gender_ratio_male'];
            $current->gender_ratio_female = $validated['gender_ratio_female'];
            $current->version += 1;
            $current->save();

            // 履歴保存
            $userId = $request->user()->id;
            $lab->users()->attach($userId, [
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
                    new ModelChangedNotification('edited', '研究室', $current->name, $current->id, $changes)
                );
            }
        } catch (\Exception $e) {
            Log::error('研究室更新通知の送信に失敗', ['lab_id' => $current->id, 'message' => $e->getMessage()]);
        }

        return redirect()->route('labs.show', ['lab' => $lab])->with('success', '研究室が更新されました。');
    }

    /**
     * 研究室の編集履歴を表示する
     */
    public function history(Lab $lab): Response
    {
        $query = request('query', '');

        $editHistory = $lab->users()
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

        return Inertia::render('Lab/History', [
            'lab' => $lab,
            'editHistory' => $editHistory,
            'query' => $query,
        ]);
    }
}