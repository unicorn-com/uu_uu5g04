/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import Link from "./link.js";
import Modal from "./modal.js";

import "./google-map.less";
//@@viewOff:imports

export const GoogleMap = UU5.Common.VisualComponent.create({
  displayName: "GoogleMap", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("GoogleMap"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("google-map")
    },
    defaults: {
      loadLibsEvent: ns.css("google-map-load-libs"),
      apiKeyUrl: "https://maps.googleapis.com/maps/api/js"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    mapType: UU5.PropTypes.oneOf(["satellite", "roadmap"]),
    mapRef: UU5.PropTypes.func,
    latitude: UU5.PropTypes.number,
    longitude: UU5.PropTypes.number,
    markers: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        latitude: UU5.PropTypes.number,
        longitude: UU5.PropTypes.number,
        title: UU5.PropTypes.string,
        label: UU5.PropTypes.string
      })
    ),
    zoom: UU5.PropTypes.number,
    disableZoom: UU5.PropTypes.bool,
    draggable: UU5.PropTypes.bool,
    disableDefaultUI: UU5.PropTypes.bool,
    googleApiKey: UU5.PropTypes.string,
    height: UU5.PropTypes.string,
    width: UU5.PropTypes.string,

    // https://developers.google.com/maps/documentation/javascript/styling
    mapStyle: UU5.PropTypes.arrayOf(UU5.PropTypes.object)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      mapType: "roadmap",
      latitude: 50.107799,
      longitude: 14.453689,
      markers: [],
      zoom: 14,
      disableZoom: false,
      draggable: true,
      disableDefaultUI: false,
      googleApiKey: null,
      height: "400px",
      width: "100%",
      mapStyle: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    this._initialize();
  },

  // setting map options through props
  // for additions see https://developers.google.com/maps/documentation/javascript/reference#MapOptions
  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      let newMapOptions = {};
      nextProps.draggable !== undefined && (newMapOptions.draggable = nextProps.draggable);
      nextProps.disableZoom !== undefined && (newMapOptions.scrollwheel = !nextProps.disableZoom);
      nextProps.disableDefaultUI !== undefined && (newMapOptions.disableDefaultUI = nextProps.disableDefaultUI);
      Object.keys(newMapOptions).length && this.setMapOptions(newMapOptions);
      if (this.props.markers !== nextProps.markers) {
        this._initialize(nextProps.markers);
      }
    }
  },

  componentWillUnmount: function() {
    UU5.Environment.EventListener.unregisterLoadLibs(this.getId(), this._initMap);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getMap() {
    return this._googleMap;
  },

  setMapOptions(options) {
    if (typeof options === "object" && options !== null) {
      if (this._googleMap) {
        this._googleMap.setOptions(options);
      } else {
        this._pendingMapOptions = Object.assign(this._pendingMapOptions || {}, options);
      }
    }
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _initialize(markers) {
    markers = markers || this.props.markers;
    if (typeof google === "undefined" && !window.googleMapApiLoading) {
      this._loadLibraries(markers, this._initMap);
    } else if (googleMapApiLoading) {
      if (window.googleMapApiLoaded) {
        this._initMap(markers);
      } else {
        UU5.Environment.EventListener.registerLoadLibs(this.getId(), this._initMap);
      }
    } else {
      this._loadLibraries(markers).this._initMap(markers);
    }
  },

  _loadLibraries(markers, callback) {
    let googleMap = this;

    window.google = false;
    window.googleMapApiLoading = true;
    let script = document.createElement("script");
    document.head.appendChild(script);

    script.onload = function() {
      window.googleMapApiLoaded = true;
      UU5.Environment.EventListener.triggerLoadLibs(markers);
      typeof callback === "function" && callback();
    };

    script.src = this.getDefault().apiKeyUrl + (this.props.googleApiKey ? "?key=" + this.props.googleApiKey : "");
  },

  _initMap(markers) {
    markers = markers || this.props.markers;
    let myCenter = new google.maps.LatLng(this.props.latitude, this.props.longitude);

    let mapProps = {
      center: myCenter,
      zoom: this.props.zoom,
      zoomControl: !this.props.disableZoom,
      scrollwheel: !this.props.disableZoom,
      disableDoubleClickZoom: this.props.disableZoom,
      draggable: this.props.draggable,
      disableDefaultUI: this.props.disableDefaultUI,
      mapTypeId: google.maps.MapTypeId[this.props.mapType.toUpperCase()]
    };
    Object.assign(mapProps, this._pendingMapOptions);
    delete this._pendingMapOptions;

    let newMapCreated = false;
    if (!this._googleMap) {
      this._googleMap = new google.maps.Map(UU5.Common.DOM.findNode(this._map), mapProps);
      newMapCreated = true;
    }
    if (this._markers && this._markers.length > 0) {
      this._markers.forEach(marker => {
        marker.setMap(null); //clear old markers
      });
    }

    if (this.props.mapStyle) {
      let styledMap = new google.maps.StyledMapType(this.props.mapStyle);
      this._googleMap.mapTypes.set("map_style", styledMap);
      this._googleMap.setMapTypeId("map_style");
    }

    if (markers !== null) {
      this._markers = [];
      if (!markers.length) {
        let marker = new google.maps.Marker({
          position: myCenter
        });

        this._markers.push(marker);
        marker.setMap(this._googleMap);
      } else {
        markers.forEach(markerProps => {
          let position = new google.maps.LatLng(markerProps.latitude, markerProps.longitude);
          let animation = markerProps.animation ? google.maps.Animation[markerProps.animation.toUpperCase()] : null;
          let newMarker = new google.maps.Marker({
            position: position,
            center: position,
            title: markerProps.title,
            label: markerProps.label,
            icon: markerProps.icon,
            animation: animation
          });
          if (typeof markerProps.onClick === "function") {
            newMarker.addListener("click", e => markerProps.onClick(this, newMarker, e));
          }

          this._markers.push(newMarker);
          newMarker.setMap(this._googleMap);
        });
      }
    }

    if (typeof this.props.mapRef === "function" && newMapCreated) {
      this.props.mapRef(this._googleMap);
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let mainAttrs = this.getMainAttrs();

    let mapAttrs = {
      ref: ref => (this._map = ref),
      style: { height: this.props.height, width: this.props.width }
    };

    let component;
    switch (this.getNestingLevel()) {
      case "bigBoxCollection":
      case "bigBox":
      case "boxCollection":
      case "box":
        component = (
          <div {...mainAttrs}>
            <div {...mapAttrs} />
            {this.getDisabledCover()}
          </div>
        );
        break;
      case "inline":
        component = (
          <span>
            <Modal disabled={this.isDisabled()} ref_={modal => (this._modal = modal)}>
              <div {...mainAttrs}>
                <div {...mapAttrs} />
                {/* {this.getDisabledCover()} */}
              </div>
            </Modal>
            <Link disabled={this.isDisabled()} onClick={() => this._modal.open()} content={this.props.src} />
          </span>
        );
        break;
      default:
        component = null;
    }

    return component;
  }
  //@@viewOff:render
});

export default GoogleMap;
