<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Helpers\SourceUtils;

class EditorController extends AppController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
    
    public function index(Request $request) {
        return view('auth.editor.index', $this->doSearch($request));
    }
}
