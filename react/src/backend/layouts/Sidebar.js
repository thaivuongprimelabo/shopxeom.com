import React, { Component } from 'react'

import { connect } from 'react-redux';

import SidebarItem from '../components/SidebarItem';

class Sidebar extends Component {

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
        var render;
        var userInfo = this.props.auth.data;
        var lang = this.props.lang;
        var sidebar = lang.sidebar;
        var keys = Object.keys(sidebar);
        var render = keys.map((item, index) => {
            return <SidebarItem key={index} item={sidebar[item]}></SidebarItem>
        });
        
        return (
            <div>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            <div className="pull-left image">
                                <img src={ userInfo.avatar } className="img-circle" alt="User Image" />
                            </div>
                            <div className="pull-left info">
                                <p>{userInfo.name}</p>
                                <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                            </div>
                        </div>
                        <ul className="sidebar-menu" data-widget="tree">
                            { render }
                        </ul>
                    </section>
                </aside>
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
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);