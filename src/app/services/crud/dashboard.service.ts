import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class DashboardService {
	private global = new GlobalsServices();
	private url;

	constructor(private http: HttpClient) {
		this.url = this.global.getApiHost();
	}

	getDashboardIndicadores(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getDashboardIndicadores', obj);
	}

	getDashboardDiasEmAtraso(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getDashboardDiasEmAtraso', obj);
	}

	getDashboardEntregas(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getDashboardEntregas', obj);
	}

	getDashboardDemanda(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getDashboardDemanda', obj);
	}
}
