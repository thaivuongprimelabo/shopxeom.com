<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Helpers\Utils;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Auth;
use App\Config;
use App\Product;
use App\Constants\Common;
use App\Constants\Status;
use App\Constants\StatusOrders;
use App\Constants\ContactStatus;
use Illuminate\Pagination\Paginator;
use App\Vendor;
use App\Banner;
use App\User;

class ApiController extends Controller {
    
    public $output = ['status' => true, 'data' => [], 'error' => [], 'message' => ''];
    public $rules = [];

    public function lang() {
        $this->output['data'] = trans('react');
        $this->output['data']['messages'] = trans('messages');
        return response()->json($this->output);
    }

    public function getSelectData(Request $request) {
        $key = $request->key;
        $data = [];
        switch($key) {
            case 'status':
                $data = Status::getData();
                break;

            case 'banner_type':
                $bannerType = trans('react.banner_type');
                foreach($bannerType as $key=>$value) {
                    $data[$key] = $value['text'];
                }
                break;
            case 'order_status':
                $data = StatusOrders::getData();
                break;
            case 'contact_type':
                $data = ContactStatus::getData();
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
        
        $niceNames = array(
            'email' => 'E-mail',
            'password' => 'Mật khẩu'
        );
        
        $validator = Validator::make($request->all(), $rules);
        $validator->setAttributeNames($niceNames);
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

        if(in_array($table, \App\Constants\Common::TABLE_LIST)) {
            $model = $this->convertVariableToModelName($table);
            $data = $model::where($wheres)->orderBy('created_at', 'DESC')->paginate(Common::ROW_PER_PAGE);
            $this->output['data'] = $data;
        }

        return response()->json($this->output);
    }
    
    public function save(Request $request) {
        $form = $request->form;
        $table = $request->table;
        $rules = $request->rules;
        $attributes = [];
        $lang = trans('auth.'. $table . '.form');
        foreach($rules as $k=>$l) {
            $attributes[$k] = $lang[$k]['text'];
        }
        
        $validator = Validator::make($form, $rules);
        $validator->setAttributeNames($attributes);
        
        if (!$validator->fails()) {

            try {

                $model = $this->convertVariableToModelName($table);
                
                if(count($form)) {
                    
                    if(isset($form['id'])) {
                        $model = $model::find($form['id']);
                    }
                    
                    foreach($form as $key=>$value) {
                        if($key == 'id') {
                            continue;
                        }
                        
                        $model->$key = Utils::cnvNull($value, 0);
                        if($key == 'name') {
                            $model->name_url = Utils::createNameUrl(Utils::cnvNull($value, 0));
                        }
                    }
                    
                    if(isset($form['id'])) {
                        $model->updated_at = date('Y-m-d H:i:s');
                    } else {
                        $model->created_at = date('Y-m-d H:i:s');
                        $model->updated_at = date('Y-m-d H:i:s');
                    }
                    
                    if($model->save()) {
                        $this->output['data'] = $model;
                        $this->output['message'] = isset($form['id']) ? trans('messages.UPDATE_SUCCESS') : trans('messages.CREATE_SUCCESS');
                    }
                }

            } catch(\Exception $e) {
                $this->output['status'] = false;
                $this->output['message'] = trans('messages.ERROR');
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

    public function remove(Request $request) {
        try {
            $model = $this->convertVariableToModelName($request->table);
            $ids = $request->id;
            if($model->destroy($ids)) {
                $this->output['message'] = trans('messages.REMOVE_SUCCESS');
            }
        } catch(\Exception $e) {
            $this->output['status'] = false;
            $this->output['message'] = trans('messages.ERROR');
        }
        
        return response()->json($this->output);
    }
    
    private function convertVariableToModelName($modelName='', $nameSpace='App') {
        
        if($modelName == \App\Constants\Common::CATEGORIES) {
            $modelName = 'Category';
        } else {
            $modelName = ucfirst($modelName);
            $lastChar = substr($modelName, -1);
            if($lastChar == 's') {
                $modelName = substr($modelName, 0, -1);
            }
        }
        
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
