import React, { Component } from 'react'

import { withRouter } from 'react-router-dom';

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

import ThumbImage from './elements/ThumbImage';
import Status from './elements/Status';
import RemoveButton from './elements/RemoveButton';
import EditButton from './elements/EditButton';
import Checkbox from './elements/Checkbox';

import Utils from '../helpers/Utils';

import { edit } from '../redux/actions/index';

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

    onEdit = () => {
        this.props.edit(this.props.row);
        this.props.history.replace(this.props.moduleName + "/edit");
    }

    render() {

        var render;
        if(this.props.header !== undefined) {
            if(this.props.row !== undefined) {
                render = Object.keys(this.props.header).map((item, index) => {

                    var value = this.props.row[item];

                    if(item === 'select_all') {
                        var element = {
                            name: 'select_row',
                            value: this.props.row.id,
                            isChecked: false
                        }
                        return <td key={index}><Checkbox element={element}  isList={true} /></td>
                    }

                    if(item.indexOf('image') >= 0 || item === 'logo' || item === 'banner' || item === 'avatar' || item === 'photo') {
                        return <td key={index}><ThumbImage src={value} /></td>
                    }
    
                    if(item.indexOf('status') >= 0 || item.indexOf('avail_flg') >= 0) {
                        if(item.indexOf('status') >= 0) {
                            value = this.props.row.status;
                        }
                        return <td key={index}><Status status={value} type={item} /></td>
                    }
    
                    if(item === 'action') {
                        var removeButton;
                        var editButton;
                        if(this.props.header[item].remove) {
                            removeButton = <RemoveButton />;
                        }
                        if(this.props.header[item].edit) {
                            editButton = <EditButton key={index} onEdit={this.onEdit}/>;
                        }
                        return <td key={index}>{removeButton}&nbsp;&nbsp;{editButton}</td>
                    }

                    if(item === 'created_at' || item === 'updated_at') {
                        return <td key={index}>{Utils.formatDate(value)}</td>
                    }
    
                    return <td key={index}>{value}</td>
                });
            } else {
                render = <td colSpan={Object.keys(this.props.header).length} style={{textAlign: 'center'}}>{this.props.lang.no_data_found}</td>
            }
            
        }
        
        return (
            <tr>
                {render}
            </tr>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        edit: (row) => {
            dispatch(edit(row));
        }
    }
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TableRow));