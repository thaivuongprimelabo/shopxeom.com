import React, { Component } from 'react'
import { Link } from 'react-router-dom';

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

        this.state = {
            title: '',
            buttonProfileText: '',
            buttonSignoutText: '',
            userInfo: {}
        }
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth !== this.props.auth) {
            this.setState({
                userInfo: nextProps.auth.data,
            })
        }

        if(nextProps.lang !== this.props.lang) {
            this.setState({
                buttonProfileText: nextProps.lang.button.profile,
                buttonSignoutText: nextProps.lang.button.logout
            })
        }
    } 

    componentDidMount() {

    }

    signOut = () => {
        this.props.logout();
    }

    render() {
        return (
            <div>
                <header className="main-header">
                    <a href="#" className="logo">
                        <span className="logo-mini"><b>R</b>JS</span>
                        <span className="logo-lg"><b>React</b>JS</span>
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
                                        <img src={ this.state.userInfo.avatar } className="user-image" alt="User Image" />
                                        <span className="hidden-xs">{ this.state.userInfo.name }</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="user-header">
                                            <img src={ this.state.userInfo.avatar } className="img-circle" alt="User Image" />
                                            <p>
                                            { this.state.userInfo.name }
                                            </p>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <a href="#" className="btn btn-default btn-flat">{ this.state.buttonProfileText }</a>
                                            </div>
                                            <div className="pull-right">
                                                <Button variant="btn btn-default btn-flat" onClick={ this.signOut }>{ this.state.buttonSignoutText }</Button>
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