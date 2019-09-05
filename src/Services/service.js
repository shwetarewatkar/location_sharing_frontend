import React, { Component } from 'react';
import axios from 'axios';
import socketIOClient from "socket.io-client";
import { Observable, Observer } from 'rxjs';

const socket = socketIOClient("http://192.168.0.79:1337");

export default class Service extends Component {

    apiURL = "http://localhost:4000";

    // getdatabyid(id) {
    //     return axios.get(`${this.apiURL}/location/getid/` + id);
    // }

    // getgroupmemberbyid(id) {
    //     return axios.get(`${this.apiURL}/location/getmemberid/` + id);
    // }

    // putdata(data) {
    //     return axios.put(`${this.apiURL}/location/update`, data);
    // }

    // deletedata(data) {
    //     return axios.delete(`${this.apiURL}/location/delete/` + data);
    // }

    postdata(data) {
        return axios.post(`${this.apiURL}/location/add`, data);
    }

    senddata(e, Data) {
        return socket.emit('req', { event: e, data: Data });
    }

    getdata() {
        return Observable.create((observer) => {
            socket.on('res', (data) => {
                observer.next(data);
            });
        });
    }

}
