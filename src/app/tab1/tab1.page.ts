import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GmapsService } from '../gmaps.service';
import { Post, PostService } from '../post.service';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { PostdetailComponent } from '../postdetail/postdetail.component';
import { style } from '@angular/animations';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  @ViewChild('map', {static: true}) mapElementRef: ElementRef | undefined;
  googleMaps: any;
  center = { lat: 38.755, lng: -9.117 };
  map: any;
  markers: any[] = [];
  userLocationMarker: any;

  posts$: Observable<Post[]>;

  constructor(
    private modalController: ModalController,
    private gmaps: GmapsService,
    private renderer: Renderer2,
    private postService: PostService,
  ) {
    this.posts$ = this.postService.getPosts();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loadMap();
    this.userLocation();
  }

  async userLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.goToCurrentLocation();
      }
    )
  }

  async loadMap() {
    try {
      this.googleMaps = await this.gmaps.loadGoogleMaps();
      const mapEl = this.mapElementRef?.nativeElement;
      const location = this.center;
      this.map = new this.googleMaps.Map(mapEl, {
        center: location,
        zoom: 12,
        disableDefaultUI: true,
        //rotate: false
        styles: this.gmaps.mapStylePink
      });

      this.renderer.addClass(mapEl, 'visible');
      this.addCurrentLocationMarker(location);

      this.initializeMarkers();
    } catch (e) {
      console.log(e);
    }
  }

  addMarker(location: any, postId: string) {
    const icon = {
      url: 'assets/icons/pin.png',
      scaledSize: new this.googleMaps.Size(40, 63.53),
    };
    const marker = new this.googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      animation: this.googleMaps.Animation.DROP
    });

    this.markers.push(marker);

    return marker;
  }

  addCurrentLocationMarker(location: any) {
    if (this.userLocationMarker) {
      this.userLocationMarker.setMap(null);
    }
    const icon = {
      url: 'assets/icons/user.png',
      scaledSize: new this.googleMaps.Size(30, 30)
    };
    this.userLocationMarker = new this.googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      animation: this.googleMaps.Animation.DROP
    });
  }

  async initializeMarkers() {
    const map = this.map;
    const modalController = this.modalController;

    this.clearMarkers();

    this.posts$.subscribe(postsArray => {
      postsArray.forEach(post => {
        const marker = this.addMarker({ lat: post.coordinates.lat, lng: post.coordinates.lng }, post.id!);
        marker.addListener('click', async () => {
          const modal = await modalController.create({
            component: PostdetailComponent,
            componentProps: { post: post }
          });
          return await modal.present();
        });
      });
    });
  }

  clearMarkers() {
    this.markers.forEach(marker => {
      marker.setMap(null);
    });

    this.markers = [];
  }

  async deletePost(postId: string) {
    try {
      await this.postService.deletePost(postId).toPromise();

      let markerToRemove: any | undefined = undefined;
      this.markers.forEach(marker => {
        if (marker.getTitle() === postId) {
          markerToRemove = marker;
        }
      });

      if (markerToRemove) {
        markerToRemove.setMap(null);
        this.markers = this.markers.filter(marker => marker !== markerToRemove);
      } else {
        console.warn('Marker not found for post ID:', postId);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  goToCurrentLocation() {
    this.addCurrentLocationMarker(this.center);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(currentPos);
        this.map.panTo(currentPos);
        this.map.setZoom(12);
        this.addCurrentLocationMarker(currentPos);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
