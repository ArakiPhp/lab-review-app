<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * ホームページを表示する
     */
    public function home(): Response
    {
        return Inertia::render('Home');
    }
}
