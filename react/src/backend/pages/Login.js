import React, { Component } from 'react'

import '../../../../public/admin/bower_components/bootstrap/dist/css/bootstrap.min.css';
import '../../../../public/admin/bower_components/font-awesome/css/font-awesome.min.css';
import '../../../../public/admin/bower_components/Ionicons/css/ionicons.min.css';
import '../../../../public/admin/dist/css/AdminLTE.min.css';
import '../../../../public/admin/plugins/iCheck/square/blue.css';

import '../../../../public/admin/bower_components/jquery/dist/jquery.min.js';
import '../../../../public/admin/bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../../../../public/admin/plugins/iCheck/icheck.min.js';

class Login extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {

        document.body.className="hold-transition login-page";

        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue',
            increaseArea: '20%' /* optional */
        });
    }

    render() {
        return (
            <div>
                <div className="login-box">
                    <div className="login-logo">
                        <a href="#"><b>React</b>JS</a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Chào bạn trở lại.Vui lòng đăng nhập</p>

                        <form action="../../index2.html" method="post">
                            <div className="form-group has-feedback">
                                <input type="email" className="form-control" placeholder="Email" />
                                <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="Password" />
                                <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                            </div>
                            <div className="row">
                                <div className="col-xs-8">
                                    <div className="checkbox icheck">
                                        <label>
                                            <input type="checkbox" /> Remember Me
                                        </label>
                                    </div>
                                </div>
                                <div className="col-xs-4">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">Sign In</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;