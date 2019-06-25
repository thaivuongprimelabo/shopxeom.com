<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Closure;
use App\Constants\UserRole;

class AccessByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $notAccessByRole = UserRole::notAccessByRole(Auth::user()->role_id);
        $currentRoute = str_replace('auth_', '', Route::currentRouteName());
        
        if(in_array($currentRoute, $notAccessByRole)) {
            return abort(405);
        }
        
        return $next($request);
    }
}
