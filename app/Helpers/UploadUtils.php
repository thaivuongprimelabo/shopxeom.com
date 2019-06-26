<?php
namespace App\Helpers;

use App\Config;
use App\Constants\UploadPath;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Facades\Image;

class UploadUtils {
    
    public static $instance;
    
    private function __construct() {}
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function doUploadSimple($request, $key, &$filename) {
        
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
    
    public function doUploadMultiple($request, $key, $id, &$arrFilenames = [], $is_main_file = '') {
        if($request->hasFile($key)) {
            $files = $request->$key;
            $upload_images = $request->upload_images;
            if(is_array($files)) {
                for($i = 0; $i < count($files); $i++) {
                    
                    $filename = '';
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
    
    public function resizeImage($key, $file = null, $demension = null, &$filename = '') {
        
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
}