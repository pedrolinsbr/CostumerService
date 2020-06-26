import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalsServices } from '../globals.services';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class MunicipiosService {
  private global = new GlobalsServices();
  private url;

  constructor(private http: Http) {
    this.url = this.global.getApiHost();
  }

  getMunicipios() {
    return this.http.post(this.url + "mo/cidade/listar", '')
      .map(res => res.json());
  }

  getMunicipio(IDG003) {
    return this.http.post(this.url + "mo/cidade/buscar" , IDG003)
      .map(res => res.json());
  }

  getMunicipiosEstado(IdG002) {
    return this.http.get(this.url + "cidades-estado/" + IdG002)
      .map(res => res.json());
  }
  getClientesMunicipio(IdG003) {
    return this.http.get(this.url + "cidade-clientes/" + IdG003)
      .map(res => res.json());
  }

  addMunicipio(municipio) {
    return this.http.post(this.url + "mo/cidade/salvar", municipio)
      .map(res => res.json());
  }

  updateMunicipio(municipio) {
    return this.http.post(this.url + "mo/cidade/atualizar", municipio)
      .map(res => res.json());
  }

  deleteMunicipio(IDG003) {
    return this.http.post(this.url + "mo/cidade/deleteSingle" , IDG003)
      .map(res => res.json());
  }

  deleteMunipiosSelecionados(objMunicipiosSelecionados) {
    return this.http.post(this.url + 'mo/cidade/deleteMultiple' , objMunicipiosSelecionados)
      .map(res => res.json());
  }

}
