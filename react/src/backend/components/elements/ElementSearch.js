import React, { Component } from 'react'

class ElementSearch extends Component {

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
        return (
            <div className="col-md-3">
                <div className="form-group has-feedback">
                    {this.props.children}
                </div>
            </div>
        )
    }
}


export default ElementSearch;