import React, { Component } from 'react'

import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import ElementSearch from './elements/ElementSearch';
import Select from './elements/Select';
import Input from './elements/Input';
import InputDatePicker from './elements/InputDatePicker';

class Search extends Component {

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

        var render;
        var searchButtonText = '';
        if(Object.keys(this.props.lang).length) {
            searchButtonText = this.props.lang.button.search;
            var searchForm = this.props.lang[this.props.moduleName].search_form;
            render = Object.keys(searchForm).map((item, index) => {
                var element = {
                    id: item,
                    placeholder: searchForm[item].placeholder,
                    emptyText: searchForm[item].empty_text,
                    table: searchForm[item].hasOwnProperty('table') ? searchForm[item].table : item
                }

                var control = <Input key={index} element={element} />;

                if(searchForm[item].type === 'select') {
                    searchForm[item]['value'] = item;
                    control = <Select key={index} element={element} />
                }

                if(searchForm[item].type === 'calendar') {
                    searchForm[item]['value'] = item;
                    control = <InputDatePicker key={index} element={element} />
                }

                return  <ElementSearch key={index}>{control}</ElementSearch>
            });
        }

        return (
            <div className="box">
                <div className="box-body">
                    <form id="search_form">
                            <div className="form-group">
                                {render}
                            </div>            
                            <div className="col-md-12" style={{'padding': '0', 'margin': '0'}}>
                                <div className="col-md-12">
                                    <Button variant="primary pull-right"><i className="fa fa-search"></i> {searchButtonText}</Button>
                                </div>             
                            </div>
                    </form>
                </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(Search);