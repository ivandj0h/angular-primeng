import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.user = sessionStorage.getItem('fullName') || 'Guest';  // Dapatkan nama pengguna dari sessionStorage atau gunakan 'Guest'
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
