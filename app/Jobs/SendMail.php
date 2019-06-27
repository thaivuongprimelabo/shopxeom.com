<?php

namespace App\Jobs;

use App\Constants\Common;
use App\Helpers\Utils;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class SendMail implements ShouldQueue
{
    
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    private $config = null;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($config)
    {
        //
        $this->config = $config;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle() {
        $config_email = $this->config;
        
        try {
            $from = isset($config_email['from'])?$config_email['from']: Common::FROM_MAIL;
            $from_name = isset($config_email['from_name'])?$config_email['from_name']: Common::FROM_NAME;
            $to = isset($config_email['to'])?$config_email['to']:'';
            $subject = isset($config_email['subject'])?$config_email['subject']: Common::SUBJECT;
            $msg = isset($config_email['msg'])?$config_email['msg']:'';
            $template = isset($config_email['template'])?$config_email['template']: Common::TEMPLATE;
            $cc = isset($config_email['cc'])?$config_email['cc']:null;
            $bcc = isset($config_email['bcc'])?$config_email['bcc']:null;
            $pathToFile = isset($config_email['pathToFile'])?$config_email['pathToFile']:null;

            Mail::send($template, $msg, function ($email) use ($from, $from_name, $to, $subject, $cc, $bcc, $pathToFile) {
                if ($from_name != '') {
                    $email->from($from, $from_name);
                } else {
                    $email->from($from, $from);
                }
                $email->to($to);
                if ($cc !== null) {
                    $email->cc($cc);
                }
                if ($bcc !== null) {
                    $email->bcc($bcc);
                }
                if ($pathToFile !== null) {
                    if(count($pathToFile)) {
                        foreach($pathToFile as $attach) {
                            $email->attach($attach);
                        }
                    }
                }
                $email->subject($subject);
            });
            
            \Log::info('Send mail successfully.');

        } catch (\Exception $e) {
            $message = $e->getMessage();
            \Log::error($message);
        }
    }
}
