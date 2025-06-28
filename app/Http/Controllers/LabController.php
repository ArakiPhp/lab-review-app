<?php

namespace App\Http\Controllers;

use App\Models\Faculty; // 追加
use App\Models\Lab;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // 追加
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LabController extends Controller
{
    use AuthorizesRequests; // 追加
    
    public function index()
    {
        $labs = Lab::all();
        return Inertia::render('Lab/Index', [
            'labs' => $labs,
        ]);
    }

    public function show(Lab $lab)
    {
        // 大学・学部、レビューのデータも一緒に渡す
        // universityはfacultyを経由して取得
        $lab->load(['faculty.university', 'reviews']);

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

        // 研究室のデータに加えて、求めたレビューの平均値とユーザーのレビューも一緒に渡す
        return Inertia::render('Lab/Show', [
            'lab' => $lab,
            'overallAverage' => $overallAverage,
            'averagePerItem' => $averagePerItem,
            'userReview' => $userReview,
            'userOverallAverage' => $userOverallAverage,
            'ratingData' => [
                'columns' => $ratingColumns,
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
        $lab->save();

        return redirect('/')->with('success', '研究室が作成されました。');
    }
}