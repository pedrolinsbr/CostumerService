import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class AtendimentosService {
	private global = new GlobalsServices();
	private url;

	constructor(private http: HttpClient) {
		this.url = this.global.getApiHost();
	}

	getIndicadoresEmAberto(objFiltro) {
		return this.http.post<any>(this.url + "mo/atendimentos/getIndicadoresEmAberto", objFiltro);
	}

	getDashboardsNps(objFiltro) {
		return this.http.post<any>(this.url + "mo/atendimentos/getDashboardsNps", objFiltro);
	}

	getTiposDeAcao() {
		return this.http.post<any>(this.url + "mo/atendimentos/getTiposDeAcao", null);
	}

	getAllMotivos() {
		return this.http.post<any>(this.url + "mo/atendimentos/getAllMotivos", null);
	}

	salvarNovoAtendimento(A001) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarNovoAtendimento", A001);
	}

	salvarFinalizarNovoAtendimento(A001) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarFinalizarNovoAtendimento", A001);
	}

	getInformacoesAtendimento(IDA001) {
		return this.http.post<any>(this.url + "mo/atendimentos/getInformacoesAtendimento", IDA001);
	}

	getMovimentacoesAtendimento(IDA001) {
		return this.http.post<any>(this.url + "mo/atendimentos/getMovimentacoesAtendimento", IDA001);
	}

	salvarMovimentacao(A003) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarMovimentacao", A003);
	}

	salvarEditaMovimentacao(A003){
		return this.http.post<any>(this.url + "mo/atendimentos/salvarEditaMovimentacao", A003);
	}

	visualizarAnexo(IDA001){
		return this.http.post<any>(this.url + "mo/atendimentos/visualizarAnexo", IDA001);
	}

	downloadAnexo(IDA004):Observable<any>{
		return this.http.post(this.url + "mo/atendimentos/downloadAnexo", IDA004,{responseType: 'blob'});
	}
	
	salvarFinalizarNovoAtendimentoReasonCode(A001) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarFinalizarNovoAtendimentoReasonCode", A001);
	}

	getAllMotivos4PL() {
		return this.http.post<any>(this.url + "mo/atendimentos/getAllMotivos4PL", null);
	}
	salvarFinalizarNovoAtendimentoRecusa(A001) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarFinalizarNovoAtendimentoRecusa", A001);
	}
	validaTime4pl(USER) {
		return this.http.post<any>(this.url + 'mo/usuario/validaTime4pl', USER);
	}

	salvarFinalizarNovoAtendimentoMotivoQM(A001) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarFinalizarNovoAtendimentoMotivoQM", A001);
	}

	buscaUltimoMotivo(IDG043){
		return this.http.post<any>(this.url + "mo/atendimentos/buscaUltimoMotivo", IDG043);
	}

	buscaManterSla(IDG043){
		return this.http.post<any>(this.url + "mo/atendimentos/buscaManterSla", IDG043);
	}

	removeAtendimento(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/removeAtendimento", obj);
	}

	cancelarRecusa(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/cancelarRecusa", obj);
	}

	vincularAtendente(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/vinculaAtendente", obj);
	}

	removerVinculoAtend(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/removerVinculoAtend", obj);
	}
	salvarAtendimentoDataCanhot(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarAtendimentoDataCanhot", obj);
	}

	salvarRemocaoEntrega(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/salvarRemocaoEntrega", obj);
	}

	listaStEmail(obj) {
		return this.http.post<any>(this.url + "mo/atendimentos/listaStEmail", obj);
	}
}
