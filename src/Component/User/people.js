// Import require modules

import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navigation from '../Common/Navigation';
import Footer from '../Common/Footer';
import Service from '../../Services/service';
import Auth from '../../Authantication/Auth';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';
import moment from 'moment';

export default class People extends React.Component {

    // Declare constructor 

    constructor(props) {
        super(props);

        // Declare state variables, methods and class objects for use this page

        this.services = new Service();
        this.auth = new Auth();

        this.onCloseModel = this.onCloseModel.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);

        this.state = {
            peoples: [],
            uid: '',
            removemodelshow: false,
            removeid: '',
            defaultdata: [],
            disdetail: false,
            userupdatedata: []
        };

        this.auth.authantication();

    }

    // Declare componentDidMount method for mount some data and methods on load this page

    componentDidMount() {

        let decryptedData_uid = localStorage.getItem('uid');
        var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
        var userid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));

        this.setState({
            uid: userid
        });

        this.getAllPeople(userid);

    }

    // Declare getAllPeople method for get all people which added in default group

    getAllPeople(userid) {

        let decryptedData_uid = localStorage.getItem('uid');
        var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
        var userid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));

        var data = {
            uid: userid
        }

        this.services.senddata('GetPeopleList', data);
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'PeopleList':

                    this.setState({
                        peoples: res.data
                    })

                    break;
            }
        });
    }

    // Declare onRemove method for open confirmation model of delete people

    onRemove(id) {

        this.setState({
            removemodelshow: true,
            removeid: id
        })
        this.state.removemodelshow = true;

    }

    // Declare onDeleteSubmit method for delete people

    onDeleteSubmit(e) {
        e.preventDefault();

        var data = {
            uid: this.state.uid,
            RmId: this.state.removeid
        }

        this.services.senddata('RemovePeople', data);
        this.setState({
            removeid: '',
            removemodelshow: false
        })
        this.state.removemodelshow = false;

        alertify.success("Deleted Successfully");

        // this.services.getdata().subscribe((res) => {
        //     switch (res.event) {
        //         case 'PeopleList':
        //             this.setState({
        //                 peoples: res.data,
        //                 removeid: '',
        //                 removemodelshow: false
        //             })
        //             this.state.removemodelshow = false;
        //             break;
        //     }
        // });

    }

    // Declare getdetail method for get details latitude and longitude of people

    getdetail(id) {

        this.setState({
            disdetail: true
        })
        this.state.disdetail = true;


        var data = {
            uid: id
        }

        this.setState({
            userupdatedata: []
        });

        this.services.senddata('userDetails', data);
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'userDetails':
                    this.setState({
                        userupdatedata: res.data
                    })
                    let userArray = []
                    for (var i = 0; i < res.data.length; i++) {
                        let decryptedData_lat = res.data[i].latitude;
                        var bytes_lat = CryptoJS.AES.decrypt(decryptedData_lat.toString(), 'Location-Sharing');
                        var lat = JSON.parse(bytes_lat.toString(CryptoJS.enc.Utf8))

                        let decryptedData_long = res.data[i].longitude;
                        var bytes_long = CryptoJS.AES.decrypt(decryptedData_long.toString(), 'Location-Sharing');
                        var long = JSON.parse(bytes_long.toString(CryptoJS.enc.Utf8));

                        var timestamp = res.data[i].cd;
                        let obj = {
                            lat: parseFloat(lat).toFixed(4),
                            long: parseFloat(long).toFixed(4),
                            cd: timestamp
                        }
                        userArray.push(obj)
                    }

                    this.setState({
                        userupdatedata: userArray
                    });

                    break;
            }
        });

    }

    // Declare onCloseModel method for close model of delete confirmation

    onCloseModel() {
        this.setState({
            removemodelshow: false,
            disdetail: false
        })
        this.state.removemodelshow = false;
        this.state.disdetail = false;
    }

    // Render HTML page and return it

    render() {

        return (

            <div id="wrapper">
                <Sidebar />
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">

                        <Navigation />

                        <div className="container-fluid">

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card shadow mb-4">
                                        <div className="card-header py-3">
                                            <h6 className="m-0 font-weight-bold text-primary">People List</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.peoples ?
                                                            this.state.peoples.map(function (obj, i) {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>
                                                                            <span className="btn-hover" onClick={this.getdetail.bind(this, obj.uid)}>{obj.username}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span onClick={this.onRemove.bind(this, obj.uid)} className="btn btn-danger btn-hover">
                                                                                <i className="fas fa-times"></i>
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }, this)
                                                            : ''
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Delete people confirmation model */}

                        <div className={(this.state.removemodelshow) ? 'modal fade show disblock' : 'modal fade disnone'} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">

                                <div className="modal-content">
                                    <form onSubmit={this.onDeleteSubmit}>
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalCenterTitle">Delete People</h5>
                                            <button type="button" className="close" onClick={this.onCloseModel} data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            Are Your Sure You Want To Delete ?
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={this.onCloseModel} data-dismiss="modal">Close</button>
                                            <button type="submit" className="btn btn-danger" >Delete</button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                        {
                            (this.state.removemodelshow) ? <div className="modal-backdrop fade show"></div> : ''
                        }

                        {/* END */}

                        {/* Display details of people on model */}

                        <div className={(this.state.disdetail) ? 'modal fade show disblock' : 'modal fade disnone'} id="groupmember" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">

                                <div className="modal-content">
                                    <form onSubmit={this.onSubmit}>
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalCenterTitle">Members Details</h5>
                                            <button type="button" className="close" onClick={this.onCloseModel} data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th>Latitude</th>
                                                        <th>Longitude</th>
                                                        <th>Timestamp</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {(this.state.userupdatedata) ?
                                                        this.state.userupdatedata.map(function (obj, i) {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <span>{obj.lat}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span>{obj.long}</span>
                                                                    </td>
                                                                    <td>
                                                                        <span>{moment(obj.cd).format('DD-MM-YYYY HH:mm:ss')}</span>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }, this)
                                                        : ''
                                                    }
                                                </tbody>
                                            </table>

                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={this.onCloseModel} data-dismiss="modal">Close</button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                        {
                            (this.state.disdetail) ? <div className="modal-backdrop fade show"></div> : ''
                        }

                        {/* END */}

                    </div>

                    <Footer />

                </div>
            </div>

        );
    }

}