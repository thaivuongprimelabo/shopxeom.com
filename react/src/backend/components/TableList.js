import React, { Component } from 'react'

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

import TableRow from '../components/TableRow';

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
        
        if(Object.keys(this.props.lang).length) {
            var tableHeaders = this.props.lang[this.props.moduleName].table_header;
            var keys = Object.keys(tableHeaders)
            colgroup.push(<col key={9999} width="3%" />);
            thead.push(<th key={9999}><input type="checkbox" className="row-delete" /></th>);
            for(var i = 0; i < keys.length; i++) {
                colgroup.push(<col key={i} width={tableHeaders[keys[i]].width} />);
                thead.push(<th key={i}>{tableHeaders[keys[i]].text}</th>);
            }
        }
        if(this.props.list.hasOwnProperty('data')) {
            tbody = this.props.list.data.map((row, index) => {
                return <TableRow key={index} row={row} header={tableHeaders} />
            });
        }
        return (
            <div className="box">
                <div className="box-header">
                    <div className="col-md-6">
                        <button type="button" id="remove_many" className="btn btn-danger" data-url="https://shopxeom.com/auth/orders/remove"><i className="fa fa-trash"></i> Xóa</button>
                        &nbsp;&nbsp;(Tìm thấy tất cả 53 dòng dữ liệu)
                    </div>
                    <div className="col-md-6">
  		                <ul className="pagination pagination-sm no-margin pull-right">
                            <li className="disabled"><span>«</span></li>
                            <li className="active"><span>1</span></li>
                            <li><a className="page_number" href="javascript:void(0)" data-page="2">2</a></li>
                            <li><a className="page_number" href="javascript:void(0)" data-page="3">3</a></li>
                            <li><a className="page_number" href="javascript:void(0)" data-page="4">4</a></li>
                            <li><a className="page_number" href="javascript:void(0)" data-page="5">5</a></li>
                            <li><a className="page_number" href="javascript:void(0)" data-page="6">6</a></li>
                            <li><a className="page_number" href="javascript:void(0)" data-page="6" rel="next">»</a></li>
                        </ul>
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
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        lang: state.lang,
        list: state.list
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