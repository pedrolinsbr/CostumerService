import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class SacDashboardService {
	private global = new GlobalsServices();
	private url;

	constructor(private http: HttpClient) {
		this.url = this.global.getApiHost();
	}

	getDashboardAtendimentoPorAtendente(obj) {
		return this.http.post<any>(this.url + 'mo/atendimentos/getDashboardAtendimentoPorAtendente', obj);
	}

	getDashboardTempoAtendimento(obj) {
		return this.http.post<any>(this.url + 'mo/atendimentos/getDashboardTempoAtendimento', obj);
	}

	getDashboardSituacaoAtendimento(obj) {
		return this.http.post<any>(this.url + 'mo/atendimentos/getDashboardSituacaoAtendimento', obj);
	}

	getDashboardAcaoXMotivo(obj) {
		return this.http.post<any>(this.url + 'mo/atendimentos/getDashboardAcaoXMotivo', obj);
	}
}
