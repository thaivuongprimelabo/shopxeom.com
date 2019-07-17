import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

import ThumbImage from './elements/ThumbImage';
import Status from './elements/Status';
import RemoveButton from './elements/RemoveButton';
import EditButton from './elements/EditButton';
import Checkbox from './elements/Checkbox';

class TableRow extends Component {

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

        var render;
        if(this.props.header !== undefined) {
            
            render = Object.keys(this.props.header).map((item, index) => {
                if(item.indexOf('image') >= 0) {
                    return <td key={index}><ThumbImage src={this.props.row[item]} /></td>
                }

                if(item.indexOf('status') >= 0 || item.indexOf('avail_flg') >= 0) {
                    return <td key={index}><Status status={this.props.row[item]} /></td>
                }

                if(item === 'remove_action') {
                    return <td key={index}><RemoveButton /></td>
                }

                if(item === 'edit_action') {
                    return <td key={index}><EditButton /></td>
                }

                return <td key={index}>{this.props.row[item]}</td>
            });
        }
        
        return (
            <tr>
                <td><Checkbox value={this.props.row.id}/></td>
                {render}
            </tr>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch, props) => {
    return {}
};


export default connect(mapStateToProps, mapDispatchToProps)(TableRow);