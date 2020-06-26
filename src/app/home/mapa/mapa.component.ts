import { Component, OnInit } from '@angular/core';

import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from 'mapbox-gl-draw';

import * as $ from 'jquery';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    /* mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY292ZWx1ZG8iLCJhIjoiY2pldTdnbjZlMDIxcjMzdWwwc3lldXAxNiJ9.tUoN8qfQAk9kYuRnWL09EQ';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
        center: [-74.50, 40], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
    let Draw = new MapboxDraw();

    map.addControl(Draw)

    map.on('load', function() {
      // ALL YOUR APPLICATION CODE
    }); */

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY292ZWx1ZG8iLCJhIjoiY2pldTdnbjZlMDIxcjMzdWwwc3lldXAxNiJ9.tUoN8qfQAk9kYuRnWL09EQ';
    var map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v10', //stylesheet location
      center: [-47.9161374,-19.7774398], // starting position
      zoom: 11 // starting zoom
    });

    var el = document.createElement('div');
    el.className = 'marker';
    // make a marker for each feature and add to the map
    new mapboxgl.Marker(document.getElementById('teste'))
    .setLngLat([-47.9161374,-19.7774398])
    .addTo(map);

    map.addControl(new mapboxgl.NavigationControl());
	
    map.addControl(new mapboxgl.FullscreenControl());
  
    map.scrollZoom.disable();

    /* mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.2/mapbox-gl-rtl-text.js');
    map.addControl(new MapboxLanguage({
        defaultLanguage: 'pt',
        supportedLanguages: ['pt']
    })); */


    map.on('load', function(){
      getRoute();
    });

    function getRoute() {
      var start = [-47.8970965, -19.826238];
      var end = [-47.9213436, -19.7815];
      var directionsRequest = 'https://api.mapbox.com/directions/v5/mapbox/driving/' + start[0] + ',' + start[1] + ';-47.9161374,-19.7774398;' + end[0] + ',' + end[1] + '?steps=true&language=pt-BR&geometries=geojson&access_token=' + mapboxgl.accessToken;
      $.ajax({
        method: 'GET',
        url: directionsRequest,
      }).done(function(data){
        var route = data.routes[0].geometry;
        
		map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: { 
              type: 'Feature', 
              geometry: route
            }
          },
		  'layout': {
            'visibility': 'visible',
            'line-join': 'round',
            'line-cap': 'round'
			},
          paint: {
            'line-width': 3,
			'line-color': '#877b59'
          }
        });
		
		
		
		map.loadImage('http://www.qas.monitoria.bravo2020.com.br/assets/images/empresa.png', function(error, image) {
			if (error) {
				console.log(error);
			throw error;
			}
			map.addImage('empresa', image);
		
			map.addLayer({
			  id: 'start',
			  type: 'symbol',
			  "layout": {
				"icon-image": "empresa",
				"icon-size":0.7,
				'visibility': 'visible'
			},
			"source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": start
                        }
                    }]
                }
            }
			});
		});
		
		map.loadImage('http://www.qas.monitoria.bravo2020.com.br/assets/images/cliente.png', function(error, image) {
			if (error) {
				console.log(error);
			throw error;
			}
			map.addImage('cliente', image);
		
			map.addLayer({
			  id: 'end1',
			  type: 'symbol',
			  "layout": {
				"icon-image": "cliente",
				"icon-size":1.0,
				'visibility': 'visible'
			},
			"source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": end
                        }
                    }]
                }
            }
			});
		});
		
		/*map.loadImage('http://localhost:4200/assets/images/caminhao.png', function(error, image) {
			if (error) {
				console.log(error);
			throw error;
			}
			map.addImage('caminhao', image);
		
			map.addLayer({
			  id: 'caminhao',
			  type: 'symbol',
			  'fill-opacity': 1,
			  "layout": {
				"icon-image": "caminhao",
				"icon-size":1.0,
				'visibility': 'visible'
			},
			  "source": {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-47.9161374,-19.7774398]
                        }
                    }]
                }
            }
			});
		});*/
		
        /* var instructions = document.getElementById('instructions');
        var steps = data.routes[0].legs[0].steps;
        steps.forEach(function(step){
          instructions.insertAdjacentHTML('beforeend', '<p>' + step.maneuver.instruction + '</p>');
        }); */
      });
    }



  }

}
