import React, { Component } from 'react'

import { connect } from 'react-redux';

class Input extends Component {

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

        var element = this.props.element;
        var render = <input type="text" className="form-control" name={element.id} id={element.id} placeholder={element.placeholder} />;
        
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