import React, { Component } from 'react'

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


import '../../../../public/admin/bower_components/jquery/dist/jquery.min.js';
import '../../../../public/admin/bower_components/bootstrap/dist/js/bootstrap.min.js';
import '../../../../public/admin/plugins/iCheck/icheck.min.js';
import '../../../../public/admin/dist/js/adminlte.js';

import UserIcon160x160 from '../../../../public/admin/dist/img/user2-160x160.jpg';

import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

class Main extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {

        document.body.className="hold-transition skin-blue sidebar-mini";
        
    }

    render() {
        return (
            <div>
                <div class="wrapper">
                    <Header userIcon={ UserIcon160x160 } />
                    <Sidebar userIcon={ UserIcon160x160 } />
                    <div class="content-wrapper">
                    {this.props.children}
                    </div>
                    <Footer />
                </div>
            </div>
        )
    }
}

export default Main;