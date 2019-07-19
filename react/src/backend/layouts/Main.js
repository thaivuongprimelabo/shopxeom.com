import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom';
import loadjs from 'loadjs';

import '../../../../public/admin/bower_components/bootstrap/dist/css/bootstrap.min.css';
import '../../../../public/admin/bower_components/font-awesome/css/font-awesome.min.css';
import '../../../../public/admin/bower_components/Ionicons/css/ionicons.min.css';
import '../../../../public/admin/bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css';
import '../../../../public/admin/plugins/timepicker/bootstrap-timepicker.min.css';
import '../../../../public/admin/dist/css/AdminLTE.min.css';
import '../../../../public/admin/plugins/iCheck/square/blue.css';
import '../../../../public/admin/bower_components/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css';
import '../../../../public/admin/dist/css/skins/_all-skins.min.css';
import '../../../../public/admin/css/custom-styles.css';

import '../../../../public/admin/bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../../../../public/admin/plugins/iCheck/icheck.min.js';
import '../../../../public/admin/dist/js/adminlte.js';

import UserIcon160x160 from '../../../../public/admin/dist/img/user2-160x160.jpg';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Form from '../components/Form';
import Alert from '../components/Alert';

// Redux
import { connect } from 'react-redux';
import { checkLogin, loadLang } from '../redux/actions/index';

// Routes
import * as Routes from '../constants/routes';

// Types
import * as types from '../redux/types/index';

import Search from '../components/Search';
import TableList from '../components/TableList';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Vendors from '../pages/Vendors';
import Orders from '../pages/Orders';
import Banners from '../pages/Banners';

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.checkLogin();

        console.log('Main:componentWillMount');
    }

    componentDidMount() {
        console.log('Main:componentDidMount');
    }

    componentDidUpdate(prevProps) {

        if(this.props.match.params.module !== 'login') {
            document.body.className="hold-transition skin-blue sidebar-mini";
        } else {
            document.body.className="hold-transition login-page";
        }

        
    }

    render() {
        var content = '';
        var render = '';
        var show = false;
        
        var lang = this.props.lang;
        if(lang.hasOwnProperty(this.props.match.params.module)) {
            document.title = lang[this.props.match.params.module].list_title;
        }

        // Check login
        if(this.props.auth.type === types.CHECK_LOGIN) {
            if(!this.props.auth.status) {
                window.location = Routes.BASENAME + Routes.LOGIN;
            } else {
                show = true;
            }
        }

        // Logout
        if(this.props.auth.type === types.LOGOUT) {
            window.location = Routes.BASENAME + Routes.LOGIN;
        }

        if(this.props.match.params.module !== undefined) {
            
            var moduleName = this.props.match.params.module;
            var action = this.props.match.params.action;
            var content = <Search moduleName={moduleName} />
            
            var title = '';
            if(Object.keys(this.props.lang).length) {
                if(this.props.lang.hasOwnProperty(moduleName)) {
                    title = this.props.lang[moduleName].list_title;
                    if(action !== undefined) {
                        content = <Form moduleName={moduleName} action={action} />;
                        title = this.props.lang[moduleName].create_title;
                    }
        
                }
            }
           
            render = <div className="wrapper" style={{ 'display': !show ? 'none' : 'block'}}>
                        <Header userIcon={ UserIcon160x160 } />
                        <Sidebar userIcon={ UserIcon160x160 } />
                        <div className="content-wrapper">
                            <section className="content-header">
                                <h1>
                                    {title}
                                </h1>
                                <ol className="breadcrumb">
                                    <li><a href="javascript:void(0)"><i className="fa fa-dashboard"></i> Trang chủ</a></li>
                                    <li className="active">{title}</li>
                                </ol>
                            </section>
                            <section className="content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        {content}
                                    </div>
                                </div>
                            </section>
                        </div>
                        <Footer />
                    </div>;
        }

        return (
            <div>
                {render}
                <Alert />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        auth: state.auth,
        progress: state.progress,
        config: state.config
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        checkLogin:() => {
            dispatch(checkLogin());
        }
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));