@extends('layouts.app')

@section('content')
<!-- Content Header (Page header) -->
<section class="content-header">
  <h1>
    {{ trans('auth.' . $name . '.list_title') }}
  </h1>
  <ol class="breadcrumb">
    <li><a href="{{ route('dashboard') }}"><i class="fa fa-dashboard"></i> Trang chủ</a></li>
    <li class="active">{{ trans('auth.' . $name . '.list_title') }}</li>
  </ol>
</section>
<!-- Main content -->
<section class="content">
	<div class="row">
        <div class="col-xs-12">
          <div class="box">
            <!-- Box Body -->
            <div class="box-body">
            	<div class="col-md-12">
                	<button type="button" id="create_backup" class="btn btn-primary pull-right"  data-loading-text="<i class='fa fa-spinner fa-spin '></i> {{ trans('auth.button.create_backup') }}"><i class="fa fa-database"></i> {{ trans('auth.button.create_backup') }}</button>
                	<button type="button" id="create_backup_sendmail" class="btn btn-primary pull-right mr-1"  data-loading-text="<i class='fa fa-spinner fa-spin '></i> {{ trans('auth.button.create_backup') }}"><i class="fa fa-database"></i> {{ trans('auth.button.create_backup_sendmail') }}</button>
                 </div>
            </div>
          </div>
          <div class="box">
            <!-- /.box-header -->
            <div id="ajax_list">
                @include($view)
            </div>
          </div>
          <!-- /.box -->
        </div>
  	</div>
</section>
@endsection
@section('script')
<script type="text/javascript">
	$(document).ready(function() {

		var callback = function(res) {
			if(res.status) {
				window.location = window.location.href;
			} else {
				alert(res.message);
			}
		}
		
		$(document).on('click', '#create_backup', function(e) {
			$(this).button('loading');
			var data = {
				type : 'post',
				async : true,
				sendmail: false
			}
			callAjax('{{ route('api.backup') }}', data, 'api.backup', callback);
		});

		$(document).on('click', '#create_backup_sendmail', function(e) {
			$(this).button('loading');
			var data = {
				type : 'post',
				async : true,
				sendmail: true
			}
			callAjax('{{ route('api.backup') }}', data, 'api.backup', callback);
		});
	});
</script>
@endsection