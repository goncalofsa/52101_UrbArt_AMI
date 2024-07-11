import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GmapsService {

  mapStylePink = [
    {
      elementType: "geometry",
      stylers: [{ color: "#FA9BCB" }], //Light pink
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#4A7C59" }], //Dark green
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#72C582" }], //Green
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#FF0081" }], //Default pink
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#910048" }], //Dark pink
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#5A5A5A" }], //Dark grey
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#A8A8A8" }], //Grey
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#5DADEC" }], //Light blue
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#ffffff" }],
    },
  ];

  constructor() { }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
    const gModule = win.google;
    if(gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsApiKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not available');
        }
      };
    });
  }
}
