import React, { Component } from 'react'
import { Link } from 'react-router-dom';

class Header extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {

    } 

    componentDidMount() {
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
                                        <img src={ this.props.userIcon } className="user-image" alt="User Image" />
                                        <span className="hidden-xs">Alexander Pierce</span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li class="user-header">
                                            <img src={ this.props.userIcon } class="img-circle" alt="User Image" />

                                            <p>
                                            Alexander Pierce - Web Developer
                                            <small>Member since Nov. 2012</small>
                                            </p>
                                        </li>
                                        <li className="user-footer">
                                            <div className="pull-left">
                                                <a href="#" className="btn btn-default btn-flat">Profile</a>
                                            </div>
                                            <div className="pull-right">
                                                <Link to="/login" className="btn btn-default btn-flat">Sign Out</Link>
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

export default Header;