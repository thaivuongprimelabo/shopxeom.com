$(window).resize(function () {
    var h = Math.max($(window).height() - 0, 420);
    $('#container, #data, #tree, #data .content').height(h).filter('.default').css('lineHeight', h + 'px');
}).resize();

$('#tree')
    .jstree({
        'core': {
            'data': {
                'url': url + '?operation=get_node',
                'data': function (node) {
                    return { 'id': node.id };
                }
            },
            'check_callback': function (o, n, p, i, m) {
                if (m && m.dnd && m.pos !== 'i') {
                    return false;
                }
                if (o === "move_node" || o === "copy_node") {
                    if (this.get_node(n).parent === this.get_node(p).id) {
                        return false;
                    }
                }
                return true;
            },
            'themes': {
                'responsive': false,
                'variant': 'small',
                'stripes': true
            }
        },
        'sort': function (a, b) {
            return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(b) ? 1 : -1);
        },
        'contextmenu': {
            'items': function (node) {
                var tmp = $.jstree.defaults.contextmenu.items();
                delete tmp.create.action;
                tmp.create.label = "新しい";
                tmp.create.submenu = {
                    "create_folder": {
                        "separator_after": true,
                        "label": "フォルダ",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            inst.create_node(obj, { type: "default" }, "last", function (new_node) {
                                setTimeout(function () {
                                    inst.edit(new_node);
                                }, 0);
                            });
                        }
                    },
                    "create_file": {
                        "label": "ファイル",
                        "action": function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            inst.create_node(obj, { type: "file" }, "last", function (new_node) {
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
        'types': {
            'default': { 'icon': 'folder' },
            'file': { 'valid_children': [], 'icon': 'file' }
        },
        'unique': {
            'duplicate': function (name, counter) {
                return name + ' ' + counter;
            }
        },
        'plugins': ['state', 'dnd', 'sort', 'types', 'contextmenu', 'unique']
    })
    .on('delete_node.jstree', function (e, data) {
        $.get(url + '?operation=delete_node', { 'id': data.node.id })
            .fail(function () {
                data.instance.refresh();
            });
    })
    .on('create_node.jstree', function (e, data) {
        $.get(url + '?operation=create_node', { 'type': data.node.type, 'id': data.node.parent, 'text': data.node.text })
            .done(function (d) {
                data.instance.set_id(data.node, d.id);
            })
            .fail(function () {
                data.instance.refresh();
            });
    })
    .on('rename_node.jstree', function (e, data) {
        $.get(url + '?operation=rename_node', { 'id': data.node.id, 'text': data.text })
            .done(function (d) {
                data.instance.set_id(data.node, d.id);
            })
            .fail(function () {
                data.instance.refresh();
            });
    })
    .on('move_node.jstree', function (e, data) {
        $.get(url + '?operation=move_node', { 'id': data.node.id, 'parent': data.parent })
            .done(function (d) {
                //data.instance.load_node(data.parent);
                data.instance.refresh();
            })
            .fail(function () {
                data.instance.refresh();
            });
    })
    .on('copy_node.jstree', function (e, data) {
        $.get(url + '?operation=copy_node', { 'id': data.original.id, 'parent': data.parent })
            .done(function (d) {
                //data.instance.load_node(data.parent);
                data.instance.refresh();
            })
            .fail(function () {
                data.instance.refresh();
            });
    })
    .on('changed.jstree', function (e, data) {
        if (data && data.selected && data.selected.length) {
            //console.log(data.node);
            if (data.node.icon == 'folder') {
                //$('#filename_text').html('&nbsp;');
                $('#foldername').val(data.node.id);
            } else if (data.node.icon == 'file file-jpg' || data.node.icon == 'file file-jpeg' || data.node.icon == 'file file-png' || data.node.icon == 'file file-gif' || data.node.icon == 'file file-bmp') {

            } else {
                $('#filename').val($.base64Encode(data.node.id));
                $('#filename_text').html(data.node.text);
                $('#foldername').val(data.node.parent);
            }
            $.get(url + '?operation=get_content&id=' + data.selected.join(':'), function (d) {
                if (d && typeof d.type !== 'undefined') {
                    //$('#data .content').hide();
                    var button = 'save';
                    switch (d.type) {
                        case 'text':
                        case 'txt':
                        case 'md':
                        case 'htaccess':
                        case 'log':
                        case 'sql':
                            editor.getSession().setMode("ace/mode/html");
                            editor.setValue(d.content, 1);
                            break;
                        case 'xml':
                            editor.getSession().setMode("ace/mode/xml");
                            editor.setValue(d.content, 1);
                            break;
                        case 'php':
                            editor.getSession().setMode("ace/mode/php");
                            editor.setValue(d.content, 1);
                            button = 'run';
                            break;
                        case 'js':
                            editor.getSession().setMode("ace/mode/javascript");
                            editor.setValue(d.content, 1);
                            break;
                        case 'json':
                            editor.getSession().setMode("ace/mode/json");
                            editor.setValue(d.content, 1);
                            break;
                        case 'css':
                            editor.getSession().setMode("ace/mode/css");
                            editor.setValue(d.content, 1);
                            break;
                        case 'html':
                            //$('#data .code').show();
                            //$('#code').val(d.content);
                            editor.getSession().setMode("ace/mode/html");
                            editor.setValue(d.content, 1);
                            button = 'run';
                            break;
                        case 'png':
                        case 'jpg':
                        case 'jpeg':
                        case 'bmp':
                        case 'gif':
                            /*
                            $('#data .image img').one('load', function () {
                                $(this).css({
                                    'marginTop': '-' + $(this).height() / 2 + 'px',
                                    'marginLeft': '-' + $(this).width() / 2 + 'px'
                                });
                            }).attr('src', d.content);
                            $('#data .image').show();*/
                            button = '';
                            break;
                        default:
                            //$('#data .default').html(d.content).show();
                            break;
                    }

                    if (button == 'run') {
                        $('.btn_run').html('<a onclick="run_code()" href="javascript:void(0)">Run</a>');
                    } else if (button == 'save') {
                        $('.btn_run').html('<a onclick="save_code()" href="javascript:void(0)">Save</a>');
                    } else {
                        $('.btn_run').html('<a href="javascript:void(0)"></a>');
                    }
                }
            });
        }
        else {
            //$('#data .content').hide();
            //$('#data .default').html('Select a file from the tree.').show();
        }
    });
