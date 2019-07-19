import React, { Component } from 'react';

import '../../../../../public/admin/plugins/iCheck/icheck.min.js';

class Checkbox extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
        
    } 

    componentDidMount() {

        var _self = this;

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
             radioClass: 'iradio_square-blue',
             increaseArea: '20%' /* optional */
        });
        
        $('input').on('ifChecked', function(event){
            if(_self.props.hasOwnProperty('setValue')) {
                _self.props.setValue(_self.props.element.value, _self.props.element.id);
            }
        });

        $('input').on('ifUnchecked', function(){
            if(_self.props.hasOwnProperty('setValue')) {
                _self.props.setValue('', _self.props.element.id);
            }
        });

        if(_self.props.element.isChecked === undefined || _self.props.element.isChecked) {
            $('input').iCheck('check')
            _self.props.setValue(_self.props.element.value, _self.props.element.id);
        }
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
                        ref={this.props.inputRef} />
                ) :
                (
                    <div className="checkbox">
                        <label>
                                <input type="checkbox" 
                                    name={name} 
                                    id={id}
                                    ref={this.props.inputRef} />&nbsp;&nbsp;<strong>{text}</strong>
                        </label>
                    </div>
                )}
            </label>
            
        )
    }
}


export default (Checkbox);