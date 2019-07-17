import React, { Component } from 'react';

import '../../../../../public/admin/plugins/iCheck/icheck.min.js';

class Checkbox extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
        
    } 

    componentDidMount() {
        $('input').iCheck({
            checkboxClass: 'icheckbox_square-blue',
             radioClass: 'iradio_square-blue',
             increaseArea: '20%' /* optional */
        }); 
    }

    render() {

        return (
            <label><input type="checkbox" value={this.props.value} /></label>
        )
    }
}


export default (Checkbox);