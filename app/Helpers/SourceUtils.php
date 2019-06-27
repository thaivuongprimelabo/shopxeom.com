<?php

namespace App\Helpers;


class SourceUtils {
    
    private $ignore = ['.settings', 'vendor', '.buildpath', '.', '..', '.git'];
    
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
        $sources = array_values($sources);
        $json = json_encode($sources);
        return $json;
    }
    
    public function loadFoldersAndFiles($dirPath, &$sources = []) {
        
        if (!is_dir($dirPath)) {
            return true;
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
//         $files = glob($dirPath . '*', GLOB_MARK);
        $files = scandir ($dirPath);
        foreach ($files as $indx=>$file) {
            if(in_array($file, $this->ignore)) {
                continue;
            }
//             $file = str_replace('\\', '/', $file);
            $filePath = $dirPath . $file;
            if (is_dir($filePath)) {
//                 $file = substr($file, 0, -1);
//                 $expl = explode('/', $file);
//                 $folderName = end($expl);
//                 $id = $folderName . $indx;
                $node = [
                    'id' => $file . $indx . time(),
                    'text' => $file,
                    'children' => [],
                    'type' => 'd'
                ];
                
                $sources[intval($indx)] = $node;
                
                $this->loadFoldersAndFiles($filePath, $sources[intval($indx)]['children']);
            } else {
//                 $expl = explode('/', $file);
//                 $fileName = end($expl);
                $node = [
                    'id' => $file,
                    'text' => $file,
                    'icon' => 'fa fa-sticky-note-o',
                    'children' => [],
                    'type' => 'f'
                ];
                array_push($sources, $node);
            }
        }
    }
    
    public function loadFoldersAndFiles1($dirPath, &$sources = []) {
        
        if (!is_dir($dirPath)) {
            return true;
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $indx=>$file) {
            if(in_array($file, $this->ignore)) {
                continue;
            }
            $file = str_replace('\\', '/', $file);
            if (is_dir($file)) {
                $file = substr($file, 0, -1);
                $expl = explode('/', $file);
                $folderName = end($expl);
                $id = $folderName . $indx;
                $node = [
                    'id' => $folderName . $indx . time(),
                    'text' => $folderName,
                    'children' => []
                ];
                
                $sources[$indx] = $node;
                
                $this->loadFoldersAndFiles($file, $sources[$indx]['children']);
            } else {
                $expl = explode('/', $file);
                $fileName = end($expl);
                $node = [
                    'id' => $fileName,
                    'text' => $fileName,
                    'icon' => 'fa fa-sticky-note-o',
                    'children' => []
                ];
                array_push($sources, $node);
            }
        }
    }
}
?>