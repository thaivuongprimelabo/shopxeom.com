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

// Redux
import { connect } from 'react-redux';
import { checkLogin, loadLang } from '../redux/actions/index';

// Routes
import * as Routes from '../constants/routes';

// Types
import * as types from '../redux/types/index';

import Login from '../pages/Login';
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
    
            if(moduleName === 'dashboard') {
                content = <Dashboard />
            }

            if(moduleName === 'products') {
                content = <Products />
            }

            if(moduleName === 'categories') {
                content = <Categories />
            }

            if(moduleName === 'vendors') {
                content = <Vendors />
            }

            if(moduleName === 'orders') {
                content = <Orders />
            }

            if(moduleName === 'banners') {
                content = <Banners />
            }

            if(moduleName !== 'login') {
                render = <div className="wrapper" style={{ 'display': !show ? 'none' : 'block'}}>
                        <Header userIcon={ UserIcon160x160 } />
                        <Sidebar userIcon={ UserIcon160x160 } />
                        <div className="content-wrapper">
                        {content}
                        </div>
                        <Footer />
                    </div>;
            }
            
        }

        return (
            <div>
                {render}
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