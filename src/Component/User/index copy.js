/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import './MapView.scss'
import { Table, Select, Modal, Button, Input, Icon, AutoComplete } from 'antd';
import constant from '../../utils/common'
import nError from '../../assets/images/ic_alert.png'

const { Option } = Select;
const Search = Input.Search;
var map, marker, infoWindow, bounds;
var pos = []
var markers = [];
class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locationsData: [],
      filterLocationsData: [],
      map: {},
      dataSource: [],
      navigatorFlag: false
    }
    this.showMarker = this.showMarker.bind(this)
  }
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
  componentDidMount() {
    let self = this

    setTimeout(function () {
      map = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 11
      });
      bounds = new window.google.maps.LatLngBounds();
      self.getAllLocations()
    }, 1000)
  }
  getAllLocations() {
    let self = this

    // axios.get('http://api.ipapi.com/api/check?access_key=d44b00386429b40022fb34b67f8cd3e6').then(data => {
    //   console.log("data",data)
    // });
    infoWindow = new window.google.maps.InfoWindow();
//     navigator.geolocation.getCurrentPosition(successCallback,
//       errorCallback,
//       {maximumAge:600000});

// function successCallback(position) {
//   console.log("position---->",position)
// // By using the 'maximumAge' option above, the position
// // object is guaranteed to be at most 10 minutes old.
// }

// function errorCallback(error) {
//   console.log("error---->",error)
// // Update a div element with error.message.
// }
    if (navigator && navigator.geolocation) {
      self.setState({ navigatorFlag: false })
      navigator.geolocation.getCurrentPosition(function (position) {
        pos = [position.coords.latitude, position.coords.longitude]
        let centerpos = { "lat": position.coords.latitude, "lng": position.coords.longitude }

        // eneble when you need your location in center in map
        axios.post(constant.api_url + 'getLocations', { coordinates: pos }).then(function (res) {
          self.setState({ 'locationsData': res.data.locations, 'dataSource': res.data.uniqueCategories })
          // self.setState({ 'filterLocationsData': res.data })
          map.setCenter(centerpos);
          self.showMarker(res.data.locations)
        }).catch(function (error) {
        })

      }, function (error) {
        console.log("error",error)
        self.setState({ navigatorFlag: true })
        self.handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      self.setState({ navigatorFlag: true })
      self.handleLocationError(false, infoWindow, map.getCenter());
    }
  }
  showMarker(data) {
    var myLatLng = {}
    data.forEach(function (item) {
      if (item.coordinates) {
        var uluru = { lat: item.coordinates[0], lng: item.coordinates[1] };
        myLatLng = new window.google.maps.LatLng(item.coordinates[0], item.coordinates[1]);
        // myLatLng = {lat: item.coordinates[0], lng: item.coordinates[1]}
        marker = new window.google.maps.Marker({
          position: uluru,
          map: map
        });
        var content = '<div id="content">' +
          '<div id="siteNotice">' +
          '</div>' +
          '<h3 id="firstHeading" class="firstHeading">' + item.name + '</h3>' +
          '<div id="bodyContent">' +
          '<p>' + item.category + '<a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194"></a></p>' +
          '</div>' +
          '</div>';
        var infowindow = new window.google.maps.InfoWindow();

        window.google.maps.event.addListener(marker, 'click', (function (marker, content, infowindow) {
          return function () {
            infowindow.setContent(content);
            infowindow.open(map, marker);
            map.setCenter(marker.getPosition());
          };
        })(marker, content, infowindow));

        // marker.addListener('click', function () {
        //   debugger
        //   infowindow.open(map, marker);
        //   map.setZoom(8);
        //   map.setCenter(marker.getPosition());
        // });


        // bounds.extend(marker.getPosition());
        markers.push(marker)
      }
    })
    if (data.length == 1) {
      var center = new window.google.maps.LatLng(data[0].coordinates[0], data[0].coordinates[1]);
      map.setZoom(10);
      map.panTo(center);
      var infowindow = new window.google.maps.InfoWindow();
      var content = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h3 id="firstHeading" class="firstHeading">' + data[0].name + '</h3>' +
        '<div id="bodyContent">' +
        '<p>' + data[0].category + '<a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194"></a></p>' +
        '</div>' +
        '</div>';
      infowindow.setContent(content);
      infowindow.open(map, marker);
    }
  }
  onSearch(value) {
    var newStdP = this.state.locationsData.filter(function (stData) {
      var re = new RegExp(value, 'i');
      if (stData.address.match(re)) {
        return stData;
      } else if (stData.category.match(re)) {
        return stData;
      } else if (stData.description.match(re)) {
        return stData;
      } else if (stData.name.match(re)) {
        return stData;
      }
    });
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    this.setState({ filterLocationsData: [] })
    this.setState({ filterLocationsData: newStdP })
    this.showMarker(newStdP)
  }
  onSelect(value) {
    var newStdP = this.state.locationsData.filter(function (stData) {
      var re = new RegExp(value, 'i');
      if (stData.address.match(re)) {
        return stData;
      } else if (stData.category.match(re)) {
        return stData;
      } else if (stData.description.match(re)) {
        return stData;
      } else if (stData.name.match(re)) {
        return stData;
      }
    });
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    this.setState({ filterLocationsData: [] })
    this.setState({ filterLocationsData: newStdP })
    this.showMarker(newStdP)
  }
  render() {
    return (
      <div className="mapView_wrapper">
        {this.state.navigatorFlag == true ?
          <div className="maNavigatorErrorBlock">
            <div className="maErrorBlock">
              <img src={nError} />
              <h2>Please allow location permission</h2>
              <h2>from your site settings.</h2>
            </div>
          </div>
          : ''}
        <h1 className="maTitlebar">Map View</h1>
        <div className="maSearchBlock">
          <AutoComplete
            className="maSearch"
            dataSource={this.state.dataSource}
            onChange={this.onSelect.bind(this)}
            filterOption={(inputValue, option) =>
              option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            placeholder="Find location here"
          ><Input suffix={<Icon type="search" className="certain-category-icon" />} /></AutoComplete>
          {/* <Search placeholder="Find location here..." className="maSearch" onSearch={value => this.onSearch(value)} enterButton /> */}
        </div>
        <div className="maMap" id="map" />
      </div>
    );
  }
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };
}

export default Locations;