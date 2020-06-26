import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class SacService {
	private global = new GlobalsServices();
	private url;

	constructor(private http: HttpClient) {
		this.url = this.global.getApiHost();
	}

	getAtendentes    (obj) {return this.http.post<any>(this.url + "mo/atendimentos/atendentes"    , obj)};
	getClientes(obj) { return this.http.post<any>(this.url + "mo/atendimentos/clientesCockpit", obj) };
	getAtendentesConfig    (obj) {return this.http.post<any>(this.url + "mo/atendimentos/getAtendentesCockpitConfig"    , obj)};
}
