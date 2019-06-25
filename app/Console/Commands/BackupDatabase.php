<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Helpers\BackupGenerate;

class BackupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'backup:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
//         $this->info('The backup has been proceed successfully.');
        \Log::info('The backup has been proceed successfully');
        //$reponse = BackupGenerate::getInstance()->make();
//         if($reponse['status']) {
//             $this->info('The backup has been proceed successfully.');
//         } else {
//             $this->error('The backup process has been failed.');
//         }
    }
}
