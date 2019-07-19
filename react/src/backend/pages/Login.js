import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

import '../../../../public/admin/bower_components/bootstrap/dist/css/bootstrap.min.css';
import '../../../../public/admin/bower_components/font-awesome/css/font-awesome.min.css';
import '../../../../public/admin/bower_components/Ionicons/css/ionicons.min.css';
import '../../../../public/admin/dist/css/AdminLTE.min.css';
import '../../../../public/admin/plugins/iCheck/square/blue.css';

import '../../../../public/admin/bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../../../../public/admin/plugins/iCheck/icheck.min.js';

// Redux
import { connect } from 'react-redux';

// Components
import ButtonSubmit from '../components/ButtonSubmit';

// Routes
import * as Routes from '../constants/routes';

// Actions
import { checkLogin, handleLogin, loadConfig, loadLang } from '../redux/actions/index';

// React boostrap
import Alert from '../components/Alert';

// Types
import * as types from '../redux/types/index';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loginBoxTitle: '',
            welcomeText: '',
            rememberMeText: '',
            buttonLoginText: '',
            emailPlaceholder:'',
            passwordPlaceholder:'',
            form: {
                email: 'super.admin@admin.com',
                password: '',
            }
        }
    }

    componentWillMount() {
        this.props.checkLogin();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.auth !== this.props.auth) {
            if(!this.props.auth.status) {
                var errors = {...this.state.error};
                errors = this.props.auth.error;
                if(Object.keys(errors).length > 0) {
                    this.setState({ 
                        validator: false,
                        error: errors 
                    });
                }
            }
        }

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        });
    }

    componentDidMount() {

        document.body.className="hold-transition login-page";
    }

    onLoginClick = () => {
        this.props.handleLogin(this.state.form);
    }

    onHandleEmail = (event) => {
        var form = {...this.state.form};
        form.email = event.target.value;
        this.setState({ form });
    }

    onHandlePassword = (event) => {
        var form = {...this.state.form};
        form.password = event.target.value;
        this.setState({ form });
    }

    render() {

        var render;
        var lang = this.props.lang;

        // If login success
        var errors = {};
        if(this.props.auth.type === types.HANDLE_LOGIN && this.props.auth.status) {
            window.location = Routes.BASENAME + Routes.DASHBOARD;
        }

        // If Login failed
        if(this.props.auth.type === types.HANDLE_LOGIN && !this.props.auth.status) {
            errors = this.props.auth.error;
        }

        if(Object.keys(lang).length) {
            render = <div className="login-box">
                        <Alert />
                        <div className="login-logo">
                            <a href="#">{ ReactHtmlParser(this.props.config.web_title) }</a>
                        </div>
                        <div className="login-box-body">
                            <p className="login-box-msg">{ lang.login_page_top_text }</p>

                            <form action="../../index2.html" method="post">
                                <div className={ errors.hasOwnProperty('email') ? 'form-group has-error' : 'form-group has-feedback' }>
                                    <input type="email" className="form-control" placeholder={lang.email_placeholder} value={this.state.form.email} onChange={ () => this.onHandleEmail(event) } />
                                    <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                                    <span className="help-block">{ errors.email }</span>
                                </div>
                                <div className={ errors.hasOwnProperty('password') ? 'form-group has-error' : 'form-group has-feedback' }>
                                    <input type="password" className="form-control" placeholder={lang.password_placeholder} value={this.state.form.password} onChange={ () => this.onHandlePassword(event) } />
                                    <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                                    <span className="help-block">{ errors.password }</span>
                                </div>
                                <div className="row">
                                    <div className="col-xs-8">
                                        <div className="checkbox icheck">
                                            <label>
                                                <input type="checkbox" /> { lang.remember_me }
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <ButtonSubmit text={ lang.button.login } onButtonClick={this.onLoginClick} />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
        }

        return (
            <div>
                { render }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        auth: state.auth,
        config: state.config
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        checkLogin:() => {
            dispatch(checkLogin());
        },
        handleLogin:(form) => {
            dispatch(handleLogin(form));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);