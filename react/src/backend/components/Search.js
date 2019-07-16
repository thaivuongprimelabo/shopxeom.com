import React, { Component } from 'react'

import { connect } from 'react-redux';

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
        return (
            <div className="box">
                <div className="box-body">
                    <form id="search_form">
                            <div className="form-group">
                                <div className="col-md-3">
                                    <div className="form-group has-feedback">
                                        <div className="input-group"><span className="input-group-addon"><i className="fa fa-search"></i></span>
                                        <input type="text" className="form-control" name="id" id="id" placeholder="Lọc theo mã đơn hàng" />
                                    </div>
                                    
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group has-feedback">
                                        <div className="input-group"><span className="input-group-addon"><i className="fa fa-search"></i></span>
                                        <input type="text" className="form-control" name="customer_name" id="customer_name" placeholder="Lọc theo tên khách hàng" />
                                    </div>
                                    
                                    </div>
                                </div>      
                                <div className="col-md-3">
                                    <div className="form-group has-feedback">
                                        <div className="input-group"><span className="input-group-addon"><i className="fa fa-search"></i></span>
                                            <input type="text" className="form-control" name="customer_phone" id="customer_phone" placeholder="Lọc theo số điện thoại" />
                                        </div>
                                    </div>
                                </div>        
                                <div className="col-md-3">
                                    <div className="form-group">
                                    <select className="form-control" name="status" id="status">
                                        <option value="">Lọc theo trạng thái</option>
                                        <option value="0">Đơn hàng mới</option><option value="1">Đang giao hàng</option><option value="2">Hoàn tất</option><option value="3">Đã hủy</option>
                                    </select>
                                    </div>
                                </div>
                                                                                                    
                                <div className="col-md-3">
                                    <div className="form-group has-feedback">
                                        <div className="input-group"><span className="input-group-addon"><i className="fa fa-calendar"></i></span>
                                            <input type="text" id="datepicker" className="form-control" name="created_at" placeholder="Lọc theo ngày đặt hàng" />
                                        </div>
                                    </div>        
                                </div>
                            </div>            
                            <div className="col-md-12" style={{'padding': '0', 'margin': '0'}}>
                                <div className="col-md-12">
                                    <button type="button" id="search" className="btn btn-primary pull-right" data-url="https://shopxeom.com/auth/orders/search"><i className="fa fa-search"></i> Tìm kiếm</button>
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
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Search);