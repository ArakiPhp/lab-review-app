<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // 未認証ユーザーはホームページにリダイレクト（モーダルでログイン）
        $middleware->redirectGuestsTo('/');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response) {
            if (in_array($response->getStatusCode(), [400, 401, 403, 404, 500, 503])
                && ! app()->runningInConsole()
            ) {
                return \Inertia\Inertia::render('Error', ['status' => $response->getStatusCode()])
                    ->toResponse(request())
                    ->setStatusCode($response->getStatusCode());
            }
            return $response;
        });
    })->create();
