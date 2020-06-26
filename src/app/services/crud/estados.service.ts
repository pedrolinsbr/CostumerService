import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class EstadosService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: Http) {
    this.url = this.global.getApiHost();
  }

  getEstados() {
    return this.http.get(this.url + "estados")
      .map(res => res.json());
  }

  getEstado(IDG002) {
    //console.log('id');

    return this.http.get(this.url + "estado/" + IDG002)
      .map(res => res.json());
  }

  getEstadosPais(IDG001) {
    //console.log('id');

    return this.http.get(this.url + "estados-pais/" + IDG001)
      .map(res => res.json());
  }

  addEstado(estado) {
    return this.http.post(this.url + "estado", estado)
      .map(res => res.json());
  }

  updateEstado(estado) {
    this.http.post(this.url + "estado/" + estado.IDG001, estado)
    .subscribe( data => {
      //console.log(data);
    })
    ;

    return this.http.post(this.url + "estado/" + estado.IDG001, estado)
      .map(res => res.json());
  }

  deleteEstado(IDG002) {
    return this.http.delete(this.url + "estado/" + IDG002)
      .map(res => res.json());
  }

}
