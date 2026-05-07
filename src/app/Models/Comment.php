<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lab_id',
        'content',
    ];

    // リレーションの定義
    /**
     * ユーザーとのリレーション（多対一）
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * 研究室とのリレーション（多対一）
     */
    public function lab(): BelongsTo
    {
        return $this->belongsTo(Lab::class);
    }
}
