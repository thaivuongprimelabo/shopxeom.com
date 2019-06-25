<?php

namespace App\Helpers;

use App\Constants\Common;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Backup;
use App\Config;
use DeepCopy\f001\B;
use App\Constants\UploadPath;

class BackupGenerate {
    
    CONST BACKUP_SUCCESS = 1;
    CONST BACKUP_FAILED = 2;
    CONST BACKUP_FAILED_MAIL = 3;
    CONST BACKUP_FAILED_CREATE_ZIP = 4;
    
    private $dumpPath = 'C:/wamp64/bin/mysql/mysql5.7.21/bin/';
    
    private $backupFolder = 'backups/';
    
    protected $signature = 'db:backup';
    
    protected $description = 'Backup the database';
    
    protected $process;
    
    /**
     * ESCAPE character
     *
     * @var	string
     */
    protected $_like_escape_chr = '!';
    
    
    
    public static $instance;
    
    public function __construct() {
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    
    /**
     * @return string
     */
    public function getBackupFilePath($filename = '')
    {
        $path = public_path($this->backupFolder);
        if(!file_exists($path)) {
            mkdir($path, 0777);
        }
        
        if(!empty($filename)) {
            $path = $path . $filename;
        }
        
        return $path;
    }

    /**
     * @param string $backupFolder
     */
    public function setBackupFolder($backupFolder)
    {
        $this->backupFolder = $backupFolder;
    }

    /**
     *  Create backup file
     */
    public function make($sendmail = false) {
        $code = 200;
        $status = true;
        $message = '';
        $processStatus = self::BACKUP_SUCCESS;
        try {
            
            $filename = 'backup_' . time() . '.sql';

            $params = [
                'tables' => Common::TABLE_LIST,
                'foreign_key_checks' => true,
                'ignore' => [],
                'database' => config('database.connections.mysql.database'),
                'newline' => "\r\n",
                'add_drop' => true,
                'add_insert' => true
            ];
            
            $output = $this->_backup($params);
            $zip = new ZipUtils();
            $zip->add_data($filename, $output);
            
            $uploadPath = public_path(UploadPath::getUploadPath());
            $this->_backupFile($uploadPath, $zip);
            $zipFile = $zip->get_zip();
            
            $backup_name = 'database_backup_' . date("Y-m-d-H-i-s") . '.zip';
            $filepath = $this->getBackupFilePath($backup_name);
            
            if($zipFile) {
                $myfile = fopen($filepath, 'w');
                $txt = $zipFile;
                fwrite($myfile, $txt);
                fclose($myfile);
                
                $config = Utils::getConfig();
                $subject = trans('auth.subject_mail', ['web_name' => $config->web_title, 'title' => $backup_name]);
                
                // Config mail
                $config = [
                    'subject' => $subject,
                    'msg' => [
                        'content' => $subject,
                    ],
                    'to' => Common::FROM_MAIL,
                    'template' => 'auth.emails.backup',
                    'pathToFile' => [$filepath]
                ];
                
                if($sendmail) {
                    $message = Utils::sendMail($config);
                    if(!Utils::blank($message)) {
                        \Log::error($message);
                        $processStatus = self::BACKUP_FAILED_MAIL;
                    }
                }
            } else {
                $processStatus = self::BACKUP_FAILED_CREATE_ZIP;
            }
            
        } catch (ProcessFailedException $exception) {
            $status = false;
            $message = $exception->getMessage();
            $processStatus = self::BACKUP_FAILED;
        }
        
        try {
            $backup = new Backup();
            $backup->name = $backup_name;
            $backup->size = filesize($filepath);
            $backup->status = $processStatus;
            if($backup->save()) {
                unlink($filepath);
            }
        } catch(\Exception $e) {
            $status = false;
            $message = trans('messages.ERROR');
        }
        
        return compact('status', 'message', 'filename', 'code');
    }
    
    private function _backupFile($dirPath, &$zip) {
        if (!is_dir($dirPath)) {
            return true;
        }
        if (substr($dirPath, strlen($dirPath) - 1, 1) != '/') {
            $dirPath .= '/';
        }
        $files = glob($dirPath . '*', GLOB_MARK);
        foreach ($files as $file) {
            $file = str_replace('\\', '/', $file);
            if (is_dir($file)) {
                $file = substr($file, 0, -1);
                $folder_zip = str_replace(str_replace('\\', '/', public_path('upload/')), '', $file);
                $zip->add_dir($folder_zip);
                self::_backupFile($file, $zip);
            } else {
                $file_zip = str_replace(str_replace('\\', '/', public_path('upload/')), '', $file);
                $zip->add_data($file_zip, file_get_contents($file));
            }
        }
    }
    
    /**
     * Export
     *
     * @param	array	$params	Preferences
     * @return	mixed
     */
    private function _backup($params = array())
    {
        if (count($params) === 0)
        {
            return FALSE;
        }
        
        // Extract the prefs for simplicity
        extract($params);
        
        // Build the output
        $output = '';
        
        // Do we need to include a statement to disable foreign key checks?
        if ($foreign_key_checks === FALSE)
        {
            $output .= 'SET foreign_key_checks = 0;'.$newline;
        }
        
        foreach ( (array) $tables as $table)
        {
            // Is the table in the "ignore" list?
            if (in_array($table, (array) $ignore, TRUE))
            {
                continue;
            }
            
            // Get the table schema
            $query = DB::select(DB::raw('SHOW CREATE TABLE '.($database.'.'.$table)));
            // No result means the table name was invalid
            if ($query === FALSE)
            {
                continue;
            }
            
            // Write out the table schema
            $output .= '#'.$newline.'# TABLE STRUCTURE FOR: '.$table.$newline.'#'.$newline.$newline;
            
            if ($add_drop === TRUE)
            {
                $output .= 'DROP TABLE IF EXISTS '.($table).';'.$newline.$newline;
            }
            
            $i = 0;
            $result = $query;
            foreach ($result[0] as $val)
            {
                if ($i++ % 2)
                {
                    $output .= $val.';'.$newline.$newline;
                }
            }
            
            // If inserts are not needed we're done...
            if ($add_insert === FALSE)
            {
                continue;
            }
            
            // Grab all the data from the current table
            $query = DB::table($table);
            $columns = DB::getSchemaBuilder()->getColumnListing($table);
            
            if ($query->count() === 0)
            {
                continue;
            }
            
            // Fetch the field names and determine if the field is an
            // integer type. We use this info to decide whether to
            // surround the data with quotes or not
            
            $i = 0;
            $field_str = '';
            $is_int = array();
            foreach ($columns as $field)
            {
                $field_str .= $field .', ';
                $i++;
            }
            
            // Trim off the end comma
            $field_str = preg_replace('/, $/' , '', $field_str);
            
            // Build the insert string
            foreach ($query->get()->toArray() as $row)
            {
                $val_str = '';
                
                $i = 0;
                foreach ($row as $v)
                {
                    // Is the value NULL?
                    if ($v === NULL)
                    {
                        $val_str .= 'NULL';
                    }
                    else
                    {
                        // Escape the data if it's not an integer
                        $val_str .= '\'' . ($v) . '\'';
                    }
                    
                    // Append a comma
                    $val_str .= ', ';
                    $i++;
                }
                
                // Remove the comma at the end of the string
                $val_str = preg_replace('/, $/' , '', $val_str);
                
                // Build the INSERT string
                $output .= 'INSERT INTO '.($table).' ('.$field_str.') VALUES ('.$val_str.');'.$newline;
            }
            
            $output .= $newline.$newline;
        }
        
        // Do we need to include a statement to re-enable foreign key checks?
        if ($foreign_key_checks === FALSE)
        {
            $output .= 'SET foreign_key_checks = 1;'.$newline;
        }
        
        return $output;
    }
}
?>