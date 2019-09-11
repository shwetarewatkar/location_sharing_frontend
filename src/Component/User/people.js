import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navigation from '../Common/Navigation';
import Footer from '../Common/Footer';
import Service from '../../Services/service';
import Auth from '../../Authantication/Auth';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';


export default class People extends React.Component {

    constructor(props) {
        super(props);

        this.services = new Service();
        this.auth = new Auth();

        this.onCloseModel = this.onCloseModel.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);

        this.state = {
            peoples: [],
            uid: '',
            removemodelshow: false,
            removeid: '',
            defaultdata: []
        };

        this.auth.authantication();

    }

    componentDidMount() {

        let decryptedData_uid = localStorage.getItem('uid');
        var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
        var userid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));

        this.setState({
            uid: userid
        });

        this.getAllPeople(userid);

    }

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

    onRemove(id) {

        this.setState({
            removemodelshow: true,
            removeid: id
        })
        this.state.removemodelshow = true;

    }

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

    onCloseModel() {
        this.setState({
            removemodelshow: false
        })
        this.state.removemodelshow = false;
    }

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
                                                                        <td>{obj.username}</td>
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

                    </div>

                    <Footer />

                </div>
            </div>

        );
    }

}