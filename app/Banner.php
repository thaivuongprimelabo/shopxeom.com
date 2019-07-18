<?php

namespace App;

use App\Constants\Common;
use App\Helpers\Utils;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    //
    public $timestamps = false;
    protected $fillable = [];
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $table = Common::BANNERS;
    
    // Attribute
    public function getBannerAttribute($value) {
        if($this->select_type === 'use_image') {
            if(!Utils::blank($value)) {
                return Utils::getImageLink($value);
            }
        } else {
            return 'http://img.youtube.com/vi/' . $this->youtube_id . '/0.jpg';
        }
        
        return Utils::getImageLink(Common::NO_IMAGE_FOUND);
    }
}
