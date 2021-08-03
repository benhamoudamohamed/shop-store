import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuService } from '@nebular/theme';
import * as Cookies from 'js-cookie'

@Component({
  selector: 'app-storehome',
  templateUrl: './storehome.component.html',
  styleUrls: ['./storehome.component.scss']
})
export class StorehomeComponent implements OnInit {

  date: Date;
  prodStore: any
  cartItem: any = 0;

  constructor(private nbMenuService: NbMenuService, private router: Router) {
    this.date = new Date();

    this.cartItem = parseInt(Cookies.get("cartItem")) || 0

    const interval = setInterval(() => {
      this.cartItem = parseInt(Cookies.get("cartItem")) || 0
    }, 1000)
  }

  ngOnInit() {
    this.nbMenuService.onItemClick().subscribe((res) => {
      this.router.navigate([res.item.link])
    });
  }

  items = [
    { title: 'Categories', link: 'store/shop' },
    { title: 'Favorites', link: 'store/collection' },
  ];

  responsiveitemlists = [
    { title: 'Home', link: 'store' },
    { title: 'Shop', children: this.items},
    { title: 'About', link: 'store/about' },
    { title: 'Contact', link: 'store/contact' },
  ]
}
