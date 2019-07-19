import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

import Input from './elements/Input';
import Select from './elements/Select';
import Checkbox from './elements/Checkbox';
import Spinner from './Spinner';
import { Button } from 'react-bootstrap';
import ButtonSubmit from './ButtonSubmit';

import * as types from '../redux/types/index';
import { save } from '../redux/actions/index';


class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {},
            table: this.props.moduleName
        }
    }

    componentWillMount() {
        
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
    }

    onBack = () => {
        this.props.history.replace("/" + this.props.moduleName);
    }

    onSave = () => {
        this.props.save(this.state);
    }

    setValue = (value, id) => {
        var form = {...this.state.form};
        if(value.toString().length > 0) {
            form[id] = value;
        } else {
            delete form[id];
        }

        this.setState({
            form: form
        })
    }

    render() {
        
        var render;
        var buttonBackText = '';
        var buttonSaveText = '';
        if(Object.keys(this.props.lang).length) {
            var lang = this.props.lang;
            var moduleName = this.props.moduleName;
            var action = this.props.action;
            buttonBackText = this.props.lang.button.back;
            buttonSaveText = this.props.lang.button.submit;
            
            if(lang[moduleName].hasOwnProperty('form')) {
                var formAction = lang[moduleName].form;
                
                render = Object.keys(formAction).map((item, index) => {
                    var formItem = formAction[item];
                    var type = formItem.type;
                    var control = null;

                    var element = {
                        id: item,
                        placeholder: formItem.hasOwnProperty('placeholder') ? formItem.placeholder : formItem.text,
                        emptyText: formItem.empty_text,
                        table: formItem.hasOwnProperty('table') ? formItem.table : item,
                        value: formItem.hasOwnProperty('value') ? formItem.value : '',
                    }

                    switch(type) {
                        case 'select':
                            control = <Select key={index} element={element} setValue={this.setValue} />
                            break;
                        case 'checkbox':
                            if (element.value.length === 0) element.value = 1;
                            control = <Checkbox key={index} element={element} text={formItem.text} setValue={this.setValue} />
                            break;
                        default:
                            control = <Input key={index} element={element} setValue={this.setValue} />
                            break;
                    }

                    return <div key={index} className="form-group">
                                { type !== 'checkbox' && <label>{formItem.text}</label> }
                                {control}
                            </div>;
                });
            }

            
        }


        return (
            <div className="box box-primary">
                <div className="box-header with-border">
                    <h3 className="box-title">Thông tin đăng ký</h3>
                </div>
                <div className="box-body">
                    {render}
                </div>
                <div className="box-footer">
                    <Button variant="default mr-1" onClick={this.onBack}><i className="fa fa-arrow-left" aria-hidden="true"></i> {buttonBackText}</Button>
                    <ButtonSubmit text={ buttonSaveText } icon={'fa fa-floppy-o'} cssClass={'primary pull-right'} onButtonClick={this.onSave} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        save: (form) => {
            dispatch(save(form))
        }
    }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));