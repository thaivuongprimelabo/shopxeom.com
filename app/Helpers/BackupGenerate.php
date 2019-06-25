<?php

namespace App\Helpers;

use App\Constants\Common;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Backup;
use DeepCopy\f001\B;

class BackupGenerate {
    
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
    public function make() {
        $code = 200;
        $status = true;
        $message = '';
        
        try {
            
//             if(!file_exists($this->getBackupFilePath())) {
//                 mkdir(storage_path($this->getBackupFilePath()));
//             }
            
            $filename = 'backup_' . time() . '.sql';
            $filepath = $this->getBackupFilePath($filename);
//             $username = config('database.connections.mysql.username');
//             $password = config('database.connections.mysql.password');
//             $database = config('database.connections.mysql.database');
//             $command  = 'mysqldump -u' . $username . ' ' . $database . ' > ' . $filename;
            
//             $this->process = new Process($command);
            
//             $this->process->mustRun();

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
            
            if($output) {
                $myfile = fopen($filepath, 'w');
                $txt = $output;
                fwrite($myfile, $txt);
                fclose($myfile);
                
                $backup = new Backup();
                $backup->name = $filename;
                $backup->size = filesize($filepath);
                $backup->save();
                
            }
            
        } catch (ProcessFailedException $exception) {
            $status = false;
            $message = $exception->getMessage();
        }
        
        return compact('status', 'message', 'filename', 'code');
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