import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-agricultor-layout',
  templateUrl: './agricultor-layout.component.html',
  styleUrls: ['./agricultor-layout.component.css']
})
export class AgricultorLayoutComponent {
  title: string = ''; // Título por defecto

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routeData = this.getRouteData(this.activatedRoute);
        if (routeData && routeData.title) {
          this.title = routeData.title;
        }
      }
    });
  }

  private getRouteData(route: ActivatedRoute): any {
    if (route.firstChild) {
      return this.getRouteData(route.firstChild);
    } else {
      return route.snapshot.data;
    }
  }
}
