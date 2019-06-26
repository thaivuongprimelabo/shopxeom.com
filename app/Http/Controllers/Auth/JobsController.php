<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Job;
use App\Jobs\SendMail;

class JobsController extends AppController
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
        return view('auth.jobs.index', $this->search($request));
    }
    
    /**
     * search
     * @param Request $request
     */
    public function search(Request $request) {
        return $this->doSearch($request, new Job());
    }
    
    public function doRun(Request $request) {
        Artisan::call($request->command);
        echo $request->command; exit;
        //return redirect()->back()->with('success', 'Run: php artisan ' . $request->command . ' successfully');
    }
    
    public function doDispatch(Request $request) {
//         dispatch($request->job);
        $jobStr = $request->job;
        $class = '\\App\\Jobs\\' . $jobStr;
        $job = new $class();
        dispatch($job);
        return redirect()->back()->with('success', 'Dispatch: ' . $request->job . ' successfully');
    }
}
