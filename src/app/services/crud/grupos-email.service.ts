import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class GruposEmailService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHost();
  }

  addAcao    (A008) {return this.http.post<any>(this.url + "mo/acoes/salvar"    , A008)};
  getAcao    (A008) {return this.http.post<any>(this.url + "mo/acoes/buscar"    , A008)};
  updateAcao (A008) {return this.http.post<any>(this.url + "mo/acoes/atualizar" , A008)};
  deleteAcao (A008) {return this.http.post<any>(this.url + "mo/acoes/remover"   , A008)};
}
