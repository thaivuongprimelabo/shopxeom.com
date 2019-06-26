<?php

namespace App\Http\Controllers;

use App\Helpers\UploadUtils;
use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        
    }
    
    public function index(Request $request) {
        $object = UploadUtils::getInstance();
        $test = $object->test();
        $test1 = $object->test1();
        
        echo $test . '<br/>';
        echo $test1;
    }
}
