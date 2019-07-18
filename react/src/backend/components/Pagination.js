import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

import { getData } from '../redux/actions/index';

class Pagination extends Component {

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
    } 

    componentDidMount() {
    }

    onPageClick = (pageNo) => {
        this.params.page = pageNo;
        if(Object.keys(this.props.searchCondition).length) {
            this.params.searchCondition = this.props.searchCondition;
        }
        this.props.getData(this.params);
    }

    render() {
        var pageNumber = [];
        var lastPage = 1;
        var currentPage = 1;
        if(Object.keys(this.props.list).length) {
            var totalPages = this.props.list.last_page;
            var lastPage = this.props.list.last_page;
            var currentPage = this.props.list.current_page;
            var left = currentPage - 2;
            var right = currentPage + 2 + 1;
            var l;
            var tmp = [];
            for(var i = 1; i <= totalPages; i++) {
                var page = i;
                if(page <= 3 || page >= totalPages - 2 || page >= left && page < right) {
                    tmp.push(page);
                }
            }
            
            var tmp2 = [];
            for(let i of tmp) {
                if(l) {
                    if (i - l === 2) {
                        tmp2.push(l + 1);
                    } else if (i - l !== 1) {
                        if(!tmp2.includes(-2)) {
                            tmp2.push(-2);
                        } else {
                            tmp2.push(-3);
                        }
                        
                    }
                }
                tmp2.push(i);
                l = i;
            }

            for(let i of tmp2) {
                if(i < 0) {
                    pageNumber.push(<li key={0}><span>...</span></li>);
                } else {
                    if(i === currentPage) {
                        pageNumber.push(<li className="active" key={i}><span>{i}</span></li>);
                    } else {
                        pageNumber.push(<li key={i}><a className="page_number" href="javascript:void(0)" onClick={this.onPageClick.bind(this, i)}>{i}</a></li>);
                    }
                }
            }
        }
        

        return (
            <ul className="pagination pagination-sm no-margin pull-right">
                { currentPage === 1 ? 
                    (
                        <li className="disabled"><span>«</span></li>
                    ) :
                    (
                        <li><a className="page_number" href="javascript:void(0)" onClick={this.onPageClick.bind(this, 1)}>«</a></li>
                    )
                }
                {pageNumber}
                { currentPage === lastPage ? 
                    (
                        <li className="disabled"><span>»</span></li>
                    ) :
                    (
                        <li><a className="page_number" href="javascript:void(0)" onClick={this.onPageClick.bind(this, lastPage)}>»</a></li>
                    )
                }
            </ul>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        list: state.list
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        getData:(table, pageNo) => {
            dispatch(getData(table, pageNo));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);