<?php

namespace App\Helpers;

use App\Constants\Common;
use App\Constants\ContactStatus;
use App\Constants\ProductStatus;
use App\Constants\Status;
use App\Constants\StatusOrders;
use App\Constants\UserRole;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class FormGenerate {
    
    private $config = null;
    
    public static $instance;
    
    private function __construct() {}
    
    public static function getInstance($config) {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        
        self::$instance->setConfig($config);
        
        return self::$instance;
    }
    
    public function setConfig($config) {
        $this->config = $config;
    }
    
    
    public function makeList($name, $data = null) {
        
        $html = '';
        
        $routes = Route::getRoutes();
        
        $table_info = trans('auth.' . $name . '.table_header');
        
        if(!is_array($table_info)) {
            return '';
        }
        
        $data_count = $data->count();
        $footers = [];
        if(count($table_info)) {
            $colWidth = '<col width="3%">';
            $thead = '<thead><tr><th><input type="checkbox" id="select_all" /></th>';
            $number_col = 0;
            foreach($table_info as $key=>$info) {
                if(isset($info['tfoot'])) {
                    $footers[$key] = $info;
                    continue;
                }
                if(isset($info['hide'])) {
                    continue;
                }
                $colWidth .= '<col width="' . $info['width'] . '">';
                $thead .= '<th>' . $info['text'] . '</th>';
                $number_col++;
                
            }
            $thead .= '</thead></tr>';
            
            $tbody = '<tbody><tr align="center"><td colspan="' . $number_col . '">' . trans('auth.no_data_found') .'</td></tr>';
            if($data_count) {
                $tbody = '<tbody>';
                foreach($data as $item) {
                    $tbody .= '<tr>';
                    $tbody .= '<td><input type="checkbox" class="row-delete" value="' . $item->id .'" /></td>';
                    foreach($table_info as $key=>$info) {
                        if(isset($info['tfoot']) == 'tfoot') {
                            continue;
                        }
                        
                        $type = isset($info['type']) ? $info['type'] : '';
                        $value = isset($item[$key]) ? $item[$key] : '';
                        
                        if($key == 'created_at' || $key == 'updated_at') {
                            $type = 'datetime';
                        }
                        
                        if($key == 'remove_action' || $key == 'edit_action') {
                            $type = 'link_action';
                        }
                        
                        if(strpos($key, 'status') !== FALSE || $key == 'product_avail_flg' || $key == 'role_id') {
                            $type = 'label';
                        }
                        
                        if($key == 'photo' || $key == 'logo' || $key == 'banner' || $key == 'image' || $key == 'images' || $key == 'avatar') {
                            $type = 'image';
                        }
                        
                        $tdElement = '<td>' . $value . '</td>';
                        switch($type) {
                            case 'download':
                                $tdElement = '<td><a href="' . route('auth_backup_download', ['file_download' => $value]) . '">' . $value . '</a></td>';
                                break;
                                
                            case 'link':
                                $tdElement = '<td><a href="' . $value . '" target="_blank">' . $value . '</a></td>';
                                break;
                                
                            case 'image':
                                if(strlen($value) == 0) {
                                    $value = Common::NO_IMAGE_FOUND;
                                }
                                $tdElement = '<td><img src="' . Utils::getImageLink($value) . '" style="max-width:150px;max-height:200px" class="img img-thumbnail" /></td>';
                                switch($key) {
                                    case 'banner':
                                        if($item['select_type'] == 'use_youtube') {
                                            $tdElement = '<td><img src="http://img.youtube.com/vi/' . $item->youtube_id . '/0.jpg"  style="max-width:150px;max-height:200px" class="img img-thumbnail" /></td>';
                                        }
                                        break;
                                    case 'image':
                                    case 'images':
                                        $tdElement = '<td><img src="' . $item->getFirstImage('small') . '" style="max-width:50px;max-height:200px" class="img img-thumbnail" /></td>';
                                        break;
                                }
                                break;
                                
                            case 'label':
                                switch($key) {
                                    case 'backup_status':
                                        $label = '<span class="label label-success">' . trans('auth.status.backup_success') . '</span>';
                                        if($item->status == BackupGenerate::BACKUP_FAILED) {
                                            $label = '<span class="label label-danger">' . trans('auth.status.backup_success') . '</span>';
                                        }
                                        
                                        if($item->status == BackupGenerate::BACKUP_FAILED_MAIL) {
                                            $label = '<span class="label label-danger">' . trans('auth.status.backup_failed_mail') . '</span>';
                                        }
                                        
                                        if($item->status == BackupGenerate::BACKUP_FAILED_CREATE_ZIP) {
                                            $label = '<span class="label label-danger">' . trans('auth.status.backup_failed_create_zip') . '</span>';
                                        }
                                        
                                        $tdElement = '<td>' . $label . '</td>';
                                        break;
                                        
                                    case 'status':
                                        $label = '<span class="label label-danger">' . trans('auth.status.unactive') . '</span>';
                                        if($item->status == Status::ACTIVE) {
                                            $label = '<span class="label label-success">' . trans('auth.status.active') . '</span>';
                                        }
                                        $tdElement = '<td><a href="javascript:void(0)" class="update-status" data-key="' . $name . '" data-id="' . $item->id . '" data-status="' . $item->status . '">' . $label . '</a></td>';
                                        break;
                                    case 'product_status':
                                        $label = '<span class="label label-success">' . trans('auth.status.active') . '</span>';
                                        if($item->status == Status::UNACTIVE) {
                                            $label = '<span class="label label-danger">' . trans('auth.status.unactive') . '</span>';
                                        }
                                        $tdElement = '<td><a href="javascript:void(0)" class="update-status"  data-key="' . $name . '" data-id="' . $item->id . '" data-status="' . $item->status . '">' . $label . '</a></td>';
                                        break;
                                        
                                    case 'product_avail_flg':
                                        $label = '<span class="label label-success">' . trans('auth.status.available') . '</span>';
                                        if($item->avail_flg == ProductStatus::OUT_OF_STOCK) {
                                            $label = '<span class="label label-danger">' . trans('auth.status.out_of_stock') . '</span>';
                                        }
                                        $tdElement = '<td><a href="javascript:void(0)" class="update-status" data-key="PRODUCT_AVAIL_FLG" data-id="' . $item->id . '" data-status="' . $item->avail_flg . '">' . $label . '</a></td>';
                                        break;
                                        
                                    case 'contact_status':
                                        $label = '<span class="label label-primary">' . trans('auth.status.new') . '</span>';
                                        if($item->status == Status::ACTIVE) {
                                            $label = '<span class="label label-success">' . trans('auth.status.replied') . '</span>';
                                        }
                                        $tdElement = '<td><a href="javascript:void(0)" class="update-status" data-id="' . $item->id . '" data-status="' . $item->status . '">' . $label . '</a></td>';
                                        break;
                                        
                                    case 'order_status':
                                        $label = '<span class="label label-primary">' . trans('auth.status.order_new') . '</span>';
                                        if($item->status == StatusOrders::ORDER_SHIPPING) {
                                            $label = '<span class="label label-warning">' . trans('auth.status.order_shipping') . '</span>';
                                        }
                                        if($item->status == StatusOrders::ORDER_DONE) {
                                            $label = '<span class="label label-success">' . trans('auth.status.order_done') . '</span>';
                                        }
                                        if($item->status == StatusOrders::ORDER_CANCEL) {
                                            $label = '<span class="label label-danger">' . trans('auth.status.order_cancel') . '</span>';
                                        }
                                        
                                        $tdElement = '<td>' . $label . '</td>';
                                        break;
                                        
                                    case 'role_id':
                                        
                                        $label = '<span class="label label-primary">' . trans('auth.role.super_admin') . '</span>';
                                        
                                        if($item->role_id == UserRole::ADMIN) {
                                            $label = '<span class="label label-warning">' . trans('auth.role.admin') . '</span>';
                                        }
                                        
                                        if($item->role_id == UserRole::MOD) {
                                            $label = '<span class="label label-warning">' . trans('auth.role.mod') . '</span>';
                                        }
                                        
                                        if($item->role_id == UserRole::MEMBERS) {
                                            $label = '<span class="label label-default">' . trans('auth.role.member') . '</span>';
                                        }
                                        
                                        $tdElement = '<td><a href="javascript:void(0)">' . $label . '</a></td>';
                                        break;
                                        
                                }
                                break;
                                
                            case 'currency':
                                $tdElement = '<td>' . Utils::formatCurrency($value) . '</td>';
                                break;
                                
                            case 'datetime':
                                $tdElement = '<td>' . Utils::formatDate($value) . '</td>';
                                break;
                                
                            case 'link_action':
                                switch($key) {
                                    case 'remove_action':
                                        $route = 'auth_' . $name . '_remove';
                                        if($routes->hasNamedRoute($route)) {
                                            $url = route('auth_' . $name . '_remove');
                                            $tdElement = '<td align="center"><a href="javascript:void(0)" data-id="' . $item->id . '" data-url="' . $url . '" class="remove-row" title="Remove"><i class="fa fa-trash" aria-hidden="true" style="font-size: 24px"></i></a></td>';
                                        }
                                        break;
                                        
                                    case 'edit_action':
                                        $route = 'auth_' . $name . '_edit';
                                        if($routes->hasNamedRoute($route)) {
                                            $url = route('auth_' . $name . '_edit',['id' => $item->id]);
                                            $tdElement = '<td align="center"><a href="javascript:void(0)" data-url="' . $url . '" class="edit" title="Edit"><i class="fa fa-edit" aria-hidden="true" style="font-size: 24px"></i></a></td>';
                                        }
                                        break;
                                }
                                
                                break;
                                
                            default:
                                switch($key) {
                                    case 'parent_cate':
                                    case 'parent_postgroup':
                                        $tdElement = '<td>' . $item->getParentName() . '</td>';
                                        break;
                                    case 'category':
                                        $tdElement = '<td>' . $item->getCategoryName() . '</td>';
                                        break;
                                    case 'vendor':
                                        $tdElement = '<td>' . $item->getVendorName() . '</td>';
                                    case 'size':
                                        $tdElement = '<td>' . Utils::formatMemory($value) . '</td>';
                                        break;
                                }
                                break;
                        }
                        
                        $tbody .= $tdElement;
                    }
                    
                    $tbody .= '</tr>';
                }
            }
            
            $tbody .= '</tbody>';
            $tfoot = '';
            if(count($footers)) {
                $tfoot = '<tfoot>';
                foreach($footers as $key=>$foot) {
                    $tfoot .= '<tr><th class="empty" colspan="' . $foot['colspan'] . '"></th><th>' . $foot['text'] . '</th><th class="sub-total"> ' . Utils::formatCurrency($otherData->$key) . '</th></tr>';
                }
                $tfoot .= '</tfoot>';
            }
        }
        
        return view('helpers.form_generate.table_list', compact('colWidth', 'thead', 'tbody', 'tfoot'))->render();
    }
    
    /**
     * makeForm
     */
    public function makeForm($name, $data = null) {
        $output = '';
        $auth_form = trans('auth.' . $name);
        
        if(isset($auth_form['tab_form'])) {
            $tabForms = $auth_form['tab_form'];
            $tabHeader = '';
            $tabContent = '';
            $tabFooter = '';
            $tabActive = $name == 'banners' && !is_null($data) ? $data['select_type'] : key($tabForms);
            $notAccessTabByRole = UserRole::notAccessTabByRole(Auth::user()->role_id);
            foreach($tabForms as $id => $forms) {
                
                if(!in_array('*', $notAccessTabByRole) && in_array($id, $notAccessTabByRole)) {
                    continue;
                }
                
                if(isset($forms['title'])) {
                    
                    $tabHeader .= '<li class="' . ($id == $tabActive ? 'active' : '') . '" data-tab="' . $id . '">';
                    $tabHeader .= '<a href="#' . $id . '" data-toggle="tab" aria-expanded="true"> '. $forms['title'];
                    $tabHeader .= '</a>';
                    $tabHeader .= '</li>';
                    
                    $tabContent .= '<div class="tab-pane ' . ($id == $tabActive ? 'active' : '') . '" id="' . $id . '">';
                    if(isset($forms['view'])) {
                        $tabContent .= view($forms['view'], compact('data'))->render();
                    } else {
                        foreach($forms as $key => $formItem) {
                            if($key == 'title') {
                                continue;
                            }
                            $column = $formItem['type'] == 'file_simple' || $formItem['type'] == 'file_multiple' ? str_replace('upload_', '', $key) : $key;
                            if(!is_null($data) && isset($data[$column])) {
                                $formItem['value'] = $data[$column];
                            }
                            
                            $tabContent .= $this->createElement($key, $formItem, $data);
                        }
                    }
                    $tabContent .= '</div>';
                } else {
                    $tabFooter .= $this->createElement($id, $forms, $data);
                }
                
            }
            
            $tabFooter .= view('auth.common.button_footer', ['name' => $name, 'back_url' => route('auth_' . $name), 'data' => $data])->render();
            $output .= '<div class="nav-tabs-custom"><ul class="nav nav-tabs">';
            $output .= $tabHeader;
            $output .= '</ul>';
            $output .= '<div class="tab-content">';
            $output .= $tabContent;
            $output .= '</div>';
            $output .= $tabFooter;
            $output .= '</div>';
            
        } else {
            $forms = $auth_form['form'];
            $length = count($forms);
            if($length) {
                $header = !is_null($data) ? trans('auth.edit_box_title') : trans('auth.create_box_title');
                $header = isset($forms['header']) ? $forms['header'] : $header;
                $output = '<div class="box box-primary">';
                $output .= '<div class="box-header with-border"><h3 class="box-title">' . $header . '</h3></div>';
                $output .= '<div class="box-body">';
                foreach($forms as $key => $formItem) {
                    $value = '';
                    $column = str_replace('upload_', '', $key);
                    if(!is_null($data) && isset($data[$column])) {
                        $formItem['value'] = $data[$column];
                    }
                    $output .= $this->createElement($key, $formItem, $data);
                }
                $output .= '</div>';
                $output .= view('auth.common.button_footer', ['name' => $name, 'back_url' => route('auth_' . $name), 'data' => $data])->render();
                $output .= '</div>';
            }
        }
        
        return $output;
    }
    
    /**
     * createElement
     */
    public function createElement($key, $formItem, $data = null) {
        $element = '';
        if(!isset($formItem['type'])) {
            return $element;
        }
        
        $view           = '';
        $type           = $formItem['type'];
        $text           = isset($formItem['text']) ? $formItem['text'] : '';
        $placeholder    = isset($formItem['placeholder']) ? $formItem['placeholder'] : $text;
        $value          = isset($formItem['value']) ? $formItem['value'] : '';
        $maxlength      = isset($formItem['maxlength']) ? 'maxlength=' . $formItem['maxlength'] : '';
        $disable        = isset($formItem['disabled']) ? 'disabled=' . $formItem['disabled'] : '';
        $checked        = isset($formItem['checked']) ? 'checked="checked"': '';
        $table          = isset($formItem['table']) ? $formItem['table'] : '';
        $empty_text     = isset($formItem['empty_text']) ? $formItem['empty_text'] : '';
        $arrParams      = compact('key', 'placeholder', 'text', 'value', 'maxlength', 'disable', 'checked');
        
        $smallText = '';
        if(!Utils::blank($maxlength)) {
            $maxlengthValue = isset($formItem['maxlength']) ? $formItem['maxlength'] : '';
            $smallText = str_replace('{0}', $maxlengthValue, trans('auth.length_text'));
            $smallText = '<small>' . $smallText . '</small>';
        }
        
        $element        = '<div class="form-group">';
        
        switch($type) {
            
            case 'email':
                $view = 'helpers.form_generate.email';
                break;
                
            case 'password':
                $view = 'helpers.form_generate.password';
                break;
                
            case 'address':
            case 'hotline':
                $value = explode('|', $value);
                $arrParams['value']  = $value;
                $view = 'helpers.form_generate.address_hotline';
                break;
                
            case 'link_to_post':
                $view = 'helpers.form_generate.link_to_post';
                break;
            case 'hidden':
                $arrParams['id']     = $key;
                $arrParams['value']  = $value;
                $view = 'helpers.form_generate.hidden';
                break;
            case 'text':
                $view = 'helpers.form_generate.textbox';
                if($key == 'youtube_id') {
                    $value = !Utils::blank($value) ? 'https://www.youtube.com/watch?v=' . $value : '';
                }
                break;
                
            case 'currency':
                $arrParams['value_format'] = Utils::formatCurrency($value);
                $view = 'helpers.form_generate.textbox_currency';
                break;
                
            case 'discount':
                $discount_value = '';
                if(!Utils::blank($value) && $value > 0) {
                    $discount_value = Utils::formatCurrency($data->price - ($data->price * ($value / 100)));
                }
                
                $arrParams['discount_value'] = $discount_value;
                $view = 'helpers.form_generate.textbox_discount';
                break;
                
            case 'youtube_preview':
                
                $arrParams['youtube_id'] = isset($data->youtube_id) ? $data->youtube_id : '';
                $view = 'helpers.form_generate.youtube_preview';
                break;
                
            case 'file_simple':
                $key_data           = str_replace('upload_', '', $key);
                $preview_control_id = 'preview_' . $key;
                $image_size         = isset($this->config[$key . '_image_size']) ? $this->config[$key . '_image_size'] : '100x100';
                $image_size         = $key_data == 'web_ico' ? '40x40' : $image_size;
                $limit_upload       = isset($this->config[$key . '_maximum_upload']) ? $this->config[$key . '_maximum_upload'] : '51200';
                $sizes              = explode('x', $image_size);
                $width              = $sizes[0];
                $height             = $sizes[1];
                $smallText          = trans('auth.text_image_small', ['limit_upload' => Utils::formatMemory($limit_upload)]);
                
                $arrParams['key_data']            = $key_data;
                $arrParams['preview_control_id']  = $preview_control_id;
                $arrParams['limit_upload']        = $limit_upload;
                $arrParams['width']               = $width;
                $arrParams['height']              = $height;
                
                $view = 'helpers.form_generate.upload_single_file';
                break;
                
                
            case 'file_multiple':
                $limit_upload       = isset($this->config[$key . '_maximum_upload']) ? $this->config[$key . '_maximum_upload'] : '51200';
                $image_using        = !is_null($data) ? $data->getAllImage($data->id) : [];
                $smallText          = trans('auth.text_image_small', ['limit_upload' => Utils::formatMemory($limit_upload)]);
                
                $arrParams['limit_upload']        = $limit_upload;
                $arrParams['image_using']         = $image_using;
                $view = 'helpers.form_generate.upload_multiple_file';
                break;
                
            case 'textarea':
                $view = 'helpers.form_generate.textarea';
                break;
                
            case 'editor':
                $editor_type   = isset($formItem['editor']) ? $formItem['editor'] : 'small';
                $editor_height = isset($formItem['height']) ? $formItem['height'] : '200';
                
                $arrParams['editor_type']        = $editor_type;
                $arrParams['editor_height']      = $editor_height;
                $view = 'helpers.form_generate.editor';
                break;
                
            case 'checkbox':
                if(isset($data[$key])) {
                    $valueData = boolval($data[$key]);
                    if(!$valueData) {
                        $arrParams['checked'] = '';
                    }
                }
                $view = 'helpers.form_generate.checkbox';
                break;
                
            case 'select':
                $options = Utils::createSelectList($table, $value);
                $arrParams['empty_text'] = $empty_text;
                $arrParams['options']    = $options;
                $view = 'helpers.form_generate.select';
                break;
                
            case 'label':
                
                if($key == 'payment_method') {
                    $payment_methods = trans('auth.payment_methods');
                    $value = $payment_methods[$value];
                }
                
                if($key == 'created_at') {
                    $value = Utils::formatDate($value);
                }
                
                $arrParams['value']    = $value;
                
                $view = 'helpers.form_generate.label';
                break;
                
            case 'link':
                
                $view = 'helpers.form_generate.link';
                break;
        }
        
        if(empty($view)) {
            return '';
        }
        
        if($type != 'checkbox') {
            $element .= '<label>' . $text . $smallText . '</label>';
        }
        
        $element .= view($view, $arrParams)->render();
        $element .= '<span class="help-block"></span>';
        $element .= '</div>';
        
        return $element;
    }
    
    public function makeValidation($name, $input_rules = [], $data = []) {
        $result = [
            'rules' => [],
            'messages' => []
        ];
        $rules = [];
        $messages = [];
        if(!is_array($input_rules)) {
            return json_encode($result);
        }
        
        foreach($input_rules as $k=>$v) {
            $rules[$k] = [];
            $messages[$k] = [];
            $exp = explode('|', $v);
            foreach($exp as $kk=>$vv) {
                
                $exp1 = explode(':', $vv);
                $rule_name = '';
                $rule_check = '';
                if(isset($exp1[1])) {
                    $rule_name = $exp1[0];
                    $rule_check = $exp1[1];
                } else {
                    $rule_name = $vv;
                    $rule_check = true;
                }
                
                $msg_item = '';
                $auth_name = trans('auth.' . $name);
                if(isset($auth_name['tab_form'])) {
                    foreach($auth_name['tab_form'] as $tab) {
                        foreach($tab as $kk=>$vv) {
                            if($kk == $k) {
                                $item_name = $vv['text'];
                                break;
                            }
                        }
                    }
                } else {
                    $item_name = $auth_name['form'][$k]['text'];
                }
                $value_compare = '';
                
                switch($rule_name) {
                    case 'required':
                        $msg_item = 'validation.required';
                        if($k == 'content' || $k == 'reply_content') {
                            $rule_name = 'required_ckeditor';
                        }
                        if($k == 'role_id' || $k == 'category_id' || $k == 'post_group_id' || $k == 'upload_banner') {
                            $msg_item = 'validation.required_select';
                        }
                        break;
                    case 'required_upload_banner':
                    case 'required_youtube_id':
                        $msg_item = 'validation.required';
                        break;
                    case 'email':
                        $msg_item = 'validation.email';
                        break;
                    case 'max':
                        $rule_name = 'maxlength';
                        $msg_item = 'validation.max.string';
                        $value_compare = $rule_check;
                        break;
                    case 'min':
                        $rule_name = 'minlength';
                        $msg_item = 'validation.min.string';
                        $value_compare = $rule_check;
                        break;
                    case 'url':
                        $msg_item = 'validation.url';
                        $value_compare = $rule_check;
                        break;
                    case 'same':
                        $rule_name = 'equalTo';
                        $msg_item = 'validation.confirmed';
                        $value_compare = 'auth.' . $name . '.form.' . $rule_check;
                        $rule_check = '#' . $rule_check;
                        break;
                    default:
                        
                        break;
                }
                
                if(!($data != null && $data->count() > 0 && ($k == 'password' || $k == 'conf_password'))) {
                    $rules[$k][$rule_name] = $rule_check;
                    $messages[$k][$rule_name] = Utils::getValidateMessage($msg_item, $item_name, $value_compare);
                }
            }
            
        }
        
        $result['rules'] = $rules;
        $result['messages'] = $messages;
        
        return str_replace('\'', '\\\'', json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_NUMERIC_CHECK));
    }
    
    /**
     * createSidebar
     * @return string
     */
    public function createSidebar() {
        
        $html = '';
        $routes = Route::getRoutes();
        $currentRoute = Route::currentRouteName();
        $notAccessByRole = UserRole::notAccessByRole(Auth::user()->role_id);
        $sidebar = trans('auth.sidebar');
        $html .= '<ul  class="sidebar-menu" data-widget="tree">';
        foreach($sidebar as $k=>$v) {
            $open = $display = '';
            $roleId = Auth::user()->role_id;
            $active = '';
            $count = '';
            if(!isset($v['sub_menu'])) {
                
                if($k != 'dashboard' && !$routes->hasNamedRoute('auth_' . $k)) {
                    continue;
                }
                
                $title = $v['title'];
                $icon  = $v['icon'];
                $href = isset($v['href']) ? $v['href'] : 'auth_' . $k;
                $menuHtml = '';
                if($currentRoute == $href || strpos($currentRoute, $k) !== FALSE) {
                    $active = 'active';
                }
                
                if($k == 'orders' || $k == 'contacts') {
                    $cnt = DB::table($k)->where('status', StatusOrders::ORDER_NEW)->orWhere('status', ContactStatus::NEW_CONTACT)->count();
                    if($cnt) {
                        $count .= '<span class="pull-right-container">';
                        $count .= '<small class="label pull-right bg-red">' . $cnt . '</small>';
                        $count .= '</span>';
                    }
                }
                
                if(isset($v['href'])) {
                    $menuHtml .= '<li class="' . $active . '"><a href="' . route($href) . '" target="_blank"><i class="' . $icon . '"></i><span>' . $title . '</span></a></li>';
                } else {
                    $menuHtml .= '<li class="' . $active . '"><a href="' . route($href) . '"><i class="' . $icon . '"></i><span>' . $title . '</span>' . $count . '</a></li>';
                }
                
                if(in_array('*', $notAccessByRole) || !in_array($k, $notAccessByRole)) {
                    $html .= $menuHtml;
                }
                
            } else {
                
                $title = $v['title'];
                $icon  = $v['icon'];
                $subMenu = $v['sub_menu'];
                $subMenuHtml = '';
                $open = '';
                $display = '';
                foreach($subMenu as $r=>$menu) {
                    $titleSub = $menu['title'];
                    $iconSub  = $menu['icon'];
                    $href = isset($menu['href']) ? $menu['href'] : 'auth_' . $r;
                    $active = '';
                    if($currentRoute == $href || strpos($currentRoute, $r) !== FALSE) {
                        $active = 'active';
                        $open = 'menu-open';
                        $display = 'style="display: block;"';
                    }
                    
                    if(in_array('*', $notAccessByRole) || !in_array($r, $notAccessByRole)) {
                        $subMenuHtml .= '<li class="' . $active . '"><a href="' . route($href) . '"><i class="' . $iconSub . '"></i><span>' . $titleSub . '</span></a></li>';
                    }
                }
                $html .= '<li class="treeview ' . $open . '">';
                $html .= '<a href="javascript:void(0)"><i class="' . $icon . '"></i><span>' . $title . '</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>';
                $html .= '<ul class="treeview-menu" ' . $display . '>';
                $html .= $subMenuHtml;
                $html .= '</ul>';
                $html .= '</li>';
                
            }
        }
        
        $html .= '</ul>';
        
        return $html;
    }
}