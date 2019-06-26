<?php

namespace App\Http\Controllers\Auth;

use App\Backup;
use App\Helpers\BackupGenerate;
use Illuminate\Http\Request;

class BackupController extends AppController
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        
        parent::__construct();
        
        $this->middleware('auth');
        
    }
    
    public function index(Request $request) {
        return view('auth.backup.index', $this->search($request));
    }
    
    /**
     * search
     * @param Request $request
     */
    public function search(Request $request) {
        return $this->doSearch($request, new Backup());
    }
    
    /**
     * create
     * @param Request $request
     */
    public function create(Request $request) {
        $backup = BackupGenerate::getInstance()->make();
    }
    
    /**
     * download
     * @param Request $request
     */
    public function download(Request $request) {
        $file_download = BackupGenerate::getInstance()->getBackupFilePath($request->file_download);
        return response()->download($file_download);
    }
    
    /**
     * remove
     * @param Request $request
     */
    public function remove(Request $request) {
        $result = ['code' => 404];
        $ids = $request->ids;
        if(Backup::destroy($ids)) {
            $result['code'] = 200;
            return response()->json($result);
        }
    }
    
}
