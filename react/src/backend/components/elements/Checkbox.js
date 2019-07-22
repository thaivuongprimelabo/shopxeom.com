import React, { Component } from 'react';

import '../../../../../public/admin/plugins/iCheck/icheck.min.js';

import * as types from '../../redux/types/index';

import { connect } from 'react-redux';

import { setRemoveIds } from '../../redux/actions/index';

class Checkbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
        if(prevProps.progress !== this.props.progress) {
            if(this.props.progress.type === types.END_PROGRESS) {
                if(this.props.element.value && this.props.isList === undefined) {
                    $('input').iCheck('check')
                } else {
                    $('input').iCheck('uncheck')
                }
            }
        }
        
    } 

    componentDidMount() {

        var _self = this;
        
        this.setState({
            value: _self.props.element.value
        })

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
             radioClass: 'iradio_square-blue',
             increaseArea: '20%' /* optional */
        });
        
        $('input').on('ifChecked', function(event){
            // var ids = [];
            // if($(this).attr('id') !== 'select_all') {
            //     if(_self.props.hasOwnProperty('setValue')) {
            //         var value = ($(this).iCheck('update')[0].value);
            //         ids.push(value);
            //         _self.props.setValue(ids, _self.props.element.id);
            //     }
            // } else {
            //     $('input[name="select_row"]').each(function(index, item) {
            //         $(item).iCheck('check');
            //         ids.push(item.value);
            //     });
            //     _self.props.setValue(ids, _self.props.element.id);
            // }
            var ids = [];
            if($(this).attr('id') === 'select_all') {
                $('input[name="select_row"]').each(function(index, item) {
                    $(item).iCheck('check');
                    ids.push(item.value);
                });
            } else {
                var value = ($(this).iCheck('update')[0].value);
                ids = _self.props.remove.ids;
                ids.push(value);
            }
            _self.props.setRemoveIds(ids);
        });

        $('input').on('ifUnchecked', function(){
            var new_ids = [];
            if($(this).attr('id') === 'select_all') {
                $('input[name="select_row"]').each(function(index, item) {
                    $(item).iCheck('uncheck');
                });
            } else {
                var value = ($(this).iCheck('update')[0].value);
                var ids = _self.props.remove.ids;
                ids.map((id, index) => {
                    if(value !== id) {
                        new_ids.push(id);
                    }
                });
            }
            
            _self.props.setRemoveIds(new_ids);
        });
    }

    render() {
        
        var text = this.props.text !== undefined ? this.props.text : '';
        var element = this.props.element;
        var name = element.hasOwnProperty('name') ? element.name : '';
        var id = element.hasOwnProperty('id') ? element.id : '';
        var isList = this.props.isList !== undefined ? this.props.isList : false;
        return (
            <label>
                { isList ? (
                    <input type="checkbox" 
                        name={name} 
                        id={id}
                        value={element.value} />
                ) :
                (
                    <div className="checkbox">
                        <label>
                                <input type="checkbox" 
                                    name={name} 
                                    id={id}
                                    value={element.value} />&nbsp;&nbsp;<strong>{text}</strong>
                        </label>
                    </div>
                )}
            </label>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        progress: state.progress,
        validate: state.validate,
        remove: state.remove
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setRemoveIds: (ids) => {
            dispatch(setRemoveIds(ids));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Checkbox);