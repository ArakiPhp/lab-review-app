<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\Lab;
use App\Models\Review;
use App\Notifications\ModelChangedNotification;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LabController extends Controller
{
    use AuthorizesRequests;

    public function show(Lab $lab, Request $request)
    {
        // 大学・学部、レビューのデータも一緒に渡す
        // universityはfacultyを経由して取得
        $lab->load(['faculty.university', 'reviews']);

        // コメントデータを取得（投稿者情報も含む）
        $comments = $lab->comments()->with('user')->latest()->get();

        // 平均値を計算するために、評価項目のカラム名を定義
        $ratingColumns = [
            'mentorship_style',
            'lab_atmosphere',
            'achievement_activity',
            'constraint_level',
            'facility_quality',
            'work_style',
            'student_balance',
        ];

        // 1. 各評価項目のユーザー間の平均値 (Average per Item) を計算
        $averagePerItem = collect($ratingColumns)->mapWithKeys(function ($column) use ($lab) {
            // 各評価項目の平均を計算（全レビューを対象）
            return [$column => $lab->reviews->avg($column)];
        });

        // 2. 新しい「総合評価」：各項目の平均値のさらに平均を計算
        // $averagePerItem の値（平均点）をコレクションとして取り出し、その平均を求める
        $overallAverage = $averagePerItem->avg();

        // 3. 現在のユーザーのレビューを取得
        $userReview = null;
        $userOverallAverage = null;
        
        if (Auth::check()) {
            $userReview = $lab->reviews->where('user_id', Auth::id())->first();
            
            // ユーザーのレビューが存在する場合、個別の総合評価を計算
            if ($userReview) {
                $userRatings = collect($ratingColumns)->map(function ($column) use ($userReview) {
                    return $userReview->$column;
                })->filter(function ($value) {
                    return $value !== null;
                });
                
                $userOverallAverage = $userRatings->avg();
            }
        }

        // ユーザーのブックマーク状態を取得
        $userBookmark = $lab->bookmarks()->where('user_id', Auth::id())->first();
        $bookmarkCount = $lab->bookmarks()->count();

        // 研究室のデータに加えて、求めたレビューの平均値とユーザーのレビュー、コメント、ブックマーク、認証情報も一緒に渡す
        return Inertia::render('Lab/Show', [
            'lab' => $lab,
            'overallAverage' => $overallAverage,
            'averagePerItem' => $averagePerItem,
            'userReview' => $userReview,
            'userOverallAverage' => $userOverallAverage,
            'userBookmark' => $userBookmark,
            'bookmarkCount' => $bookmarkCount,
            'ratingData' => [
                'columns' => $ratingColumns,
            ],
            'comments' => $comments,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function create(Faculty $faculty)
    {
        // 認可
        $this->authorize('create', Lab::class);

        // 学部に紐づく大学の情報を取得
        $university = $faculty->university;

        // Inertiaを使ってLabの作成ページを表示
        return Inertia::render('Lab/Create', [
            'faculty' => $faculty,
            'university' => $university,
        ]);
    }

    public function store(Request $request, Faculty $faculty)
    {
        // 認可
        $this->authorize('create', Lab::class);

        // バリデーション
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:labs,name,NULL,id,faculty_id,' . $faculty->id,
            'description' => 'nullable|string|max:500',
            'url' => 'nullable|url|max:255',
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
        $lab->professor_url = $validated['professor_url'];
        $lab->gender_ratio_male = $validated['gender_ratio_male'];
        $lab->gender_ratio_female = $validated['gender_ratio_female'];
        $lab->faculty_id = $faculty->id;
        $lab->created_by = $request->user()->id; // 追加: 作成者のIDを設定
        $lab->save();

        $userId = $request->user()->id;
        $lab->users()->attach($userId);

        return redirect()->route('labs.show', ['lab' => $lab])->with('success', '研究室が作成されました。');
    }

    public function index(Faculty $faculty, Request $request)
    {
        // 評価項目のカラム名を定義
        $ratingColumns = [
            'mentorship_style',
            'lab_atmosphere',
            'achievement_activity',
            'constraint_level',
            'facility_quality',
            'work_style',
            'student_balance',
        ];

        // UIからソート条件を取得
        $sort = $request->query('sort', 'overall');

        // 各評価項目の平均値を計算するためのSQL断片を作成
        $avgSum = implode(' + ', array_map(fn($c) => "AVG($c)", $ratingColumns));
        $count = count($ratingColumns);

        $query = $faculty->labs()
            ->select('labs.*')
            ->withCount('reviews');

        // 各項目の平均を追加
        foreach ($ratingColumns as $column) {
            $query->withAvg("reviews as avg_{$column}", $column);
        }

        // 総合評価を追加
        $query->addSelect([
            'overall_avg' => Review::query()
                ->selectRaw("($avgSum) / $count")
                ->whereColumn('reviews.lab_id', 'labs.id'),
        ]);

        // ソートマップも $ratingColumns から生成
        $sortMap = ['overall' => 'overall_avg', 'reviews_count' => 'reviews_count'];
        foreach ($ratingColumns as $column) {
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

    public function edit(Lab $lab)
    {
        // 認可
        $this->authorize('update', $lab);

        $lab->load('faculty.university');

        // Labの編集ページを表示
        return Inertia::render('Lab/Edit', [
            'lab' => $lab->load('faculty.university'),
            'faculty' => $lab->faculty,
            'university' => $lab->faculty->university,
        ]);
    }

    public function update(Request $request, Lab $lab)
    {
        $this->authorize('update', Lab::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:labs,name,' . $lab->id . ',id,faculty_id,' . $lab->faculty_id,
            'description' => 'nullable|string|max:500',
            'url' => 'nullable|url|max:255',
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
            $current->professor_url = $validated['professor_url'];
            $lab->gender_ratio_male = $validated['gender_ratio_male'];
            $lab->gender_ratio_female = $validated['gender_ratio_female'];
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

            // 追加: 作成者へ通知を送信
            if ($userId !== $current->created_by && $current->creator) {
                $changes = collect($current->getChanges())
                    ->only(['name','description','url','professor_url'])
                    ->map(fn($new, $key) => [
                        'old' => $old[$key] ?? null,
                        'new' => $new,
                    ])
                    ->toArray();

                $current->creator->notify(
                    new ModelChangedNotification('edited', '研究室', $current->name, $changes)
                );
            }
            
            return redirect()->route('labs.show', ['lab' => $lab])->with('success', '研究室が更新されました。');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function history(Lab $lab)
    {
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
        ]);
    }
}