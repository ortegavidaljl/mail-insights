<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\DomainController;

// XRay related routes

Route::prefix('x-ray')->group(function () {
    Route::post('/account', [AccountController::class, 'store']);
    Route::get('/account/{name}', [AccountController::class, 'check']);
    //Route::get('/', [AccountController::class, 'index']);
    //Route::delete('/{id}', [AccountController::class, 'destroy']);

    Route::get('/report/{id}', [ReportController::class, 'show']);
});

Route::prefix('presence')->group(function () {
    Route::get('/{name}', [AccountController::class, 'check_existence']);
});


// Domain related routes
//Route::get('/domain/{name}', [DomainController::class, 'rdapLookup']);
//Route::get('/domain/{name}/{dns_rr}', [DomainController::class, 'dnsLookup']);

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
