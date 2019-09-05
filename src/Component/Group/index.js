import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';
import Navigation from '../Common/Navigation';
import Footer from '../Common/Footer';
import Service from '../../Services/service';
import Auth from '../../Authantication/Auth';
import alertify from 'alertifyjs';
import CryptoJS from 'crypto-js';


export default class Groups extends React.Component {

    constructor(props) {
        super(props);

        this.services = new Service();
        this.auth = new Auth();
        this.onChangeInviteCode = this.onChangeInviteCode.bind(this);
        this.onJoinSubmit = this.onJoinSubmit.bind(this);
        this.onGroupSubmit = this.onGroupSubmit.bind(this);
        this.onChangeGroupName = this.onChangeGroupName.bind(this);
        this.delgroupdata = this.delgroupdata.bind(this);

        this.state = {
            groups: [],
            uid: '',
            gid: '',
            groupName: '',
            invitecode: '',
            errcode: true,
            groupname: '',
            errgname: true
        }

    }

    componentDidMount() {

        this.getAllGroups();

    }

    onChangeInviteCode(e) {
        this.setState({
            invitecode: e.target.value
        });
    }

    onChangeGroupName(e) {
        this.setState({
            groupname: e.target.value
        });
    }

    onJoinSubmit(e) {
        e.preventDefault();

        if (this.state.invitecode == '') {
            this.setState({
                errcode: false
            });
            this.state.errcode = false;
        } else {
            this.setState({
                errcode: true
            });
            this.state.errcode = true;
        }

        if (this.state.errcode == true) {

            var data = {
                uid: this.state.uid,
                GroupId: this.state.gid,
                InviteCode: this.state.invitecode
            };

            console.log(data);

            // this.services.senddata('AddMember', data);
            // this.services.getdata().subscribe((res) => {

            //     switch (res.event) {
            //         case 'GroupList':
            //             this.setState({
            //                 groups: res.data
            //             })
            //             break;
            //     }
            // });

        }

    }

    onGroupSubmit(e) {
        e.preventDefault();

        if (this.state.groupname == '') {
            this.setState({
                errgname: false
            });
            this.state.errgname = false;
        } else {
            this.setState({
                errgname: true
            });
            this.state.errgname = true;
        }

        if (this.state.errgname == true) {

            var data = {
                uid: this.state.uid,
                GroupName: this.state.groupname
            }

            this.services.senddata('AddGroup', data);
            this.services.getdata().subscribe((res) => {

                switch (res.event) {
                    case 'GroupList':
                        this.setState({
                            groups: res.data,
                            groupname: ''
                        })
                        break;
                }
            });

        }


    }

    getAllGroups() {

        let decryptedData_uid = localStorage.getItem('uid');
        var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
        var uid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));

        this.setState({
            uid: uid
        })

        this.auth.authantication();

        this.services.senddata('GetGroupsList', '');
        this.services.getdata().subscribe((res) => {

            switch (res.event) {
                case 'GroupList':
                    this.setState({
                        groups: res.data
                    })
                    break;
            }
        });

    }

    delgroupdata(id) {

        var data = {
            uid: this.state.uid,
            groupId: id
        }

        this.services.senddata('DeleteGroup', data);
        this.services.getdata().subscribe((res) => {

            switch (res.event) {
                case 'GroupList':
                    this.setState({
                        groups: res.data
                    })
                    break;
            }
        });

    }

    getgroupdata(id, name) {
        this.setState({
            gid: id,
            groupName: name
        })
    }

    onGetdata(id, name) {

        this.setState({
            gid: id,
            groupName: name
        })

        // this.services.getgroupmemberbyid(id).then(res => {

        //     console.log(res);

        // }).catch(function (error) {
        //     console.log(error);
        // })

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
                                            <h6 className="m-0 font-weight-bold text-primary">Group List</h6>
                                        </div>
                                        <div className="card-body">
                                            <div className="table-responsive">
                                                <div>
                                                    <button type="submit" className="btn btn-primary" data-toggle="modal" data-target="#newgroup"><i className="fas fa-plus"></i> Add New</button>
                                                </div>
                                                <br />
                                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                                    <thead>
                                                        <tr>
                                                            <th>Group Name</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            this.state.groups.map(function (obj, i) {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>
                                                                            <span className="btn-hover myspan" onClick={this.onGetdata.bind(this, obj._id, obj.groupname)} data-toggle="modal" data-target="#groupmember">{obj.groupname}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="btn btn-primary btn-hover" onClick={this.getgroupdata.bind(this, obj._id, obj.groupname)} data-toggle="modal" data-target="#groupmodel"><i className="fas fa-plus"></i></span>
                                                                            &nbsp;&nbsp;
                                                                            {
                                                                                (obj.default == true) ?
                                                                                    ''
                                                                                    :
                                                                                    <span onClick={this.delgroupdata.bind(this, obj._id)} className="btn btn-danger btn-hover"><i className="fas fa-times"></i></span>
                                                                            }

                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }, this)
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                    <Footer />
                </div>
                <div className="modal fade" id="groupmodel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onJoinSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Join {this.state.groupName} Group</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">

                                    <div className="form-group">
                                        <label>Invite Code</label>
                                        {
                                            (this.state.errcode) ?
                                                <input type="text" value={this.state.invitecode} onChange={this.onChangeInviteCode} className="form-control" placeholder="Please Enter Invite Code" />
                                                :
                                                <input type="text" style={{ border: '1px solid red' }} value={this.state.invitecode} onChange={this.onChangeInviteCode} className="form-control" placeholder="Please Enter Invite Code" />
                                        }
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" >Join</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

                <div className="modal fade" id="groupmember" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">{this.state.groupName} Group Members</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="row mymargin">
                                        <div className="col-xl-10">
                                            <span>Usaername</span>
                                        </div>
                                        <div className="col-xl-2">
                                            <i className="fas fa-times myitag"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

                <div className="modal fade" id="newgroup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onGroupSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Add New Group</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Group Name</label>
                                        {
                                            (this.state.errgname) ?
                                                <input type="text" value={this.state.groupname} onChange={this.onChangeGroupName} className="form-control" placeholder="Please Enter Group Name" />
                                                :
                                                <input type="text" style={{ border: '1px solid red' }} value={this.state.groupname} onChange={this.onChangeGroupName} className="form-control" placeholder="Please Enter Group Name" />
                                        }

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

            </div>

        );
    }

}





