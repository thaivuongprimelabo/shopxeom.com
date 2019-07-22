import React, { Component } from 'react'

import { connect } from 'react-redux';

import * as types from '../../redux/types/index';

class Input extends Component {

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
    }

    onChangeInput = (e) => {
        this.setState({ 
            value:  e.target.value,
            error: ''
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
            <div className={this.state.error.length ? "form-group has-error" : "form-group"}>
                {element.hasOwnProperty('text') && <label>{element.text}</label>}
                <div className="input-group">
                    <span className="input-group-addon">
                        <i className={icon}></i>
                    </span>
                    {render}
                </div>
                <span className="help-block">{this.state.error}</span>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        progress: state.progress,
        save: state.save
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Input);