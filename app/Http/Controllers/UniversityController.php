<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
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
        ]);

        $university = new University();
        $university->name = $validated['name'];
        $university->save();

        return redirect('/')->with('success', '大学が作成されました。'); // 一時的にトップ画面にリダイレクト
    }
}
