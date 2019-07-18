<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Auth;
use App\Config;
use App\Product;
use App\Constants\Common;
use App\Constants\Status;
use Illuminate\Pagination\Paginator;
use App\Vendor;
use App\Banner;
use App\User;

class ApiController extends Controller {
    
    public $output = ['status' => true, 'data' => [], 'error' => []];
    public $rules = [];

    public function lang() {
        $this->output['data'] = trans('react');
        return response()->json($this->output);
    }

    public function getSelectData(Request $request) {
        $key = $request->key;
        $data = [];
        switch($key) {
            case 'status':
                $data = Status::getData();
                break;

            default:
                $data = collect(DB::table($key)->select('id', 'name')->where('status', Status::ACTIVE)->get()->toArray())->pluck('name', 'id')->toArray();
                break;
        }

        $this->output['data'] = $data;

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
                'email' => $request->email,
                'password' => $request->password
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

    public function config(Request $request) {
        $this->output['data'] = Config::first();

        return response()->json($this->output);
    }

    public function getData(Request $request) {
        $table = $request->table;
        $searchCondition = json_decode($request->searchCondition, true);
        $wheres = [];
        if(is_array($searchCondition) && count($searchCondition)) {
            foreach($searchCondition as $key=>$value) {
                switch($key) {
                    case 'name':
                        array_push($wheres, [$key, 'LIKE', '%' . $value . '%']);
                        break;
                    default:
                        array_push($wheres, [$key, '=', $value]);
                        break;
                }
                
            }
        }
        
        $model = ucfirst($table);
        $lastChar = substr($table, -1);
        if($lastChar == 's') {
            $model = substr($model, 0, -1);
        }
        
        $model = $this->convertVariableToModelName($model);
        $data = $model::where($wheres)->orderBy('created_at', 'DESC')->paginate(Common::ROW_PER_PAGE);
        $this->output['data'] = $data;

        return response()->json($this->output);
    }
    
    private function convertVariableToModelName($modelName='', $nameSpace='App') {
        if (empty($nameSpace) || is_null($nameSpace) || $nameSpace === "")
        {
            $modelNameWithNameSpace = "App".'\\'.$modelName;
            return app($modelNameWithNameSpace);
        }
        
        if (is_array($nameSpace))
        {
            $nameSpace = implode('\\', $nameSpace);
            $modelNameWithNameSpace = $nameSpace.'\\'.$modelName;
            return app($modelNameWithNameSpace);
        }elseif (!is_array($nameSpace))
        {
            $modelNameWithNameSpace = $nameSpace.'\\'.$modelName;
            return app($modelNameWithNameSpace);
        }
    }
}
