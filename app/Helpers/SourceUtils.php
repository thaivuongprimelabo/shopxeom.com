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
        $sources = $this->loadFoldersAndFiles($root);
        return $sources;
    }
    
    public function loadFoldersAndFiles($dirPath) {
        
        $sources = [];
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
                
                $arrFolders[$indx]['children'] = $this->loadFoldersAndFiles($filePath);
            } else {
                $node = [
                    'id' => $file,
                    'text' => $file,
                    'icon' => 'fa fa-sticky-note-o',
                    'children' => [],
                    'data' => [
                        'path' => str_replace($_SERVER['DOCUMENT_ROOT'], '', $dirPath . $file)
                     ]
                ];

                $ext = pathinfo($file, PATHINFO_EXTENSION);
                if(isset($this->icons[$ext])) {
                    $node['icon'] = url($this->icons[$ext]);
                }
                
                array_push($arrFiles, $node);
            }
        }
        
        $sources = array_merge($arrFolders, $arrFiles);
        return $sources;
    }
    
    public function readDataFile($filepath = null) {
        $content = '';
        $filepath = $_SERVER['DOCUMENT_ROOT'] . $filepath;
        if(!is_null($filepath)) {
            if(file_exists($filepath)) {
//                 $fp = fopen($filepath, 'r');
//                 while ($line = stream_get_line($fp, 1024 * 1024, "\n"))
//                 {
//                     $content .= $line;
//                 }
//                 fclose($fp);
                $content = file_get_contents($filepath);
            }
        }
        return $content;
    }
    
    public function saveFile($filepath = null, $content = null) {
        $filepath = $_SERVER['DOCUMENT_ROOT'] . $filepath;
        if(!is_null($filepath)) {
            if(file_exists($filepath)) {
                $fp = fopen($filepath, 'w');
                fwrite($fp, base64_decode($content));
                fclose($fp);
                return true;
            }
        }
        return false;
    }
}
?>