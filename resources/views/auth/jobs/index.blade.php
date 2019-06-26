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
            	<form method="post" action="{{ route('auth_jobs_run') }}">
            		{{ csrf_field() }}
                	<div class="col-md-6">
                    	<button type="submit" id="run_command" class="btn btn-primary pull-left"><i class="fa fa-database"></i> Run command</button>
                    	<div class="col-md-4">
                    		<input type="text" name="command" class="form-control" placeholder="command" />
                    	</div>
                    </div>
                 </form>
                 <form method="post" action="{{ route('auth_jobs_dispatch') }}">
            		{{ csrf_field() }}
                    <div class="col-md-6">
                    	<button type="submit" id="dispatch_job" class="btn btn-primary pull-left"><i class="fa fa-database"></i> Dispatch job</button>
                    	<div class="col-md-4">
                    		<input type="text" name="job" class="form-control" placeholder="job" />
                    	</div>
                    </div>
                 </form>
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

@endsection