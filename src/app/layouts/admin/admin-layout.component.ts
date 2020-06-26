import { Component, OnInit, OnDestroy, ViewChild, HostListener, AnimationTransitionEvent, NgZone, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import { AdminLayoutService } from '../../services/admin-layout.service';


const SMALL_WIDTH_BREAKPOINT = 991;

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  private _router: Subscription;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  currentLang = 'en';
  options: Options;
  theme = 'light';
  showSettings = false;
  isDocked = false;
  isBoxed = false;
  isOpened = true;
  mode = 'push';
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;
  tamMenu = 1;
  nmusuari = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).NMUSUARI : null;
  dsano = new Date().getFullYear();
  menuItensAux: any;

  clickAux:boolean = false;

  @ViewChild('sidebar') sidebar;

  constructor (
    public menuItems: MenuItems,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private GlobalsServices: GlobalsServices,
    private modalService: NgbModal,
    private titleService: Title,
    private zone: NgZone,
    public adminService: AdminLayoutService) {
    /* const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en'); */
    this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('user'))) {
      this.getAtendimentosAbertos();
    }

    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // Scroll to top on view load
      document.querySelector('.main-content').scrollTop = 0;
      this.runOnRouteChange();
    });
    this.addMenu();
  }


  ngAfterViewInit(): void  {
    setTimeout(_ => this.runOnRouteChange());
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver() || this.router.url === '/maps/fullscreen') {
      this.isOpened = false;
    }

    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
        console.log('ccc');
      }
      this.options = activeRoute.snapshot.data;
    });

    if (this.options) {
      if (this.options.hasOwnProperty('heading')) {
        this.setTitle(this.options.heading);
      }
    }
  }

  setTitle( newTitle: string) {
    this.titleService.setTitle( 'Monitoria | ' + newTitle );
  }

  toogleSidebar(): void {
    if (this._mode !== 'dock') {
      this.isOpened = !this.isOpened;
    }
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 991px)`).matches;
  }

  openSearch(search) {
    this.modalService.open(search, { windowClass: 'search', backdrop: false });
  }

  addMenu(): void {

    this.adminService.getMenu()
      .subscribe(
        data => {
          if (JSON.parse(localStorage.getItem('user'))) {
            var homeAux = 0;
            for (let i = 0; i < data.length; i++) {
              if (data[i].IDS022 == 42) {
                homeAux = 1;
              }
            }
            if (homeAux == 0 && this.router.url == '/home') {
              location.href = "/#/";
            } else if (homeAux == 1) {
              location.href = "/#/home";
            }
          }
          this.menuItems.add(data);
          this.menuItensAux = data;
          this.tamMenu = this.menuItems.tamMenu();
        },
        err => {
          alert("Não foi possível carregar o menu, possível falha de conexão.");
        });

  }

  goBack(){
    this.clickAux = true;
    this.adminService.goBack(this.clickAux);
    this.clickAux = false;
  }

  logout(){

    //removendo sessions
    this.GlobalsServices.setVariavel('isLogged', false);
    this.GlobalsServices.setVariavel('showNav', false);
    localStorage.setItem('isLogged', 'false');
    localStorage.setItem('showNav', 'false');
    localStorage.setItem('user',null);
    localStorage.setItem('token', null);
    //this.showNav = false;

    //atualiza pagina
    location.href = "/#/admin/login";

  }

  goAtendimentos(){
    this.router.navigate(['/sac/backlog']);
  }
  validNumber = true;
  arAtendimentos = [];
  notifyVista(){
    this.validNumber = false;
  }
  getAtendimentosAbertos(): void {
    this.adminService.getAtendimentos().subscribe(
      data=>{
        console.log(data);
        this.arAtendimentos = data;
      },
      err=>{}
    );
  }
}
