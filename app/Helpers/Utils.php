<?php

namespace App\Helpers;

use App\Constants\BookingStatus;
use App\Constants\Common;
use App\Constants\ContactStatus;
use App\Constants\ProductType;
use App\Constants\Status;
use App\Constants\StatusOrders;
use App\Constants\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Image;
use App\Booking;
use App\Category;
use App\Config;
use App\Product;
use App\Vendor;
use Carbon\Carbon;
use App\PostGroups;
use App\Constants\ProductStatus;
use App\Constants\UploadPath;
use Illuminate\Http\UploadedFile;
use App\Jobs\SendMail;

class Utils {
    
    public static function getImageLink($image = '') {
        
        $uploadFolder = UploadPath::UPLOAD;
        
        if(strpos($image, ',') !== FALSE) {
            $arrImage = explode(',', $image);
            $image = $arrImage[0];
        }
        
        if(strpos($image, 'https') !== FALSE || strpos($image, 'http') !== FALSE) {
            return $image;
        }
        
        if(!self::blank($image)) {
            
            if(!file_exists(public_path($uploadFolder . $image))) {
                return url($uploadFolder . Common::NO_IMAGE_FOUND);
            }
            
            return url($uploadFolder . $image);
        } else {
            return '';
        }
    }
    
    public static function doUploadSimple($request, $key, &$filename) {
        
        $file = null;
        
        if($request instanceof Request && $request->hasFile($key)) {
            $file = $request->$key;
        }
        
        if($request instanceof UploadedFile) {
            $file = $request;
        }
        
        if($file == null) {
            return $filename;
        }
        
        $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $filename = time() . '_' . str_random(10) . '.' . $ext;
        if($key == 'web_ico') {
            $filename = 'favicon.png';
        }
        
        $uploadPath = UploadPath::getUploadPath($key);
        $filePath = UploadPath::getFilePath($key, $filename);
        
        if($file->move(public_path($uploadPath), $filename)) {
            $filename = $filePath . $filename;
        }
    }
    
    public static function doUploadMultiple($request, $key, $id, &$arrFilenames = [], $is_main_file = '') {
        if($request->hasFile($key)) {
            $files = $request->$key;
            $upload_images = $request->upload_images;
            if(is_array($files)) {
                for($i = 0; $i < count($files); $i++) {
                    
                    $filename = '';
                    
                    if(!isset($files[$i])) {
                        continue;
                    }
                    
                    $file = $files[$i];
                    
                    if(is_null($upload_images)) {
                        break;
                    }
                    
                    if(!in_array($file->getClientOriginalName(), $upload_images)) {
                        continue;
                    }
                    
                    $medium = '';
                    $small = '';
                    $size = Config::select($key . '_image_size')->first();
                    if(strpos($size->upload_image_image_size, ',') !== FALSE) {
                        $products_sizes = explode(',', $size->upload_image_image_size);
                        $products_medium_size = $products_sizes[0];
                        $products_small_size = $products_sizes[1];
                        self::resizeImage($key, $file, $products_medium_size, $medium);
                        self::resizeImage($key, $file, $products_small_size, $small);
                    }
                    
                    self::doUploadSimple($file, $key, $filename);
                    
                    $image = [
                        'product_id' => $id,
                        'image' => $filename,
                        'medium' => $medium,
                        'small' => $small,
                        'is_main' => 0
                    ];
                    
                    if($is_main_file == $file->getClientOriginalName()) {
                        $image['is_main'] = 1;
                    }
                    array_push($arrFilenames, $image);
                }
            }
        }
    }
    
    public static function resizeImage($key, $file = null, $demension = null, &$filename = '') {
        
        if(!$file || $demension == null) {
            return;
        }
        
        $image_size = getimagesize($file->getRealPath());
        $image_width = isset($image_size[0]) ? $image_size[0] : 0;
        $image_height = isset($image_size[1]) ? $image_size[1] : 0;
        
        $d = explode('x', $demension);
        $image_width_resize = null;
        $image_height_resize = null;
        if(isset($d[0]) && !self::blank($d[0])) {
            $image_width_resize = $d[0];
        }
        
        if(isset($d[1]) && !self::blank($d[1])) {
            $image_height_resize = $d[1];
        }
        
        if($image_width < $image_width_resize) {
            $image_width_resize = $image_width;
        }
        
        if($image_height < $image_height_resize) {
            $image_height_resize = $image_height;
        }
        
        $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $filename = time() . '_' . str_random(10) . '.' . $ext;
        $uploadPath = UploadPath::getUploadPath($key);
        $resizePath = $uploadPath . $demension;
        $filePath = UploadPath::getFilePath($key) . $demension . '/' . $filename;
        
        $image_resize = Image::make($file->getRealPath());
//         $image_resize->resize($image_width_resize, $image_height_resize);
        $image_resize->resize($image_width_resize, $image_height_resize, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });
        
