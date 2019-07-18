import React, { Component } from 'react'

import { connect } from 'react-redux';

import { getSelectData } from '../../redux/actions/index';

class Select extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        }
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
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
            <div className="input-group"><span className="input-group-addon">
                <i className="fa fa-search"></i></span>
                <select className="form-control" onChange={ () => this.onChangeSelect(event) }>
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