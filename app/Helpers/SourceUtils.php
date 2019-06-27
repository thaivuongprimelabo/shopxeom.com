<?php

namespace App\Helpers;


class SourceUtils {
    
    private $ignore = ['.settings', 'vendor', '.buildpath', '.', '..', '.git'];
    private $icons = [
        'php' => 'lang_icons/php.png',
        'css' => 'lang_icons/css.png',
        'html' => 'lang_icons/html.png',
        'js' => 'lang_icons/js.png',
    ];
    
    public static $instance;
    
    private function __construct() {}
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    public function make() {
        $root = $_SERVER['DOCUMENT_ROOT'];
        $sources = [];
        $this->loadFoldersAndFiles($root, $sources);
        $json = json_encode(array_values($sources));
        return $json;
    }
    
    public function loadFoldersAndFiles($dirPath, &$sources = []) {
        
        $arrFolders = [];
        $arrFiles = [];
        
        if (!is_dir($dirPath)) {
            return true;
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = scandir ($dirPath);
        foreach ($files as $indx=>$file) {
            if(in_array($file, $this->ignore)) {
                continue;
            }
            $filePath = $dirPath . $file;
            if (is_dir($filePath)) {
                $node = [
                    'id' => $file . $indx . time(),
                    'text' => $file,
                    'children' => [],
                ];
                
                $arrFolders[$indx] = $node;
                
                $this->loadFoldersAndFiles($filePath, $arrFolders[$indx]['children']);
            } else {
                $node = [
                    'id' => $file,
                    'text' => $file,
                    'icon' => 'fa fa-sticky-note-o',
                    'children' => [],
                ];

                $ext = pathinfo($file, PATHINFO_EXTENSION);
                if(isset($this->icons[$ext])) {
                    $node['icon'] = url($this->icons[$ext]);
                }
                
                array_push($arrFiles, $node);
            }
        }
        
        $sources = array_merge($arrFolders, $arrFiles);
    }
}
?>