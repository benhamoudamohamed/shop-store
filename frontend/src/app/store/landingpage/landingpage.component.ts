import { Component, OnInit } from '@angular/core';
import SwiperCore, {EffectFade, Navigation, Pagination, Autoplay, Controller} from "swiper/core";
SwiperCore.use([EffectFade, Navigation, Pagination, Autoplay, Controller]);

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  images: Array<any> = []
  screen_lg = '761px';
  screen_md = '760px';
  defaultImage = 'assets/carousel/jonathan-small.jpg';

  constructor() {
    this.images = [
      {
        medium: 'assets/carousel/jonathan-medium.jpg',
        large: 'assets/carousel/jonathan-large.jpg'
      },
      {
        medium: 'assets/carousel/alexander-medium.jpg',
        large: 'cassets/carousel/alexander-large.jpg'
      },
      {
        medium: 'assets/carousel/tom-medium.jpg',
        large: 'assets/carousel/tom-large.jpg'
      },
      {
        medium: 'assets/carousel/tom-crew-medium.jpg',
        large: 'assets/carousel/tom-crew-large.jpg'
      },
      {
        medium: 'assets/carousel/tom2-medium.jpg',
        large: 'assets/carousel/tom2-large.jpg'
      },
      {
        medium: 'assets/carousel/karolina-medium.jpg',
        large: 'assets/carousel/karolina-large.jpg'
      },
      {
        medium: 'assets/carousel/jocelyn-medium.jpg',
        large: 'assets/carousel/jocelyn-large.jpg'
      },
      {
        medium: 'assets/carousel/toa-heftiba-medium.jpg',
        large: 'assets/carousel/toa-heftiba-large.jpg'
      },
    ]
  }

  ngOnInit() {
  }
}
