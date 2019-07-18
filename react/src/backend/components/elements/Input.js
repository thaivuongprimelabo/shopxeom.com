import React, { Component } from 'react'

import { connect } from 'react-redux';

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
                <i className="fa fa-search"></i></span>
                {render}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Input);