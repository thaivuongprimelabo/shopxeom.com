import React, { Component } from 'react'

import { connect } from 'react-redux';

import { getSelectData } from '../../redux/actions/index';

import * as types from '../../redux/types/index';

class Select extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            error: ''
        }
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
        if(prevProps.progress !== this.props.progress) {
            if(this.props.progress.type === types.END_PROGRESS) {
                if(this.props.element.value !== undefined) {
                    this.setState({
                        value: this.props.element.value
                    })
                }
                
            }
        }
    } 

    componentDidMount() {
        this.props.getSelectData(this.props.element.table);
    }

    onChangeSelect = (e) => {
        this.setState({ 
            value:  e.target.value
        });
        this.props.setValue(e.target.value, this.props.element.id);
    }

    render() {

        var icon = this.props.icon !== undefined ? this.props.icon : 'fa fa-pencil fa-fw';
        var render = [];
        var element = this.props.element;
        var select_data = this.props.select[this.props.element.table];
        render.push(<option key={9999} value="">{element.hasOwnProperty('emptyText') ? element.emptyText : '---' }</option>);
        var i = 0;
        for(var index in select_data) {
            render.push(<option key={i} value={index}>{select_data[index]}</option>);
            i++;
        }
        
        return (
            <div className={this.state.error.length ? "form-group has-error" : "form-group"}>
                {element.hasOwnProperty('text') && <label>{element.text}</label>}
                <div className="input-group"><span className="input-group-addon">
                    <i className={icon}></i></span>
                    <select className="form-control" onChange={ () => this.onChangeSelect(event) } value={this.state.value}>
                        {render}
                    </select>
                    <span className="help-block"></span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        select: state.select,
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getSelectData:(key) => {
            dispatch(getSelectData(key));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Select);