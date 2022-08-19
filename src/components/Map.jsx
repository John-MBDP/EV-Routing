import React, { useRef, useEffect } from "react";
import * as mapboxPolyline from "@mapbox/polyline";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { getDurationString } from "../helpers/getDurationString";
import { getRoute } from "./Client/Client";
mapboxgl.accessToken =
  process.env.REACT_APP_MAPBOX_KEY;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // getRoute(route => {
  //   drawRoutePolyline(route);
  //   renderRouteData(route);
  //   attachEventListeners(route);
  // });
  const drawRoute = (coordinates, legs) => {
    if (map.loaded()) {
      drawPolyline(coordinates);
      drawChargingTimes(legs);
      showLegs(legs);
    } else {
      map.on("load", () => {
        drawPolyline(coordinates);
        drawChargingTimes(legs);
        showLegs(legs);
      });
    }
  };
  //Render the charging times at each station directly on top of it's marker
  const drawChargingTimes = (legs) => {
    legs.forEach((leg, idx) => {
      if (idx == legs.length - 1) {
        return;
      }

      const chargeTime = leg.chargeTime;
      const hrs = ~~(chargeTime / 3600);
      const mins = ~~((chargeTime % 3600) / 60);

      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(
          leg.destination.geometry.coordinates
        )
        .setHTML(`<small>${hrs}:${mins}</small>`)
        .addTo(map);
    });
  };

  //Draw route polyline on a map.
  const drawPolyline = (coordinates) => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            properties: {},
            coordinates,
          },
        },
      ],
    };
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [9.1320104, 54.9758916],
      zoom: 6,
    });
  }, []);

  const showLegs = (legs) => {
    if (legs.length === 0) return;

    let points = [];

    // we want to show origin point on the map
    // to do that we use the origin of the first leg
    points.push({
      type: "Feature",
      properties: {
        icon: "location_big",
      },
      geometry: legs[0].origin?.geometry,
    });

    legs.map((leg, index) => {
      // add charging stations
      if (index !== legs.length - 1) {
        points.push({
          type: "Feature",
          properties: {
            description: `${getDurationString(
              leg.chargeTime
            )}`,
            icon: "unknown-turbo",
          },
          geometry: leg.destination?.geometry,
        });
      } else {
        // add destination point (last leg)
        points.push({
          type: "Feature",
          properties: {
            icon: "arrival",
          },
          geometry: leg.destination?.geometry,
        });
      }
    });
    map.addLayer({
      id: "legs",
      type: "symbol",
      layout: {
        "icon-image": "{icon}",
        "icon-allow-overlap": true,
        "icon-offset": [
          "case",
          ["==", ["get", "icon"], "location_big"],
          ["literal", [0, 0]],
          ["literal", [0, -15]],
        ],
      },
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: points,
        },
      },
    });
  };
  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
      />
    </div>
  );
};

export default Map;
