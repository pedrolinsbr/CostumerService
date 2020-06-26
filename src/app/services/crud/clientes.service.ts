import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class ClientesService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: HttpClient) {
    this.url = this.global.getApiHost();
  }

  addCliente(G005) {
    return this.http.post<any>(this.url + "mo/cliente/salvar", G005);
  }

  getCliente(G005) {
    return this.http.post<any>(this.url + "mo/cliente/buscar" , G005);
  }

  updateCliente(G005) {
    return this.http.post<any>(this.url + "mo/cliente/atualizar", G005);
  }

  deleteCliente(G005) {
    return this.http.post<any>(this.url + "mo/cliente/remover", G005);
  }

  teste() {
    return this.http.get<any>(this.url + "usuarioTeste", {});
  }
}
