import React, { Component } from 'react'

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

import SidebarItem from '../components/SidebarItem';

import UserIcon160x160 from '../../../../public/admin/dist/img/user2-160x160.jpg';

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
        if(Object.keys(this.props.lang).length) {
            var sidebar = this.props.lang.sidebar;
            render = Object.keys(sidebar).map((item, index) => {
                return <SidebarItem key={index} item={sidebar[item]} routeName={item} ></SidebarItem>
            });
        }
        
        return (
            <div>
                <aside className="main-sidebar">
                    <section className="sidebar">
                        <div className="user-panel">
                            
                            <div className="pull-left image">
                                <img src={ userInfo.avatar ? userInfo.avatar : UserIcon160x160 } className="img-circle" alt="User Image" />
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Sidebar));