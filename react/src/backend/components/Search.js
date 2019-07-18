import React, { Component } from 'react'

import { connect } from 'react-redux';

import { Button } from 'react-bootstrap';
import ElementSearch from './elements/ElementSearch';
import Select from './elements/Select';
import Input from './elements/Input';
import InputDatePicker from './elements/InputDatePicker';
import TableList from './TableList';

import { getData } from '../redux/actions/index';

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchCondition: {}
        }

        this.params = {
            table: this.props.moduleName,
            page: 1
        }
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
    }

    onSearch = () => {
        this.params.searchCondition = this.state.searchCondition;
        this.props.getData(this.params);
    }

    setValue = (value, id) => {
        var searchCondition = {...this.state.searchCondition};
        if(value.length > 0) {
            searchCondition[id] = value;
        } else {
            delete searchCondition[id];
        }

        this.setState({
            searchCondition: searchCondition
        })
    }

    render() {
        var render;
        var searchRender;
        var searchButtonText = '';
        var control;
        if(Object.keys(this.props.lang).length) {
            searchButtonText = this.props.lang.button.search;
            var searchForm = this.props.lang[this.props.moduleName].search_form;
            if(searchForm !== undefined) {
                searchRender = Object.keys(searchForm).map((item, index) => {
                    var element = {
                        id: item,
                        placeholder: searchForm[item].placeholder,
                        emptyText: searchForm[item].empty_text,
                        table: searchForm[item].hasOwnProperty('table') ? searchForm[item].table : item
                    }
    
                    control = <Input key={index} element={element} setValue={this.setValue} />;
    
                    if(searchForm[item].type === 'select') {
                        searchForm[item]['value'] = item;
                        control = <Select key={index} element={element}  setValue={this.setValue} />
                    }
    
                    if(searchForm[item].type === 'calendar') {
                        searchForm[item]['value'] = item;
                        control = <InputDatePicker key={index} element={element}  setValue={this.setValue} />
                    }

                    return <ElementSearch key={index}>{control}</ElementSearch>;
                });

                render =  <div className="box">
                            <div className="box-body">
                                <form id="search_form">
                                        <div className="form-group">
                                            {searchRender}
                                        </div>            
                                        <div className="col-md-12" style={{'padding': '0', 'margin': '0'}}>
                                            <div className="col-md-12">
                                                <Button variant="primary pull-right" onClick={this.onSearch}><i className="fa fa-search"></i> {searchButtonText}</Button>
                                            </div>             
                                        </div>
                                </form>
                            </div>
                        </div>
            }
            
        }

        return (
            <div>
                {render}
                <TableList moduleName={this.props.moduleName} searchCondition={this.state.searchCondition}/>
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
        getData:(table) => {
            dispatch(getData(table));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Search);