        if(!file_exists(public_path($uploadPath))) {
            mkdir(public_path($uploadPath));
        }
        
        if(!file_exists(public_path($resizePath))) {
            mkdir(public_path($resizePath));
        }
        
        if($image_resize->save(public_path($resizePath . '/' . $filename))) {
            $filename = $filePath;
        }
        
    }
    
    public static function removeFile($file, $root = false) {
        if(!self::blank($file)) {
            if(!$root) {
                $filepath = public_path(UploadPath::UPLOAD . $file);
            } else {
                $filepath = $file;
            }
            if(file_exists($filepath)) {
                unlink($filepath);
            }
        }
    }
    
    public static function formatMemory($memory, $number = false)
    {
        if(!$number) {
            if ($memory >= 1024 * 1024 * 1024) {
                return sprintf('%.1f GB', $memory / 1024 / 1024 / 1024);
            }
            
            if ($memory >= 1024 * 1024) {
                return sprintf('%.1f MB', $memory / 1024 / 1024);
            }
            
            if ($memory >= 1024) {
                return sprintf('%d KB', $memory / 1024);
            }
            
            return sprintf('%d B', $memory);
            
        } else {
            if ($memory >= 1024 * 1024 * 1024) {
                return sprintf('%.1f', $memory / 1024 / 1024 / 1024);
            }
            
            if ($memory >= 1024 * 1024) {
                return sprintf('%.1f', $memory / 1024 / 1024);
            }
            
            if ($memory >= 1024) {
                return sprintf('%d', $memory / 1024);
            }
            
            return sprintf('%d', $memory);
        }
        
        
    }
    
    public static function getValidateMessage($key, $param = '', $param2 = '') {
        
        if(!self::blank($param) && strpos($param, 'auth.') !== FALSE) {
            $param = str_replace('.text', '', $param);
            $param = $param . '.text';
        }
        
        if(!self::blank($param2) && strpos($param2, 'auth.') !== FALSE) {
            $param2 = str_replace('.text', '', $param2);
            $param2 = $param2 . '.text';
        }
        
        $message = trans($key);
        $message = str_replace(':size', trans($param2), $message);
        $message = str_replace(':max', trans($param2), $message);
        $message = str_replace(':attribute', trans($param), $message);
        $message = str_replace(':equal', trans($param2), $message);
        return $message;
    }
    
    public static function replaceMessageParam($key, $params = []) {
        $message = trans($key);
        for($i = 0; $i < count($params); $i++) {
            $message = str_replace('{' . $i . '}', $params[$i], $message);
        }
        return $message;
    }
        
    /**
     * Determine if the given value is "blank".
     *
     * @param  mixed  $value
     * @return bool
     */
    public static function blank($value)
    {
        if (is_null($value)) {
            return true;
        }
        
        if (is_string($value)) {
            return trim($value) === '';
        }
        
        if (is_numeric($value) || is_bool($value)) {
            return false;
        }
        
        return empty($value);
    }
    
    public static function cnvNull($value, $default = '') {
        if(self::blank($value)) {
            return $default;
        }
        return $value;
    }
    
    public static function createSelectList($table = '', $selected = '') {
        $html = '';
        $data = [];
        switch($table) {
            case 'CATEGORY_PARENT':
            case 'CATEGORY_PRODUCT':
                $categories = Category::select('name', 'id')->where('parent_id', 0)->where('status', Status::ACTIVE)->get();
                foreach($categories as $c) {
                    array_push($data, $c);
                    
                    $child = Category::select('name', 'id')->where('parent_id', $c->id)->where('status', Status::ACTIVE)->get();
                    foreach($child as $c1) {
                        $c1->name = '|---- ' . $c1->name;
                        array_push($data, $c1);
                        $child1 = Category::select('name', 'id')->where('parent_id', $c1->id)->where('status', Status::ACTIVE)->get();
                        foreach($child1 as $c2) {
                            $c2->name = '&nbsp;&nbsp;&nbsp;&nbsp;|---- ' . $c2->name;
                            $c2->disabled = true;
                            array_push($data, $c2);
                        }
                    }
                }
                break;
            case 'VENDOR_PRODUCT':
                $data = Vendor::select('name', 'id')->where('status', Status::ACTIVE)->get();
                break;
            case 'UPLOAD_SIZE_LIMIT':
                $uploadLimits = Common::UPLOAD_SIZE_LIMIT;
                foreach($uploadLimits as $limit) {
                    array_push($data,['id' => $limit, 'name' => self::formatMemory($limit)]);
                }
                break;
            case 'BANNER_TYPE':
                $bannerType = trans('auth.banner_type');
                foreach($bannerType as $key=>$value) {
                    array_push($data,['id' => $key, 'name' => $value['text']]);
                }
                break;
            case 'CONTACT_TYPE':
                return ContactStatus::createSelectList($selected);
                break;
            case 'STATUS_ORDERS':
                return StatusOrders::createSelectList($selected);
                break;
            case 'POST_GROUPS':
                $postGroups = PostGroups::select('id', 'name')->active()->where('parent_id', 0)->get();
                foreach($postGroups as $group) {
                    array_push($data, $group);
                    
                    $childGroups = $group->getChildGroup();
                    foreach($childGroups as $g) {
                        $g->name = '|---- ' . $g->name;
                        array_push($data, $g);
                    }
                }
                break;
            case 'POSTGROUPS_PARENT':
                $data = PostGroups::select('id', 'name')->active()->where('parent_id', 0)->get();
                break;
            case 'BOOKING_STATUS':
                return BookingStatus::createSelectList($selected);
                break;
            case 'ROLE_USERS':
                return UserRole::createSelectList($selected);
                break;
            default:
                $data = [];
                break;
        }
        
        foreach($data as $item) {
            $id = is_object($item) ? $item->id : $item['id'];
            $name = is_object($item) ? $item->name : $item['name'];
            $disabled = $table == 'CATEGORY_PARENT' && is_object($item) && isset($item->disabled) ? "disabled=disabled" : '';
            if($item)
            if($selected == $id) {
                $html .= '<option value="'. $id .'" selected>'. $name .'</option>';
            } else {
                $html .= '<option value="'. $id .'" ' . $disabled . '>'. $name .'</option>';
            }
        }
        
        return $html;
    }
    
    public static function createCheckboxList($table = '', $selected = '') {
        $html = '';
        $data = [];
        switch($table) {
            case Common::CATEGORIES:
                $data = Category::select('name', 'id')->where('parent_id', 0)->where('status', Status::ACTIVE)->get();
                break;
            case Common::VENDORS:
                $data = DB::table($table)->select('name', 'id')->where('status', Status::ACTIVE)->get();
                break;
            default:
                $data = [];
                break;
        }
        
        $selectedId = explode(',', $selected);
        
        foreach($data as $item) {
            if($table != Common::COLORS) {
                if(in_array($item->id, $selectedId)) {
                    $html .= '<label><input type="checkbox" name="'. $table . '[]" value="'. $item->id .'" checked="checked" /> '. $item->name .'</option></label>';
                } else {
                    $html .= '<label><input type="checkbox" name="'. $table . '[]" value="'. $item->id .'" /> '. $item->name .'</option></label>';
                }
            } else {
                if(in_array($item->id, $selectedId)) {
                    $html .= '<label><input type="checkbox" name="'. $table . '[]" value="'. $item->id .'" checked="checked" /><a href="#" style="display:inline-block; width:21px; height:21px; margin-left:5px; margin-bottom:-6px; background-color:'. $item->name .'"></a></label>';
                } else {
                    $html .= '<label><input type="checkbox" name="'. $table . '[]" value="'. $item->id .'" /><a href="#" style="display:inline-block; width:21px; height:21px; margin-left:5px; margin-bottom:-6px; background-color:'. $item->name .'"></a></label>';
                }
            }
        }
        
        return $html;
    }
    
    public static function createVendor() {
        $html = '<div class="manunew">';
        $vendors = Vendor::select('id', 'name', 'name_url', 'logo')->where('status', Status::ACTIVE)->get();
        $count = 1;
        foreach($vendors as $vendor) {
            $html .= '<a href="'. route('vendor', ['vendor' => $vendor->name_url]) .'"><img src="'. self::getImageLink($vendor->logo) .'" /></a>';
        }
        $html .= '</div>';
        return $html;
    }
    
    public static function getConfig() {
        
        $config = Config::first();
        return $config;
    }
    
    public static function setConfigMail() {
        
        $config = self::getConfig();
        if(!self::blank($config->mail_account)) {
            \Illuminate\Support\Facades\Config::set('mail.driver', $config->mail_driver);
            \Illuminate\Support\Facades\Config::set('mail.host', $config->mail_host);
            \Illuminate\Support\Facades\Config::set('mail.port', $config->mail_port);
            \Illuminate\Support\Facades\Config::set('mail.from.address', $config->mail_from);
            \Illuminate\Support\Facades\Config::set('mail.from.name', $config->mail_name);
            \Illuminate\Support\Facades\Config::set('mail.encryption', $config->mail_encryption);
            \Illuminate\Support\Facades\Config::set('mail.username', $config->mail_account);
            \Illuminate\Support\Facades\Config::set('mail.password', $config->mail_password);
        }
    }
    
    public static function sendMail($config_email = []) {
        
        $message = '';
        
        dispatch(new SendMail($config_email));
        
        return $message;
    }
    
    public static function createMainNav() {
        $mainNav = trans('shop.main_nav');
        $html = '';
        foreach($mainNav as $key=>$nav) {
            if($key == Route::currentRouteName()) {
                $html .= '<li class="active"><a href="'. route($key) . '">'. $nav . ' </a></li>';
            } else {
                $html .= '<li><a href="'. route($key) . '">'. $nav . ' </a></li>';
            }
        }
        
        return $html;
    }
    
    public static function createNameUrl($str) {
        $unicode = array(
            'a' => 'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ',
            'd' => 'đ',
            'e' => 'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
            'i' => 'í|ì|ỉ|ĩ|ị',
            'o' => 'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
            'u' => 'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
            'y' => 'ý|ỳ|ỷ|ỹ|ỵ',
            'A' => 'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
            'D' => 'Đ',
            'E' => 'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
            'I' => 'Í|Ì|Ỉ|Ĩ|Ị',
            'O' => 'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
            'U' => 'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
            'Y' => 'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
        );
        foreach ($unicode as $nonUnicode => $uni) {
            $str = preg_replace("/($uni)/i", $nonUnicode, $str);
        }
        $kq = str_replace("'", "''", $str);
        
        return self::url_title(strtolower($kq));
    }
    
    private static function url_title($str, $separator = '-', $lowercase = FALSE)
    {
        if ($separator === 'dash')
        {
            $separator = '-';
        }
        elseif ($separator === 'underscore')
        {
            $separator = '_';
        }
        
        $q_separator = preg_quote($separator, '#');
        
        $trans = array(
            '&.+?;'			=> '',
            '[^\w\d _-]'		=> '',
            '\s+'			=> $separator,
            '('.$q_separator.')+'	=> $separator
        );
        
        $str = strip_tags($str);
        foreach ($trans as $key => $val)
        {
            $str = preg_replace('#'.$key.'#i'.(true ? 'u' : ''), $val, $str);
        }
        
        if ($lowercase === TRUE)
        {
            $str = strtolower($str);
        }
        
        return trim(trim($str, $separator));
    }
    
    public static function createFriendlyUrl($segment, $ext) {
        $url = implode('/', $segment) . $ext;
        return $url;
    }
    
    public static function getDiscountPrice($price, $discount) {
        return $price - ($price * ($discount / 100));
    }
    
    public static function deleteDir($dirPath) {
        
        if (! is_dir($dirPath)) {
            return true;
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            if (is_dir($file)) {
                self::deleteDir($file);
            } else {
                unlink($file);
            }
        }
        return rmdir($dirPath);
    }
    
    public static function getYoutubeEmbedUrl($url)
    {
        preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $url, $matches);
        
        if(isset($matches[1])) {
            $id = $matches[1];
            return 'https://www.youtube.com/embed/' . $id;
        }
        
        return null;
    }
    
    public static function getYoutubeVideoId($url)
    {
        preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $url, $matches);
        
        if(isset($matches[1])) {
            $id = $matches[1];
            return $id;
        }
        
        return null;
    }
    
    public static function getYoutubeThumbnail($url)
    {
        preg_match('/[\\?\\&]v=([^\\?\\&]+)/', $url, $matches);
        
        if(isset($matches[1])) {
            $id = $matches[1];
            return 'http://img.youtube.com/vi/' . $id . '/0.jpg';
        }
        
        return null;
    }
    
    public static function formatCurrency($input) {
        if(is_numeric($input)) {
            return number_format($input, 0, ',', '.') . Common::CURRENCY;
        }
        return $input;
    }
    
    public static function formatDate($input) {
        $result="";
        try {
            $result = Carbon::createFromFormat('Y-m-d H:i:s', $input)->format('d-m-Y H:i:s');
        } catch (\Exception $e) {
            $result="";
        }
        return $result;
    }
    
    /*============================== Shop ============================*/
    public static function createNavigation($postition = 'web') {
        $mainNav = trans('shop.main_nav');
        $html = '';
        
        $categories = Category::select('id', 'name', 'name_url')->active()->where('parent_id', 0)->get();
        $postGroups = PostGroups::select('id', 'name', 'name_url')->active()->get();
        
        if($postition == 'web') {
            $html .= view('shop.common.top_nav', compact('categories', 'postGroups'))->render();
        }
        
        if($postition == 'mobile') {
            $html .= view('shop.common.top_nav_mobile', compact('categories', 'postGroups'))->render();
        }
        
        if($postition == 'sub_footer') {
            $html .= '<ul class="list-menu list-blogs">';
            $routes = Route::getRoutes();
            foreach($mainNav as $route=>$nav) {
                $html .= '<li><a href="' . route($route) . '">' . $nav['text'] . '</a></li>';
            }
            $html .= '</ul>';
        }
        
        if($postition == 'footer') {
            $html .= '<ul class="list-menu-footer">';
            $routes = Route::getRoutes();
            foreach($mainNav as $route=>$nav) {
                $html .= '<li><a href="' . route($route) . '">' . $nav['text'] . '</a></li>';
            }
            $html .= '</ul>';
        }
        return $html;
    }
    
    public static function createSidebarShop($position = 'category_list') {
        $html = '';
        if($position == 'category_list') {
            $categories = Category::select('id', 'name', 'name_url', 'parent_id')->where('status', Status::ACTIVE)->where('parent_id', 0)->get();
            $html .= view('shop.common.category_list',compact('categories'))->render();
        }
        
        if($position == 'postgroups_list') {
            $postGroups = PostGroups::select('id', 'name', 'name_url')->active()->get();
            $html .= view('shop.common.postgroups_list',compact('postGroups'))->render();
        }
        
        if($position == 'price_search') {
            $html .= view('shop.common.price_search')->render();
        }
        
        if($position == 'popular_products') {
            $products = Product::where('status', Status::ACTIVE)->where('is_popular', ProductType::IS_POPULAR)->paginate(Common::LIMIT_PRODUCT_SHOW_SIDEBAR);
            $html .= view('shop.common.popular_products', compact('products'))->render();
        }
        return $html;
        
    }
    
    public static function createProductTab($title, $type = '', $limit_product = Common::LIMIT_PRODUCT_SHOW_TAB) {
        $html = '';
        $categories = Category::select('id', 'name', 'name_url')->active()->where('parent_id', 0)->get();
        
        
        $route = '';
        $where = [];
        if($type == ProductType::IS_NEW) {
            $route = route('newProducts');
            $where['is_new'] = ProductType::IS_NEW;
        }
        if($type == ProductType::IS_BEST_SELLING) {
            $route = route('bestSellProducts');
            $where['is_best_selling'] = ProductType::IS_BEST_SELLING;
        }
        if($type == ProductType::IS_POPULAR) {
            $route = route('popularProducts');
            $where['is_popular'] = ProductType::IS_POPULAR;
        }
        
        $all_products = Product::active()->where($where)->orderBy('updated_at', 'DESC')->limit($limit_product)->get();
        
        $html .= view('shop.common.product', compact('categories', 'title', 'type', 'route', 'all_products', 'limit_product'))->render();
        return $html;
    }
    
    public static function createVendorSection() {
        $vendors = Vendor::active()->get();
        $html = view('shop.common.vendors', compact('vendors'))->render();
        return $html;
    }
    
    public static function curl($method = 'post', $url = "", $params = [], $authen = [], $header = 'default') {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 60);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        
        // use a proxy
        if (env('CURLOPT_HTTPPROXYTUNNEL')) {
            curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, env('CURLOPT_HTTPPROXYTUNNEL'));
            curl_setopt($ch, CURLOPT_PROXY, env('CURLOPT_PROXY'));
            curl_setopt($ch, CURLOPT_PROXYPORT, env('CURLOPT_PROXYPORT'));
        }
        
        
        // neu ko dung POST, mac dinh method cua curl la GET
        if ($method == 'post') {
            if ($header == 'default') {
                // ko dung header, mac dinh header la application/x-www-form-urlencoded
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            } elseif ($header == 'json') {
                curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
            }
        }
        
        if (!empty($authen)) {
            curl_setopt($ch, CURLOPT_USERPWD, $authen['username'] . ":" . $authen['password']);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        }
        
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        
        $result = curl_exec($ch);
        if (curl_errno($ch) !== 0) {
            \Log::Info('cURL error when connecting to ' . $url . ': ' . curl_error($ch));
        }
        
        curl_close($ch);
        return $result;
    }
    
}