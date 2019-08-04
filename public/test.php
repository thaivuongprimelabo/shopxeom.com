<?php
error_reporting(E_ALL);
$disabled_functions = ini_get('disable_functions');
if ($disabled_functions!='') {
	echo $disabled_functions;
}
echo 'Current PHP version: ' . phpversion();

if(function_exists('proc_close')) {
    echo "proc_close is enabled";
} else {
    echo "proc_close is enabled";

}

?>