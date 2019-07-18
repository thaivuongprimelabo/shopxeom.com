import React, { Component } from 'react'

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

import TableRow from '../components/TableRow';
import Checkbox from '../components/elements/Checkbox';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { Button } from 'react-bootstrap';

import * as types from '../redux/types/index';

class TableList extends Component {

    constructor(props) {
        super(props);

        this.params = {
            table: this.props.moduleName,
            page: 1
        }
    }

    componentWillMount() {
        
    }

    componentDidUpdate(prevProps) {
        if(prevProps.moduleName !== this.props.moduleName) {
            this.params.table = this.props.moduleName;
            this.props.getData(this.params); 
        }
    } 

    componentDidMount() {
        console.log('TableList:componentDidMount')
        this.props.getData(this.params);
    }

    render() {
        var colgroup = [];
        var thead = [];
        var tbody = [];
        var render = null;
        var lang = {};
        if(Object.keys(this.props.lang).length) {
            lang = this.props.lang;
            var tableHeaders = lang[this.props.moduleName].table_header;
            var keys = Object.keys(tableHeaders)
            for(var i = 0; i < keys.length; i++) {
                colgroup.push(<col key={i} width={tableHeaders[keys[i]].width} />);
                if(keys[i] === 'select_all') {
                    thead.push(<th key={i}><Checkbox /></th>);
                } else {
                    thead.push(<th key={i}>{tableHeaders[keys[i]].text}</th>);
                }
            }

            render = <Spinner />
            if(this.props.list.hasOwnProperty('data') && this.props.progress.type === types.END_PROGRESS) {
                if(this.props.list.data.length === 0) {
                    
                    tbody = <TableRow key={-1} header={tableHeaders} />

                    render = <div className="box">
                                <div className="box-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover" style={{'wordWrap' : 'break-word'}}>
                                            <colgroup>
                                                {colgroup}
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    {thead}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tbody}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                } else {
                    tbody = this.props.list.data.map((row, index) => {
                        return <TableRow key={index} row={row} header={tableHeaders} />
                    });
    
                    var totalText = lang.count.toString().replace(':count', this.props.list.total);
                    var removeButtonText = lang.button.remove;

                    render = <div className="box">
                                <div className="box-header">
                                    <div className="col-md-6">
                                        <Button variant="danger"><i className="fa fa-trash"></i> {removeButtonText}</Button>
                                        {ReactHtmlParser(totalText)}
                                    </div>
                                    <div className="col-md-6">
                                        <Pagination moduleName={this.props.moduleName} searchCondition={this.props.searchCondition} />
                                    </div>
                                </div>
                                <div className="box-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover" style={{'wordWrap' : 'break-word'}}>
                                            <colgroup>
                                                {colgroup}
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    {thead}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tbody}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="box-footer">
                                    <div className="col-md-12">
                                        <Pagination moduleName={this.props.moduleName} searchCondition={this.props.searchCondition} />
                                    </div>
                                </div>
                            </div>
                }

                
                
                
            }
        }

        

        return (
            <div>{render}</div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        list: state.list,
        progress: state.progress
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getData: (table) => {
            dispatch(getData(table));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(TableList);