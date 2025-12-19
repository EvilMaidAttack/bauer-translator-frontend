import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';

declare const bootstrap: any;

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
  auth = inject(AuthService);
  router = inject(Router);

  activeLeft = 0;
  activeWidth = 0;

  @ViewChild('mobileNav') mobileNav!: ElementRef;

  logout() {
    this.closeMobileNav();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  setActive(link: ElementRef) {
    const el = link.nativeElement as HTMLElement;
    this.activeLeft = el.offsetLeft;
    this.activeWidth = el.offsetWidth;
  }

  // Optional: set initial pill position when route loads
  ngAfterViewInit() {
    const active = document.querySelector('.nav-link.active') as HTMLElement;
    if (active) {
      this.activeLeft = active.offsetLeft;
      this.activeWidth = active.offsetWidth;
    }
  }

  openMobileNav(){
    const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(
      this.mobileNav.nativeElement,
      {
        backdrop: true,
        scroll: false
      }
    );
    offcanvas.show()
  }

  closeMobileNav(){
    const offcanvas = bootstrap.Offcanvas.getInstance(this.mobileNav.nativeElement);
    offcanvas?.hide();
  }

}
