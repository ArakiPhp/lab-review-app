<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class Lab extends Model
{
    use HasFactory, SoftDeletes;

    public const RATING_COLUMNS = [
        'mentorship_style',
        'lab_atmosphere',
        'achievement_activity',
        'constraint_level',
        'facility_quality',
        'work_style',
        'student_balance',
    ];

    protected $fillable = [
        'name',
        'faculty_id',
    ];

    // リレーションの定義
    // ユーザーとのリレーション（多対多）
    // 中間テーブル名を明示的に指定
    public function users()
    {
        return $this->belongsToMany(User::class, 'lab_edit_histories')->withTimestamps();
    }

    // 学部とのリレーション（多対一）
    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }

    // レビューとのリレーション（一対多）
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // コメントとのリレーション（一対多）
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // ブックマークとのリレーション（一対多）
    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    // 削除依頼とのポリモーフィックリレーション(一対多)
    public function deletionRequests()
    {
        return $this->morphMany(DeletionRequest::class, 'target');
    }

    // 追加: 作成者とのリレーション（多対一）
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * 各評価項目のユーザー間の平均値を取得する
     * reviews リレーションがロード済みである前提
     */
    public function getAveragePerItem(): Collection
    {
        return collect(self::RATING_COLUMNS)->mapWithKeys(function ($column) {
            return [$column => $this->reviews->avg($column)];
        });
    }

    /**
     * 全評価項目の総合平均値を取得する
     */
    public function getOverallAverage(): ?float
    {
        return $this->getAveragePerItem()->avg();
    }

    /**
     * 特定レビューの全評価項目の平均値を取得する
     */
    public static function getUserReviewAverage(Review $review): ?float
    {
        return collect(self::RATING_COLUMNS)
            ->map(fn($column) => $review->$column)
            ->filter(fn($value) => $value !== null)
            ->avg();
    }

    /**
     * overall_avg, avg_{col}, reviews_count を動的属性としてセットする
     * MyPageController 等でコレクション内の各 Lab に付与する用途
     */
    public function appendRatingAverages(): self
    {
        $averagePerItem = $this->getAveragePerItem();

        $this->overall_avg = $averagePerItem->avg();
        foreach (self::RATING_COLUMNS as $column) {
            $this->{"avg_{$column}"} = $averagePerItem[$column];
        }
        $this->reviews_count = $this->reviews->count();

        return $this;
    }

    /**
     * 一覧表示用: 各評価項目の平均・総合評価・レビュー数をクエリに付与するスコープ
     */
    public function scopeWithRatingAverages(Builder $query): Builder
    {
        $query->select('labs.*')->withCount('reviews');

        foreach (self::RATING_COLUMNS as $column) {
            $query->withAvg("reviews as avg_{$column}", $column);
        }

        $avgSum = implode(' + ', array_map(fn($c) => "AVG($c)", self::RATING_COLUMNS));
        $count = count(self::RATING_COLUMNS);

        $query->addSelect([
            'overall_avg' => Review::query()
                ->selectRaw("($avgSum) / $count")
                ->whereColumn('reviews.lab_id', 'labs.id'),
        ]);

        return $query;
    }
}
