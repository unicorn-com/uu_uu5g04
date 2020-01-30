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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

//`UU5.Bricks.GoogleMap`

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin"
  ],
  props: {
    mapType: {
      values: ["satellite", "roadmap"]
    },
    latitude: {
      values: [34.107399]
    },
    longitude: {
      values: [16.107319]
    },
    markers: {
      values: [
        [
          {
            latitude: 14.12321,
            longitude: 17.12323,
            title: "myPoint",
            label: "myPoint",
            animation: "drop",
            icon: "http://myOwnIcon.com"
          }
        ]
      ]
    },
    zoom: {
      values: [0, 5, 10, 20, 21]
    },
    disableZoom: {
      values: [true, false]
    },
    draggable: {
      values: [true, false]
    },
    disableDefaultUI: {
      values: [true, false]
    },
    googleApiKey: {
      values: ["AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"]
    },
    height: {
      values: ["300px"]
    },
    width: {
      values: ["80%"]
    },
    mapStyle: {
      values: [
        [
          {
            elementType: "geometry",
            stylers: [
              {
                color: "#1d2c4d"
              }
            ]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [
              {
                color: "#4e6d70"
              }
            ]
          }
        ]
      ]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

const This = {};

describe(`UU5.Bricks.GoogleMap`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.GoogleMap, CONFIG);
  //UU5.Test.Tools.testPropertiesEnzymeShallow(UU5.Bricks.GoogleMap, CONFIG);
});

describe(`UU5.Bricks.GoogleMap docKit example`, () => {
  it("render without crash", () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID5"}>
        <UU5.Bricks.GoogleMap
          id={"uuID4"}
          latitude={50.0755381}
          longitude={14.43780049999998}
          googleApiKey="AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"
          markers={[
            {
              latitude: 50.0754616,
              longitude: 14.43686409999998,
              animation: "drop"
            }
          ]}
        />
        <UU5.Bricks.GoogleMap
          id={"uuID3"}
          zoom={5}
          disableDefaultUI
          googleApiKey="AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"
        />
        <UU5.Bricks.GoogleMap
          id={"uuID2"}
          mapType="satellite"
          height="300px"
          width="50%"
          googleApiKey="AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"
        />
        <UU5.Bricks.GoogleMap
          id={"uuID1"}
          zoom={11}
          disableDefaultUI
          googleApiKey="AIzaSyBkv-K9tpS-MrvvRKOpIGEj7H5wwdHD9pA"
          mapStyle={[
            {
              elementType: "geometry",
              stylers: [
                {
                  color: "#1d2c4d"
                }
              ]
            },
            {
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#8ec3b9"
                }
              ]
            },
            {
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#1a3646"
                }
              ]
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#4b6878"
                }
              ]
            },
            {
              featureType: "administrative.land_parcel",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#64779e"
                }
              ]
            },
            {
              featureType: "administrative.province",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#4b6878"
                }
              ]
            },
            {
              featureType: "landscape.man_made",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#334e87"
                }
              ]
            },
            {
              featureType: "landscape.natural",
              elementType: "geometry",
              stylers: [
                {
                  color: "#023e58"
                }
              ]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [
                {
                  color: "#283d6a"
                }
              ]
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#6f9ba5"
                }
              ]
            },
            {
              featureType: "poi",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#1d2c4d"
                }
              ]
            },
            {
              featureType: "poi.business",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.park",
              elementType: "geometry.fill",
              stylers: [
                {
                  color: "#023e58"
                }
              ]
            },
            {
              featureType: "poi.park",
              elementType: "labels.text",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "poi.park",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#3C7680"
                }
              ]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [
                {
                  color: "#304a7d"
                }
              ]
            },
            {
              featureType: "road",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#98a5be"
                }
              ]
            },
            {
              featureType: "road",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#1d2c4d"
                }
              ]
            },
            {
              featureType: "road.arterial",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [
                {
                  color: "#2c6675"
                }
              ]
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#255763"
                }
              ]
            },
            {
              featureType: "road.highway",
              elementType: "labels",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#b0d5ce"
                }
              ]
            },
            {
              featureType: "road.highway",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#023e58"
                }
              ]
            },
            {
              featureType: "road.local",
              stylers: [
                {
                  visibility: "off"
                }
              ]
            },
            {
              featureType: "transit",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#98a5be"
                }
              ]
            },
            {
              featureType: "transit",
              elementType: "labels.text.stroke",
              stylers: [
                {
                  color: "#1d2c4d"
                }
              ]
            },
            {
              featureType: "transit.line",
              elementType: "geometry.fill",
              stylers: [
                {
                  color: "#283d6a"
                }
              ]
            },
            {
              featureType: "transit.station",
              elementType: "geometry",
              stylers: [
                {
                  color: "#3a4762"
                }
              ]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [
                {
                  color: "#0e1626"
                }
              ]
            },
            {
              featureType: "water",
              elementType: "labels.text.fill",
              stylers: [
                {
                  color: "#4e6d70"
                }
              ]
            }
          ]}
        />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
