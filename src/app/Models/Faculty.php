<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faculty extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'university_id'
    ];

    /**
     * 論理削除時に関連する研究室も論理削除するように設定
     */
    protected static function boot(): void
    {
        parent::boot();

        static::deleting(function ($faculty) {
            // 論理削除時に関連する研究室も論理削除
            $faculty->labs()->get()->each->delete();
        });
    }

    // リレーションの定義
    /**
     * ユーザーとのリレーション（多対多）
     *
     * 中間テーブル名を明示的に指定
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'faculty_edit_histories')->withTimestamps();
    }

    /**
     * 大学とのリレーション（多対一）
     */
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    /**
     * 研究室とのリレーション（一対多）
     */
    public function labs(): HasMany
    {
        return $this->hasMany(Lab::class);
    }

    /**
     * 削除依頼とのポリモーフィックリレーション（一対多）
     */
    public function deletionRequests(): MorphMany
    {
        return $this->morphMany(DeletionRequest::class, 'target');
    }

    /**
     * 作成者とのリレーション（多対一）
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
