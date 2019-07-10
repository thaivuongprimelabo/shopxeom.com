<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Auth;

class ApiController extends Controller {
    
    public $output = ['status' => true, 'data' => [], 'error' => []];
    public $rules = [];

    public function lang() {
        $this->output['data'] = trans('auth');
        return response()->json($this->output);
    }

    public function checkLogin(Request $request) {
        if(!Auth::guest()) {
            $this->output['status'] = true;
            $this->output['data'] = Auth::user();
            $this->output['data']['avatar'] = Auth::user()->getAvatar();
        } else {
            $this->output['status'] = false;
        }
        return response()->json($this->output);
    }

    public function handleLogin(Request $request) {

        $validator = [];
        $rules = [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ];
        $validator = Validator::make($request->all(), $rules);
            
        if (!$validator->fails()) {
            $userdata = array(
                'email' => $email,
                'password' => $password
            );

            if (Auth::attempt($userdata)) {
                $this->output['data'] = Auth::user();
            } else {
                $this->output['status'] = false;
                $this->output['error']['email'] = trans('auth.failed');
            }
            
        } else {
            $this->output['status'] = false;
            $errors = $validator->errors();
            foreach($errors->getMessages() as $key=>$error) {
                $this->output['error'][$key] = $error[0];
            }
        }
        
        return response()->json($this->output);
    }

    public function logout(Request $request) {
        Auth::guard()->logout();
        
        $request->session()->invalidate();
        
        return response()->json($this->output);
    }

    
}
