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
        <div class="col-xs-2">
          <div class="box">
            <!-- Box Body -->
            <div class="box-body">
            	<div style="height: 580px; overflow-x:hidden; overflow-y:auto">
                	<div id="jstree_demo_div">
                	</div>
            	</div>
            </div>
          </div>
        </div>
        <div class="col-xs-10">
        	<div class="box">
            <!-- Box Body -->
            	<div class="box-body">
                	<div id="editor"></div>
            	</div>
            </div>
        </div>
        <div class="col-xs-12">
        	<button type="button" id="save_source" class="btn btn-primary pull-right" data-id="save_source" data-loading-text="<i class='fa fa-spinner fa-spin '></i> {{ trans('auth.button.submit') }}"><i class="fa fa-floppy-o" aria-hidden="true"></i> {{ trans('auth.button.submit') }}</button>
        	<button type="button" id="reload_source" class="btn btn-warning pull-right mr-1" data-id="reload_source" data-loading-text="<i class='fa fa-spinner fa-spin '></i> {{ trans('auth.button.refresh') }}"><i class="fa fa-refresh" aria-hidden="true"></i> {{ trans('auth.button.refresh') }}</button>
        </div>
  	</div>
</section>
<style type="text/css" media="screen">
    #editor { 
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height:580px;
    }
</style>
@endsection
@section('script')
<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.9/ace.js"></script>
<script type="text/javascript">
	$(function () { 

		var editor = ace.edit("editor");
	    editor.setTheme("ace/theme/monokai");
	    editor.getSession().setMode("ace/mode/php");
	    editor.setFontSize(14);
	    
		var data = null;

		

		var loadSources = function() {
			var data = {
    			type : 'post',
    			async : false,
    		}

            callAjax('{{ route('source.load') }}', data, 'source.load', callback);
		}

		var callbackLoadSuccess = function(res) {
			data = res.data;
		}

		$('#jstree_demo_div')
		.on('select_node.jstree', function (e, res) {
//             var data = {
//     			type : 'post',
//     			async : false,
//     			path : res.node.data.path,
//     		}

//             callAjax('{{ route('source.read') }}', data, 'source.read', callbackReadSuccess);

			var type = res.selected[0].split('.').pop();
			alert(type);
        })
		.jstree({
			'core' : {
				 'data': {
		                'url': '{{ route('source.load') }}',
		                'type': 'post'
		          }
			}
		}); 

		var callbackReadSuccess = function(res) {

			editor.setValue(res.data);
		}

		$(document).on('click', '#save_source', function(e) {
			var path = $('#jstree_demo_div').jstree().get_selected(true)[0].data.path;
			var data = {
    			type : 'post',
    			async : false,
    			path : path,
    			content: btoa(editor.getValue())
    		}

            callAjax('{{ route('source.save') }}', data, 'source.save', callbackSaveSuccess);
		});

		var callbackSaveSuccess = function(res) {
			if(res.code === 200) {
				alert('Save Ok');
			}
		}
	});
	</script>
@endsection