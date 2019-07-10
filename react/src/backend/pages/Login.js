import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'; 

import '../../../../public/admin/bower_components/bootstrap/dist/css/bootstrap.min.css';
import '../../../../public/admin/bower_components/font-awesome/css/font-awesome.min.css';
import '../../../../public/admin/bower_components/Ionicons/css/ionicons.min.css';
import '../../../../public/admin/dist/css/AdminLTE.min.css';
import '../../../../public/admin/plugins/iCheck/square/blue.css';

import '../../../../public/admin/bower_components/jquery/dist/jquery.min.js';
import '../../../../public/admin/bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../../../../public/admin/plugins/iCheck/icheck.min.js';

// Redux
import { connect } from 'react-redux';

// Components
import ButtonSubmit from '../components/ButtonSubmit';

// Routes
import * as Routes from '../constants/routes';

// Actions
import { checkLogin, handleLogin } from '../redux/actions/index';

// React boostrap
import Alert from '../components/Alert';

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
    }

    componentDidMount() {

        document.body.className="hold-transition login-page";

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        });
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
        if(Object.keys(this.props.lang).length) {
            this.state.loginBoxTitle = this.props.lang.login_page_title;
            this.state.welcomeText = this.props.lang.login_page_top_text;
            this.state.rememberMeText = this.props.lang.remember_me;
            this.state.buttonLoginText = this.props.lang.button.login;
            this.state.emailPlaceholder = this.props.lang.email_placeholder;
            this.state.passwordPlaceholder = this.props.lang.password_placeholder;
        }

        // If login success
        var errors = {};
        if(this.props.auth.status) {
            return <Redirect to={Routes.DASHBOARD} />
        } else {
            errors = this.props.auth.error;
        }

        return (
            <div>
                <div className="login-box">
                    <Alert message={ this.props.exception.error } />
                    <div className="login-logo">
                        <a href="#">{ ReactHtmlParser(this.state.loginBoxTitle) }</a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">{ this.state.welcomeText }</p>

                        <form action="../../index2.html" method="post">
                            <div className={ errors.hasOwnProperty('email') ? 'form-group has-error' : 'form-group has-feedback' }>
                                <input type="email" className="form-control" placeholder={this.state.emailPlaceholder} value={this.state.form.email} onChange={ () => this.onHandleEmail(event) } />
                                <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                                <span className="help-block">{ errors.email }</span>
                            </div>
                            <div className={ errors.hasOwnProperty('password') ? 'form-group has-error' : 'form-group has-feedback' }>
                                <input type="password" className="form-control" placeholder={this.state.passwordPlaceholder} value={this.state.form.password} onChange={ () => this.onHandlePassword(event) } />
                                <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                                <span className="help-block">{ errors.password }</span>
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" /> { this.state.rememberMeText }
                                        </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <ButtonSubmit validator={validator}  text={this.state.buttonLoginText} redirectUrl={Routes.DASHBOARD} onButtonClick={this.onLoginClick} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        auth: state.auth,
        exception: state.exception
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