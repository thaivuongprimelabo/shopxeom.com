import React, { Component } from 'react'

import ReactHtmlParser from 'react-html-parser';

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

import TableRow from '../components/TableRow';
import Checkbox from '../components/elements/Checkbox';
import Pagination from '../components/Pagination';
import { Button } from 'react-bootstrap';

import * as types from '../redux/types/index';

class TableList extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        
    }

    componentDidUpdate(prevProps) {
        if(prevProps.moduleName !== this.props.moduleName) {
            this.props.getData(this.props.moduleName); 
        }
    } 

    componentDidMount() {
        this.props.getData(this.props.moduleName);
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
            colgroup.push(<col key={9999} width="3%" />);
            thead.push(<th key={9999}><Checkbox value={'all'} /></th>);
            for(var i = 0; i < keys.length; i++) {
                colgroup.push(<col key={i} width={tableHeaders[keys[i]].width} />);
                thead.push(<th key={i}>{tableHeaders[keys[i]].text}</th>);
            }

            render = <div className="box"><div class='box-header text-center'><i class='fa fa-circle-o-notch fa-spin'></i> Đang tải dữ liệu</div></div>
            if(this.props.list.hasOwnProperty('data') && this.props.progress.type === types.END_PROGRESS) {
                console.log(this.props.list);
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
                                    <Pagination moduleName={this.props.moduleName} />
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
                                    <Pagination moduleName={this.props.moduleName} />
                                </div>
                            </div>
                        </div>
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