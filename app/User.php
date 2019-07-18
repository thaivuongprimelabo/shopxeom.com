<?php

namespace App;

use App\Constants\Common;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Constants\UserRole;
use App\Helpers\Utils;
use App\Constants\UploadPath;

class User extends Authenticatable
{
    use Notifiable;
    
    protected $table = Common::USERS;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    
    public function isAdmin() {
        
        $notAccessByRole = UserRole::notAccessByRole($this->role_id);
        
        if(!in_array(':deny_login', $notAccessByRole)) {
            return true;
        }
        
        return false;
    }
    
    public function getAvatar() {
        if(!Utils::blank($this->avatar) && !file_exists($this->avatar)) {
            return Utils::getImageLink($this->avatar);
        }
        return Utils::getImageLink(Common::NO_AVATAR);
    }
    
    public function getAvatarAttribute($value) {
        if(!Utils::blank($value)) {
            return Utils::getImageLink($value);
        }
        
        return Utils::getImageLink(Common::NO_IMAGE_FOUND);
    }
}
