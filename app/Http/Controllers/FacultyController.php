<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\University;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FacultyController extends Controller
{
    use AuthorizesRequests;

    public function create(University $university)
    {
        $this->authorize('create', Faculty::class);
        return Inertia::render('Faculty/Create', [
            'university' => $university
        ]);
    }

    public function store(Request $request, University $university)
    {
        $this->authorize('create', Faculty::class);

        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:faculties,name,NULL,id,university_id,' . $university->id,
        ]);

        $faculty = new Faculty();
        $faculty->name = $validated['name'];
        $faculty->university_id = $university->id;
        $faculty->save();

        return redirect('/')->with('success', '学部が作成されました。');
    }
}
