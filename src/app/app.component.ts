import { Router, NavigationEnd, ActivatedRoute } from '@angular/router'
import { Component, OnInit } from '@angular/core';
import { GlobalsServices } from './shared/componentesbravo/src/app/services/globals.services';
import { SessionServices } from './services/session.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  showNav: boolean;

  constructor(
    private Router: Router,
    private routeActive: ActivatedRoute,
    private GlobalsServices: GlobalsServices,
    private SessionServices: SessionServices,
    translate: TranslateService
  ) {

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');

    //VERIFICANDO LOGIN NO STORAGE

    if (localStorage.getItem('isLogged') == "true") {
      this.GlobalsServices.setVariavel('isLogged', localStorage.getItem('isLogged'));
    }

    //VERIFICANDO NAVBAR NO STORAGE
    if (localStorage.getItem('showNav') == "true") {
      this.GlobalsServices.setVariavel('showNav', localStorage.getItem('showNav'));
      this.showNav = this.GlobalsServices.getVariavel('showNav');
    }
  }

  //CONFIGURAÇOES DE INICIALIZACAO
  ngOnInit() {
    var url_atual = window.location.href;
    var hash = url_atual.split('hash=');
    
    if ((hash.length <= 1)) { 

      if (!this.GlobalsServices.getVariavel('isLogged')) {
        if ((window.location.href.substring(0, 12) != "/admin/login" || window.location.pathname.substring(0, 18) != "/admin/login?hash=") &&
          !window.location.href.includes('/satisfacao') &&
          !window.location.href.includes('/rastreio')) {
          this.Router.navigate(['admin/login']);
        } else {
          console.log('caiu no else');
        }
      }

      //bloqueando sidebar e headerbar na inicializacao
      this.Router.events.subscribe((e) => {

        if (e instanceof NavigationEnd) {
          let urlSlice = e.url.toString().substr(0, 10);

          //bloqueando not found
          if (
            urlSlice.indexOf('not-found') !== -1 ||
            urlSlice.indexOf('login') !== -1
          ) {
            this.GlobalsServices.setVariavel('showNav', false);
          } else {
            this.GlobalsServices.setVariavel('showNav', true);
          }

        }

      });
      
    }

  }

  verificaSwitch() {
    let itemSwitch = localStorage.getItem('collapsed_menu');
    //console.log(itemSwitch);
  }
}
