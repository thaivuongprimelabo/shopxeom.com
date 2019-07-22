import React, { Component } from 'react'

import { connect } from 'react-redux';

import * as types from '../../redux/types/index';

import DefaultImage from '../../../../../public/upload/default_img.png';

class UploadFile extends Component {

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
        
    } 

    componentDidMount() {
        
    }
    

    render() {
        var render = <div className="form-group">
                        {element.hasOwnProperty('text') && <label>{element.text}</label>}
                        <div>
                            <input type="file" class="form-control" name={element.id} />
                            <div class="preview-area">
                                <img id="preview_upload_logo" src={DefaultImage} class="img-thumbnail"/>
                            </div>
                        </div>
                        <span className="help-block">{this.state.error}</span>
                    </div>
        
        return (
            <div>{render}</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(UploadFile);