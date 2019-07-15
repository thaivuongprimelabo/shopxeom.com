import React, { Component } from 'react'
import ReactHtmlParser from 'react-html-parser'; 

// Routes
import * as Routes from '../constants/routes';

// Redux
import { connect } from 'react-redux';

// React bootstrap
import { Button } from 'react-bootstrap';

// Actions
import { logout } from '../redux/actions/index';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
    }

    signOut = () => {
        this.props.logout();
    }

    render() {

        var headerTitle = '';
        var btnProfileText = '';
        var btnSigeoutText = '';
        var userInfo = this.props.auth.data;

        if(Object.keys(this.props.lang).length) {
            headerTitle = this.props.lang.dashboard_title;
            btnProfileText = this.props.lang.button.profile;
            btnSigeoutText = this.props.lang.button.logout;
        }

        return (
            <div>
                <header className="main-header">
                    <a href="#" className="logo">
                        <span className="logo-lg">{ ReactHtmlParser(headerTitle) }</span>
                    </a>
                    <nav className="navbar navbar-static-top">
                        <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </a>
                        <div className="navbar-custom-menu">
                            <ul className="nav navbar-nav">
                                <li className="dropdown user user-menu">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                        <img src={ userInfo.avatar } className="user-image" alt="User Image" />
                                        <span className="hidden-xs">{ userInfo.name }</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="user-header">
                                            <img src={ userInfo.avatar } className="img-circle" alt="User Image" />
                                            <p>
                                            { userInfo.name }
                                            </p>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <a href="#" className="btn btn-default btn-flat">{ btnProfileText }</a>
                                            </div>
                                            <div className="pull-right">
                                                <Button variant="btn btn-default btn-flat" onClick={ this.signOut }>{ btnSigeoutText }</Button>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </header>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        auth: state.auth
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        logout:() => {
            dispatch(logout());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);