import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';



@Injectable()
export class AdminLayoutService {

  private global = new GlobalsServices();
  private url;

  public exibir:boolean = false;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHost();
  }

  getMenu(){

  	 let user = JSON.parse(localStorage.getItem('user'));
  	 let obj  = {ids001: user.IDS001, dsmodulo: 'monitoria'};
     //let obj  = {ids001: 97, dsmodulo: 'MONITORIA'};

    return this.http.post<any>(this.url + "menu/menuItens", obj);

  }

  getAtendimentos() {
    let user = JSON.parse(localStorage.getItem('user'));
    let obj  = {IDS001: user.IDS001};
    return this.http.post<any>(this.url + "mo/atendimentos/listarMovNotificacoes "    , obj);
  }

  goBack(exibe){
    if(exibe == true){
      this.exibir = true;
    }
  }


}
