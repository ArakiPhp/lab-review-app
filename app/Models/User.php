<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin', // 管理者フラグ
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // 管理者かどうかを判定するメソッド
    public function is_admin()
    {
        return $this->is_admin;
    }

    // リレーションの定義
    // 大学とのリレーション（多対多）
    // 中間テーブル名を明示的に指定
    public function universities()
    {
        return $this->belongsToMany(University::class, 'university_edit_histories')->withTimestamps();
    }

    // 学部とのリレーション（多対多）
    // 中間テーブル名を明示的に指定
    public function faculties()
    {
        return $this->belongsToMany(Faculty::class, 'faculty_edit_histories')->withTimestamps();
    }

    // 研究室とのリレーション（多対多）
    // 中間テーブル名を明示的に指定
    public function labs()
    {
        return $this->belongsToMany(Lab::class, 'lab_edit_histories')->withTimestamps();
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

    // 通知とのリレーション（一対多）
    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')->latest();
    }
}
