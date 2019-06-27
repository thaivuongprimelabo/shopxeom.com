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
            	<div id="jstree_demo_div">
            	</div>
            </div>
          </div>
        </div>
  	</div>
</section>
@endsection
@section('script')
<script type="text/javascript">
	$(function () { 
		$('#jstree_demo_div').jstree({
			'core' : {
    		    'data' : {!! SourceUtils::getInstance()->make() !!}
			}
		}); 
	});
	</script>
@endsection