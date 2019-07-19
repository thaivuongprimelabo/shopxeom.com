import React, { Component } from 'react'

import { connect } from 'react-redux';

import * as types from '../../redux/types/index';

class Input extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ''
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
    }

    onChangeInput = (e) => {
        this.setState({ 
            value:  e.target.value
        });
        this.props.setValue(e.target.value, this.props.element.id);
    }
    

    render() {
        var icon = this.props.icon !== undefined ? this.props.icon : 'fa fa-pencil fa-fw';
        var element = this.props.element;
        var render = <input type="text" className="form-control" 
                        name={element.id} 
                        id={element.id} 
                        placeholder={element.placeholder}
                        value={this.state.value} 
                        onChange={ () => this.onChangeInput(event) }
                        ref={this.props.inputRef}
                    />;
        
        return (
            <div className="input-group"><span className="input-group-addon">
                <i className={icon}></i></span>
                {render}
                <span className="help-block"></span>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Input);