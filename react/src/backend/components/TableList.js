import React, { Component } from 'react'

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

import { getData, remove } from '../redux/actions/index';

import TableRow from './TableRow';
import Checkbox from './elements/Checkbox';
import Pagination from './Pagination';
import Spinner from './Spinner';
import { Button } from 'react-bootstrap';

import * as types from '../redux/types/index';

class TableList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            row_delete_id: []
        }

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

        if(prevProps.progress !== this.props.progress) {
            if(this.props.list.type === types.REMOVE && this.props.progress.type === types.END_PROGRESS) {
                this.params.table = this.props.moduleName;
                this.props.getData(this.params); 
            }
        }
    } 

    componentDidMount() {
        this.props.getData(this.params);
    }

    onRemove = () => {
        if(confirm(this.props.lang.messages.CONFIRM_DELETE)) {
            this.props.onRemove({
                id: this.props.remove.ids,
                table: this.props.moduleName
            });
        }
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
                    var element = {
                        name: 'select_all',
                        id: 'select_all',
                        value: 1
                    }
                    thead.push(<th key={i}><Checkbox element={element} isList={true} /></th>);
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
                        return <TableRow key={index} row={row} header={tableHeaders} moduleName={this.props.moduleName} setValue={this.setValue} />
                    });
    
                    var totalText = lang.count.toString().replace(':count', this.props.list.total);
                    var removeButtonText = lang.button.remove;

                    render = <div className="box">
                                <div className="box-header">
                                    <div className="col-md-6">
                                        <Button variant="danger" onClick={this.onRemove}><i className="fa fa-trash"></i> {removeButtonText}</Button>
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
        progress: state.progress,
        remove: state.remove
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getData: (table) => {
            dispatch(getData(table));
        },
        onRemove: (data) => {
            dispatch(remove(data));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(TableList);