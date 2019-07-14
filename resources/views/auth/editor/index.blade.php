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
        <div class="col-xs-3">
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
        <div class="col-xs-9">
        	<div class="box">
            <!-- Box Body -->
            	<div class="box-body">
                	<div id="editor"></div>
            	</div>
            </div>
        </div>
        <div class="col-xs-12">
        	<button type="button" id="save_source" class="btn btn-primary pull-right" data-id="save_source" data-loading-text="<i class='fa fa-spinner fa-spin '></i> {{ trans('auth.button.submit') }}"><i class="fa fa-floppy-o" aria-hidden="true"></i> {{ trans('auth.button.submit') }}</button>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/jstree/3.2.1/jstree.min.js"></script>
<script type="text/javascript">
	$(function () { 

		var editor = ace.edit("editor");
	    editor.setTheme("ace/theme/monokai");
	    editor.getSession().setMode("ace/mode/php");
	    editor.setFontSize(14);
	    
		var data = null;

		var getPath = function(parents) {
			var path = '';
			if(parents.length) {
				var start = parents.length - 1;
				for(var i = start; i >= 0; i--) {
					if(parents[i] === '#') {
						path += '/';
					} else {
						var split = parents[i].split('_');
						path += split[0] + '/';
					}
				}
			}
			return path;
		}

		var loadSources = function() {
			var data = {
    			type : 'post',
    			async : false,
    			action: 'init'
    		}

            callAjax('{{ route('source.editor') }}', data, 'callback', function(res) { data = res.data; });
		}

		$('#jstree_demo_div')
		.jstree({
			'core' : {
				 'data': {
		                'url': '{{ route('source.editor') }}',
		                'data': {
							'action': 'init'
		                },
		                'type': 'post'
		          },
		          "check_callback": true
			},
	        'contextmenu': {
	            'items': function (node) {
	                var tmp = $.jstree.defaults.contextmenu.items();
	                delete tmp.create.action;
	                tmp.create.label = "Folder";
	                tmp.create.submenu = {
	                    "create_folder": {
	                        "separator_after": true,
	                        "label": "Create folder",
	                        "action": function (data) {
	                            var inst = $.jstree.reference(data.reference),
	                            obj = inst.get_node(data.reference);
	                            inst.create_node(obj, {type: 'folder'}, "last", function (new_node) {
	                                setTimeout(function () {
	                                    inst.edit(new_node);
	                                }, 0);
	                            });
	                        }
	                    },
	                    "create_file": {
	                        "label": "Create file",
	                        "action": function (data) {
	                            var inst = $.jstree.reference(data.reference),
	                            obj = inst.get_node(data.reference);
	                            inst.create_node(obj, {type: 'file', icon: 'fa fa-sticky-note-o'}, "last", function (new_node) {
	                                setTimeout(function () {
	                                    inst.edit(new_node);
	                                }, 0);
	                            });
	                        }
	                    }
	                };
	                if (this.get_type(node) === "file") {
	                    delete tmp.create;
	                }
	                return tmp;
	            }
	        },
	        'unique': {
	            'duplicate': function (name, counter) {
		            console.log('duplicate');
	                return name + ' ' + counter;
	            },
	            'error_callback': function(n, p, f) {
	            	console.log("Duplicate node `" + n + "` with function `" + f + "`!");
	            }
	        },
	        'plugins': ['state', 'dnd', 'types', 'contextmenu', 'unique']
		})
		.on('create_node.jstree', function (e, res) {
			console.log('create_node.jstree', res);
        })
        .on('rename_node.jstree', function (e, res) {
        	var path = getPath(res.node.parents);
        	var params = {
    			type : 'post',
    			async : false,
    			path: path + res.node.text,
    			action: 'create_' + res.node.original.type
    		}

            callAjax('{{ route('source.editor') }}', params, 'callback', function(d) {
            	res.instance.set_id(res.node, res.node.text);
            	res.instance.set_icon(res.node, '{{ url('lang_icons/php.png') }}');
            });
    	})
    	.on('delete_node.jstree', function (e, res) {
    		var path = getPath(res.node.parents);
        	var params = {
    			type : 'post',
    			async : false,
    			path: path + res.node.text,
    			action: 'delete_' + res.node.original.type
    		}

            callAjax('{{ route('source.editor') }}', params, 'callback', function(d) {
            	res.instance.refresh();
            });
        })
        .on('select_node.jstree', function (e, res) {
 			var type = res.selected[0].split('.').pop();
 			switch (type) {
                 case 'text':
                 case 'txt':
                 case 'md':
                 case 'htaccess':
                 case 'log':
                 case 'sql':
                     editor.getSession().setMode("ace/mode/html");
                     break;
                 case 'xml':
                     editor.getSession().setMode("ace/mode/xml");
                     break;
                 case 'php':
                     editor.getSession().setMode("ace/mode/php");
                     button = 'run';
                     break;
                 case 'js':
                     editor.getSession().setMode("ace/mode/javascript");
                     break;
                 case 'json':
                     editor.getSession().setMode("ace/mode/json");
                     break;
                 case 'css':
                     editor.getSession().setMode("ace/mode/css");
                     break;
                 case 'html':
                     editor.getSession().setMode("ace/mode/html");
                     break;
                 case 'png':
                 case 'jpg':
                 case 'jpeg':
                 case 'bmp':
                 case 'gif':
                     break;
                 default:
                     break;
             }

             if(res.node.original.type === 'file') {
            	 var path = getPath(res.node.parents);
                 var data = {
         			type : 'post',
         			async : false,
         			path : path + res.node.text,
         			action: 'read_file'
         		}

                 callAjax('{{ route('source.editor') }}', data, 'callback', function(res) { editor.setValue(res.data); });
             }
        })
        .on('changed.jstree', function (e, res) {
			console.log('changed.jstree', res);
        }); 

		$(document).on('click', '#save_source', function(e) {
			var node = $('#jstree_demo_div').jstree().get_selected(true)[0];
			var path = getPath(node.parents) + node.text;
			var data = {
    			type : 'post',
    			async : false,
    			path : path,
    			content: editor.getValue(),
    			action: 'save_file'
    		}

            callAjax('{{ route('source.editor') }}', data, 'callback', function(res) {
            	if(res.code === 200) {
            		successAlert('Saved!!!');
    			}
            });
		});

	});
	</script>
@endsection