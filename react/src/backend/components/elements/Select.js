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

        if(prevProps.save !== this.props.save) {
            if(Object.keys(this.props.save.error).length) {
                if(this.props.save.error.hasOwnProperty(this.props.element.id)) {
                    this.setState({
                        error: this.props.save.error[this.props.element.id]
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
            value:  e.target.value,
            error: ''
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
                <div className="input-group">
                    <span className="input-group-addon">
                        <i className={icon}></i>
                    </span>
                    <select className="form-control" id={element.id} name={element.name} onChange={ () => this.onChangeSelect(event) } value={this.state.value}>
                        {render}
                    </select>
                </div>
                <span className="help-block">{this.state.error}</span>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        select: state.select,
        progress: state.progress,
        save: state.save
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