<?php

namespace App\Http\Controllers\Admin; // 名前空間が他のコントローラーと異なり、整理されている

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Faculty;
use App\Models\Lab;
use App\Models\University;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    use AuthorizesRequests;
    
    public function destroyUniversity(University $university)
    {
        // 認可チェック
        $this->authorize('delete', University::class);

        $university->delete();
        return redirect()->route('labs.home')->with('success', '大学が削除されました。');
    }

    public function destroyFaculty(Faculty $faculty)
    {
        // 認可チェック
        $this->authorize('delete', Faculty::class);

        $faculty->delete();
        return redirect()->route('labs.home')->with('success', '学部が削除されました。');
    }

    public function destroyLab(Lab $lab)
    {
        // 認可チェック
        $this->authorize('delete', Lab::class);

        $lab->delete();
        return redirect()->route('labs.home')->with('success', '研究室が削除されました。');
    }

    public function destroyComment(Comment $comment)
    {
        // 認可チェック
        $this->authorize('delete', $comment);

        $comment->delete();
        return redirect()->route('labs.home')->with('success', 'コメントが削除されました。');
    }
}
