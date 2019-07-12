import React, { Component } from 'react'

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

    render() {

        var subMenu;
        if(this.props.item.hasOwnProperty('sub_menu')) {
            var sub_menu = this.props.item.sub_menu;
            var keys = Object.keys(sub_menu);
            subMenu = keys.map((item, index) => {
                return <SidebarItem key={index} item={sub_menu[item]}></SidebarItem>
            });
        }
        

        return (
            <li className={ this.props.item.hasOwnProperty('sub_menu') ? 'treeview': '' }>
                <a href="#">
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


export default SidebarItem;