import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionServices } from '../../services/session.services';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { ErrorServices } from '../../services/error.services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from 'mapbox-gl-draw';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  res: any;
  public form: FormGroup;
  public loading = true;
  public hash: String = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionServices: SessionServices,
    private GlobalsServices: GlobalsServices,
    private toastr: ToastrService,
    private errorServices: ErrorServices,
    public translate: TranslateService,
    public location: Location,
    private activatedRoute: ActivatedRoute,
  ) {
    //localStorage.clear();
    localStorage.setItem('isLogged', 'false');
    localStorage.setItem('showNav', 'false');
    localStorage.setItem('user',null);
    localStorage.setItem('token', null);
    // Recupera a URL do servidor
    GlobalsServices.getApiHost();

    /* const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt'); */

    this.activatedRoute.queryParams.subscribe(
      params => {
        this.hash = params['hash'];
      }
    );
  }

  ngOnInit() {

    var url_atual = window.location.href;
    var url_https = url_atual.slice(0, 5);
    console.log(url_atual, url_https);
    if (url_https != 'https' && 
        url_atual.indexOf("localhost") == -1 && 
        url_atual.indexOf("dev.") == -1 && 
        url_atual.indexOf("qas.") == -1 && 
        url_atual.indexOf("qas2.") == -1) {

        location.replace("https://monitoria.evolog.com.br/#/");
      
    }


    this.form = this.fb.group({
      uname: [null, Validators.compose([Validators.required])], password: [null, Validators.compose([Validators.required])]
    });

    //console.log(this.hash);
    if (this.hash != undefined) {
      this.hash = JSON.parse(this.sessionServices.decrypt(this.hash));
      console.log(this.hash);
      let dataAtual = (new Date().getTime());
      this.hash['time'] = new Date(parseInt(this.hash['time']));
      //console.log(this.hash);
      //console.log((new Date().getTime()));
      if ((new Date().getTime()) <= this.hash['time']) { // :TODO Mudar aqui quando for produção
        //console.log('OK');
        this.login(this.hash);
      } else {
        //console.log('Redireciona para o www.evolog.com.br');
        if (window.location.hostname == "localhost") {
          this.loading = false;
        } else {
          location.href = "http://www.evolog.com.br";
        }
      }
    } else {
      this.loading = false;
    }
  }

  /* ngAfterViewInit() {
    console.log('bbb');

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY292ZWx1ZG8iLCJhIjoiY2pldTdnbjZlMDIxcjMzdWwwc3lldXAxNiJ9.tUoN8qfQAk9kYuRnWL09EQ';
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
    });

  } */

  onSubmit() {
    this.login(undefined);
  }

  login(formValue) {
    if (formValue == undefined) {
      formValue = this.form.value;
    }
    //console.log(formValue);
    this.sessionServices.getLoginNew(formValue).subscribe(
      (data) => {
        if(data.LIBERADO){

          var modulo = "MONITORIA";
          if(data.SNADMIN == 1){
            modulo = undefined;
          }
          let userLogin = {NMUSUARI: data.NMUSUARI, SNADMIN: data.SNADMIN, DSEMALOG: data.DSEMALOG, IDS001: data.IDS001, DSMODULO: modulo, TOKEN: data.TOKEN}

          if(!data.MODULO && data.SNADMIN == 0){
            //Permissão negada
            this.toastr.error(this.errorServices.showError(1003));
            return false;
          }
          localStorage.setItem('isLogged', 'true');
          localStorage.setItem('showNav', 'true');
          this.GlobalsServices.setVariavel('isLogged', true);
          this.GlobalsServices.setVariavel('showNav', true);
          localStorage.setItem('user',JSON.stringify(userLogin));
          localStorage.setItem('token', userLogin.TOKEN);
          //this.router.navigate(["/home"]);
          //location.href = "/#/home";
          location.href = "/#/";
        } else {
          this.toastr.error(this.errorServices.showError(1001));
          return false;
        }
        return data;
      },
      (err) => {
        console.log('err');
        console.error(err);
        this.errorServices.alertError(err);
        return err;
      }
    );
  }

}
