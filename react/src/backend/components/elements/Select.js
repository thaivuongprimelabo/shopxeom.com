import React, { Component } from 'react'

import { connect } from 'react-redux';

import { getSelectData } from '../../redux/actions/index';

class Select extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
        this.props.getSelectData(this.props.element.table);
    }

    render() {

        var render = [];
        var element = this.props.element;
        var select_data = this.props.select[this.props.element.table];
        render.push(<option key={9999} value="">{element.hasOwnProperty('emptyText') ? element.emptyText : '---' }</option>);
        for(var index in select_data) {
            render.push(<option key={index} value={index}>{select_data[index]}</option>);
        }
        
        return (
            <div className="input-group"><span className="input-group-addon">
                <i className="fa fa-search"></i></span>
                <select className="form-control">
                    {render}
                </select>
            </div>
            
        )
    }
}

const mapStateToProps = (state) => {
    return {
        select: state.select
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