import React, { Component } from 'react'

import { Link, withRouter } from 'react-router-dom';

import { connect } from 'react-redux';

class SidebarItem extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
    }

    movePage = (routeName) => {
        console.log(this.props.history);
        this.props.history.push(routeName);
    }

    render() {

        var subMenu = null;
        var routeName = "/";
        var keys = null;
        if(this.props.item.hasOwnProperty('sub_menu')) {
            var sub_menu = this.props.item.sub_menu;
            keys = Object.keys(sub_menu);
            subMenu = keys.map((item, index) => {
                return <SidebarItem key={index} item={sub_menu[item]} routeName={item}></SidebarItem>
            });

            routeName = "/" + this.props.routeName;
            
        } else {
            routeName = "/" + this.props.routeName;
        }
        
        return (
            <li className={ this.props.item.hasOwnProperty('sub_menu') ? 'treeview': '' }>
                <a href="javascript:void(0)" onClick={() => this.movePage(routeName)}>
                    <i className={this.props.item.icon}></i> <span>{ this.props.item.title }</span>
                    {this.props.item.hasOwnProperty('sub_menu') &&
                        <span className="pull-right-container">
                        <i className="fa fa-angle-left pull-right"></i>
                        </span>
                    }
                </a>
                {this.props.item.hasOwnProperty('sub_menu') &&
                    <ul className="treeview-menu">
                        {subMenu}
                    </ul>
                }
            </li>
        )
    }
}


export default withRouter(SidebarItem);