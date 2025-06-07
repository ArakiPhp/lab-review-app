<?php

namespace App\Http\Controllers;

use App\Models\Lab;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LabController extends Controller
{
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

        // 修正: 研究室のデータに加えて、求めたレビューの平均値も一緒に渡す
        return Inertia::render('Lab/Show', [
            'lab' => $lab,
            'overallAverage' => $overallAverage,
            'averagePerItem' => $averagePerItem,
        ]);
    }
}
