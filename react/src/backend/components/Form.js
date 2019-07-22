import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

import Input from './elements/Input';
import Select from './elements/Select';
import Checkbox from './elements/Checkbox';
import UploadFile from './elements/UploadFile';
import { Button } from 'react-bootstrap';
import ButtonSubmit from './ButtonSubmit';

import * as types from '../redux/types/index';
import { save, alertSuccess, alertError, setRowEdit } from '../redux/actions/index';


class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            form: {},
            rules: this.props.lang[this.props.moduleName].rules,
            table: this.props.moduleName
        }
    }

    componentWillMount() {
        
    }

    componentDidUpdate(prevProps) {
        if(prevProps.save !== this.props.save) {
            if(this.props.save.status) {
                this.props.alertSuccess(this.props.save.message);
                if(this.state.form.id) {
                    this.props.setRowEdit(this.props.save.data);
                }
            } else {
                this.props.alertError(this.props.save.message);
            }
        }
    } 

    componentDidMount() {
        if(Object.keys(this.props.edit).length) {
            this.setState({
                form: this.props.edit
            })
        }
    }

    onBack = () => {
        this.props.history.replace("/" + this.props.moduleName);
    }

    onSave = () => {
        this.props.onSave(this.state);
    }

    setValue = (value, id) => {
        var form = {...this.state.form};
        if(value.toString().length > 0) {
            form[id] = value;
        } else {
            form[id] = 0;
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
                var editData = this.props.edit;
                
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
                        text: formItem.hasOwnProperty('text') ? formItem.text : '',
                    }

                    if(Object.keys(editData).length) {
                        element.value = editData[item];
                    }

                    switch(type) {
                        case 'select':
                            control = <Select key={index} element={element} setValue={this.setValue} />
                            break;
                        case 'checkbox':
                            if (element.value.length === 0) element.value = 1;
                            control = <Checkbox key={index} element={element} text={formItem.text} setValue={this.setValue} />
                            break;
                        case 'upload_logo':
                            control = <UploadFile key={index} element={element} />
                            break;
                        default:
                            control = <Input key={index} element={element} setValue={this.setValue} />
                            break;
                    }

                    return <div key={index}>
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
        progress: state.progress,
        list: state.list,
        edit: state.edit,
        save: state.save
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onSave: (form) => {
            dispatch(save(form))
        },
        alertSuccess: (message) => {
            dispatch(alertSuccess(message));
        },
        alertError: (message) => {
            dispatch(alertError(message));
        },
        setRowEdit: (row) => {
            dispatch(setRowEdit(row));
        }
    }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));