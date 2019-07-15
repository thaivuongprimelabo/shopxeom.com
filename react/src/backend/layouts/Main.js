import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';

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

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.checkLogin();
        console.log('componentWillMount')
    }

    componentDidUpdate(prevProps) {

        document.body.className="hold-transition skin-blue sidebar-mini";
        console.log('componentDidUpdate')

        // var Selector = {
        //     wrapper       : '.wrapper',
        //     contentWrapper: '.content-wrapper',
        //     layoutBoxed   : '.layout-boxed',
        //     mainFooter    : '.main-footer',
        //     mainHeader    : '.main-header',
        //     sidebar       : '.sidebar',
        //     controlSidebar: '.control-sidebar',
        //     fixed         : '.fixed',
        //     sidebarMenu   : '.sidebar-menu',
        //     logo          : '.main-header .logo'
        // };

        // var ClassName = {
        //     fixed         : 'fixed',
        //     holdTransition: 'hold-transition'
        // };
        
        // var footerHeight  = $(Selector.mainFooter).outerHeight() || 0;
        // var neg           = $(Selector.mainHeader).outerHeight() + footerHeight;
        // var windowHeight  = $(window).height();
        // var sidebarHeight = $(Selector.sidebar).height() || 0;

        // // Set the min-height of the content and sidebar based on
        // // the height of the document.
        // if ($('body').hasClass(ClassName.fixed)) {
        //     $(Selector.contentWrapper).css('min-height', windowHeight - footerHeight);
        // } else {
        //     var postSetHeight;

        //     if (windowHeight >= sidebarHeight) {
        //         $(Selector.contentWrapper).css('min-height', windowHeight - neg);
        //         postSetHeight = windowHeight - neg;
        //     } else {
        //         $(Selector.contentWrapper).css('min-height', sidebarHeight);
        //         postSetHeight = sidebarHeight;
        //     }

        //     // Fix for the control sidebar height
        //     var $controlSidebar = $(Selector.controlSidebar);
        //     if (typeof $controlSidebar !== 'undefined') {
        //         if ($controlSidebar.height() > postSetHeight)
        //         $(Selector.contentWrapper).css('min-height', $controlSidebar.height());
        //     }
        // }
        
    }

    componentDidMount() {
        console.log('componentDidMount')
    }

    render() {
        var render;
        var lang = this.props.lang;
        // Check login
        if(this.props.auth.type === types.CHECK_LOGIN) {
            if(!this.props.auth.status) {
                return <Redirect to={Routes.LOGIN} />
            }
        }

        // Logout
        if(this.props.auth.type === types.LOGOUT) {
            return <Redirect to={Routes.LOGIN} />
        }

        // if(Object.keys(lang).length) {
        //     render =    <div className="wrapper">
        //                     <Header userIcon={ UserIcon160x160 } />
        //                     <Sidebar userIcon={ UserIcon160x160 } />
        //                     <div className="content-wrapper">
        //                     {this.props.children}
        //                     </div>
        //                     <Footer />
        //                 </div>
        // }

        return (
            <div>
                <div className="wrapper">
                    <Header userIcon={ UserIcon160x160 } />
                    <Sidebar userIcon={ UserIcon160x160 } />
                    <div className="content-wrapper">
                    {this.props.children}
                    </div>
                    <Footer />
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Main);