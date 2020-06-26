import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class MotivosService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHost();
  }

  addMotivo    (A002) {return this.http.post<any>(this.url + "mo/motivos/salvar"    , A002)};
  getMotivo    (A002) {return this.http.post<any>(this.url + "mo/motivos/buscar"    , A002)};
  updateMotivo (A002) {return this.http.post<any>(this.url + "mo/motivos/atualizar" , A002)};
  deleteMotivo (A002) {return this.http.post<any>(this.url + "mo/motivos/remover"   , A002)};
}
