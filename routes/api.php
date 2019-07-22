<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['prefix' => '/v1', 'namespace' => 'Api\V1', 'as' => 'api.'], function () {
    Route::get('/lang', 'ApiController@lang')->name('lang');
    Route::post('/check_login', 'ApiController@checkLogin')->name('checkLogin');
    Route::post('/handle_login', 'ApiController@handleLogin')->name('handleLogin');
    Route::post('/logout', 'ApiController@logout')->name('logout');
    Route::get('/config', 'ApiController@config')->name('config');
    Route::get('/get', 'ApiController@getData')->name('getData');
    Route::get('/get_select_data', 'ApiController@getSelectData')->name('getSelectData');
    Route::post('/save', 'ApiController@save')->name('save');
    Route::post('/remove', 'ApiController@remove')->name('remove');
});

Route::post('/check_exists', 'ApiController@checkExists')->name('check_exists');
Route::post('/update_status', 'ApiController@updateStatus')->name('update_status');
Route::get('/load-city', 'ApiController@loadCity')->name('loadCity');
Route::get('/load-district', 'ApiController@loadDistrict')->name('loadDistrict');
Route::get('/load-ward', 'ApiController@loadWard')->name('loadWard');
Route::post('/check-upload-file', 'ApiController@checkUploadFile')->name('checkUploadFile');
Route::get('/get-select-post', 'ApiController@getSelectPost')->name('getSelectPost');
Route::post('/update-ship-fee', 'ApiController@updateShipFee')->name('updateShipFee');
Route::post('/order-checking', 'ApiController@orderChecking')->name('orderChecking');
Route::post('/backup', 'ApiController@backup')->name('api.backup');
Route::post('/editor', 'ApiController@editor')->name('source.editor');

