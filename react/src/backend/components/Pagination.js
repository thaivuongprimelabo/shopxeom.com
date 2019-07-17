import React, { Component } from 'react'

import * as types from '../redux/types/index';

import { connect } from 'react-redux';

class Pagination extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidUpdate(prevProps) {
    } 

    componentDidMount() {
    }

    onPageClick = (pageNo) => {
        console.log(pageNo);
    }

    render() {
        var pageNumber = [];
        var lastPage = 1;
        if(Object.keys(this.props.list).length) {
            var lastPage = this.props.list.last_page;
            var currentPage = this.props.list.current_page;
            var tmpFirstPage = [];
            var tmpLastPage = [];
            for(var i = 1; i <= lastPage; i++) {
                var cssClass = '';
                if(i === currentPage || i === (currentPage + 1) || i === (currentPage - 1)) {
                   
                    if(i === currentPage) {
                        cssClass = 'disabled';
                    }

                    tmpFirstPage.push(<li className={cssClass} key={i}>{<a className="page_number" href="javascript:void(0)" onClick={this.onPageClick.bind(this, i)}>{i}</a>}</li>)
                }

                if(i === lastPage || i === (lastPage - 1) || i === (lastPage - 2)) {
                    if(i === currentPage) {
                        cssClass = 'disabled';
                    }

                    tmpLastPage.push(<li className={cssClass} key={i}><a className="page_number" href="javascript:void(0)" onClick={this.onPageClick.bind(this, i)}>{i}</a></li>)
                }
                
            }

            pageNumber.push(tmpFirstPage);
            pageNumber.push(<li key={0}><a className="page_number" href="javascript:void(0)">...</a></li>);
            pageNumber.push(tmpLastPage);
        }

        return (
            <ul className="pagination pagination-sm no-margin pull-right">
                <li className="disabled"><span>«</span></li>
                {pageNumber}
                <li><a className="page_number" href="javascript:void(0)"  onClick={() => this.onPageClick(lastPage)}>»</a></li>
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
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Pagination);