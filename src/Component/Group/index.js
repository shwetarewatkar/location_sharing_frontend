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
        this.state = {
            groups: [],
            members: [],
            uid: '',
            gid: '',
            groupName: '',
            rmid: '',
            invitecode: '',
            errcode: true,
            groupname: '',
            errgname: true,
            disgmembershow: false,
            groupmodelshow: false,
            groupdeletemodelshow: false,
            addnewgroupmodelshow: false,
            removegroupmodelshow: false,
            disdetail: false,
            userupdatedata: []
        }

        this.services = new Service();
        this.auth = new Auth();
        this.onChangeInviteCode = this.onChangeInviteCode.bind(this);
        this.onJoinSubmit = this.onJoinSubmit.bind(this);
        this.onGroupSubmit = this.onGroupSubmit.bind(this);
        this.onChangeGroupName = this.onChangeGroupName.bind(this);
        this.delgroupdata = this.delgroupdata.bind(this);
        this.onCloseModel = this.onCloseModel.bind(this);
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this);
        this.onAddNewGroup = this.onAddNewGroup.bind(this);
        this.onRemoveDeleteSubmit = this.onRemoveDeleteSubmit.bind(this);

        this.auth.authantication();

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

            this.services.senddata('AddMember', data);

            this.setState({
                invitecode: '',
                groupmodelshow: false
            })
            this.state.groupmodelshow = false;

            this.services.getdata().subscribe((res) => {
                switch (res.event) {
                    case 'AddMemebrResp':

                        if (res.data.error) {
                            alertify.error(res.data.error);
                            this.services.offsocket();
                        } else {
                            alertify.success("Join successfully");
                            this.services.offsocket();
                        }

                        break;
                }
            });

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
            this.setState({
                groupname: '',
                addnewgroupmodelshow: false
            })
            this.addnewgroupmodelshow = false;
            alertify.success("Add Successfully");
        }


    }

    getAllGroups() {

        let decryptedData_uid = localStorage.getItem('uid');
        var bytes_uid = CryptoJS.AES.decrypt(decryptedData_uid.toString(), 'Location-Sharing');
        var uid = JSON.parse(bytes_uid.toString(CryptoJS.enc.Utf8));

        this.setState({
            uid: uid
        })

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

        this.setState({
            gid: id,
            groupdeletemodelshow: true
        })

        this.state.groupdeletemodelshow = true;

    }

    onDeleteSubmit(e) {

        e.preventDefault();

        var data = {
            uid: this.state.uid,
            groupId: this.state.gid
        }

        this.services.senddata('DeleteGroup', data);
        this.setState({
            gid: '',
            groupdeletemodelshow: false
        })
        this.state.groupdeletemodelshow = false;
        alertify.success("Deleted Successfully");

    }

    getgroupdata(id, name) {
        this.setState({
            gid: id,
            groupName: name,
            groupmodelshow: true
        })

        this.state.groupmodelshow = true;
    }

    onGetdata(id, name) {

        this.setState({
            gid: id,
            groupName: name,
            disgmembershow: true
        })

        this.state.disgmembershow = true;

        var data = {
            uid: this.state.uid,
            GroupId: id
        }

        this.services.senddata('GetMemeberList', data);
        this.services.getdata().subscribe((res) => {
            switch (res.event) {
                case 'GroupMemberList':
                    this.setState({
                        members: res.data.MemberList
                    })
                    break;
            }
        });

    }

    getdetail(id) {

        this.setState({
            disgmembershow: false,
            disdetail: true
        })
        this.state.disgmembershow = false;
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

                    console.log("alldata history:- ", res.data);
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

    onRemoveMember(rmid) {

        this.setState({
            removegroupmodelshow: true,
            disgmembershow: false,
            rmid: rmid
        })

        this.state.removegroupmodelshow = true;
        this.state.disgmembershow = false;

    }

    onRemoveDeleteSubmit(e) {
        e.preventDefault();

        var data = {
            uid: this.state.uid,
            GroupId: this.state.gid,
            RmId: this.state.rmid,
            removegroupmodelshow: false
        }


        this.services.senddata('RemoveMember', data);
        this.state.removegroupmodelshow = false;
        alertify.success("Remove Successfully");

        // this.services.getdata().subscribe((res) => {
        //     switch (res.event) {
        //         case 'GroupMemberList':
        //             this.setState({
        //                 members: res.data
        //             })
        //             break;
        //     }
        // });


    }

    onAddNewGroup() {
        this.setState({
            addnewgroupmodelshow: true
        })
        this.state.addnewgroupmodelshow = true;
    }

    onCloseModel() {
        this.setState({
            disgmembershow: false,
            groupmodelshow: false,
            groupdeletemodelshow: false,
            addnewgroupmodelshow: false,
            removegroupmodelshow: false,
            disdetail: false
        })
        this.state.disgmembershow = false;
        this.state.groupmodelshow = false;
        this.state.groupdeletemodelshow = false;
        this.state.addnewgroupmodelshow = false;
        this.state.removegroupmodelshow = false;
        this.state.disdetail = false;
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
                                                    <button type="button" className="btn btn-primary" onClick={this.onAddNewGroup}><i className="fas fa-plus"></i> Add New</button>
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
                                                                            <span className="btn-hover myspan" onClick={this.onGetdata.bind(this, obj._id, obj.groupname)}>{obj.groupname}</span>
                                                                        </td>
                                                                        <td>
                                                                            <span className="btn btn-primary btn-hover" onClick={this.getgroupdata.bind(this, obj._id, obj.groupname)}><i className="fas fa-plus"></i></span>
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
                <div className={(this.state.groupmodelshow) ? 'modal fade show disblock' : 'modal fade disnone'} id="groupmodel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onJoinSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Join {this.state.groupName}</h5>
                                    <button type="button" className="close" onClick={this.onCloseModel} data-dismiss="modal" aria-label="Close">
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
                                    <button type="button" className="btn btn-secondary" onClick={this.onCloseModel} data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" >Join</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>

                {
                    (this.state.groupmodelshow) ? <div className="modal-backdrop fade show"></div> : ''
                }

                <div className={(this.state.disgmembershow) ? 'modal fade show disblock' : 'modal fade disnone'} id="groupmember" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">{this.state.groupName} Members</h5>
                                    <button type="button" className="close" onClick={this.onCloseModel} data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    {
                                        this.state.members.map(function (obj, i) {
                                            return (
                                                <div className="row mymargin" key={i}>
                                                    <div className="col-xl-10 col-9">
                                                        {
                                                            (obj.uid == this.state.uid) ?
                                                                <span className="btn-hover" onClick={this.getdetail.bind(this, obj.uid)} style={{ fontWeight: 'bolder' }}>You</span> :
                                                                <span className="btn-hover" onClick={this.getdetail.bind(this, obj.uid)}>{obj.username}</span>
                                                        }
                                                    </div>
                                                    <div className="col-xl-2 col-3 text-right">
                                                        {
                                                            (obj.uid == this.state.uid) ?
                                                                '' :
                                                                <span onClick={this.onRemoveMember.bind(this, obj.uid)} className="btn btn-danger btn-hover">
                                                                    <i className="fas fa-times"></i>
                                                                </span>
                                                        }

                                                    </div>
                                                </div>
                                            )
                                        }, this)
                                    }

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.onCloseModel} data-dismiss="modal">Close</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
                {
                    (this.state.disgmembershow) ? <div className="modal-backdrop fade show"></div> : ''
                }

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
                                                                <span>{obj.long}</span>
                                                            </td>
                                                            <td>
                                                                <span>{obj.lat}</span>
                                                            </td>
                                                            <td>
                                                                <span>{obj.cd}</span>
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

                <div className={(this.state.groupdeletemodelshow) ? 'modal fade show disblock' : 'modal fade disnone'} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onDeleteSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Delete Group</h5>
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
                    (this.state.groupdeletemodelshow) ? <div className="modal-backdrop fade show"></div> : ''
                }


                <div className={(this.state.addnewgroupmodelshow) ? 'modal fade show disblock' : 'modal fade disnone'} id="newgroup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onGroupSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Add New Group</h5>
                                    <button type="button" className="close" onClick={this.onCloseModel} data-dismiss="modal" aria-label="Close">
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
                                    <button type="button" className="btn btn-secondary" onClick={this.onCloseModel} data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary">Add</button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
                {
                    (this.state.addnewgroupmodelshow) ? <div className="modal-backdrop fade show"></div> : ''
                }

                <div className={(this.state.removegroupmodelshow) ? 'modal fade show disblock' : 'modal fade disnone'} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">

                        <div className="modal-content">
                            <form onSubmit={this.onRemoveDeleteSubmit}>
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalCenterTitle">Delete Member</h5>
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
                    (this.state.removegroupmodelshow) ? <div className="modal-backdrop fade show"></div> : ''
                }

            </div>

        );
    }

}
