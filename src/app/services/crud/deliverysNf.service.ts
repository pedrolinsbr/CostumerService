import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

@Injectable()
export class DeliverysNfService {
	private global = new GlobalsServices();
	private url;

	constructor(private http: HttpClient) {
		this.url = this.global.getApiHost();
	}

	getInformacoesNotaFiscal(IDG043) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getInformacoesNotaFiscal', IDG043);
	}

	getInfoCTE(NRCHADOC) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getInfoCTE', NRCHADOC);
	}

	salvaDataCanhoto(NRCHADOC) {
		return this.http.post<any>(this.url + 'mo/deliverynf/salvaDataCanhoto', NRCHADOC);
	}

	getNfefromRastreio(IDG043) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getNfefromRastreio', IDG043);
	}

	getDatasToAtendimento(IDG043) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getDatasToAtendimento', IDG043);
	}

	getNotasVinculadasAtendimento(IDA001) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getNotasVinculadasAtendimento', IDA001);
	}

	isEntregue(IDG043) {
		return this.http.post<any>(this.url + 'mo/deliverynf/isEntregue', IDG043);
	}

	getStatusGeralNota(IDG043) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getStatusGeralNota', IDG043);
	}

	isValidSendRastreio(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/isValidSendRastreio', obj);
	}

	validaPermissaoRastreio(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/validaPermissaoRastreio', obj);
	}

	sendRastreio(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/sendRastreio', obj);
	}

	validaRastreio(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/validaRastreio', obj);
	}

	enviarSatisfacaoUnico(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/enviarSatisfacaoUnico', obj);
	}

	validaSatisfacao(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/validaSatisfacao', obj);
	}

	salvarSatisfacao(G061) {
		return this.http.post<any>(this.url + 'mo/deliverynf/salvarSatisfacao', G061);
	}

	salvarNotaAlterada(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/salvarNotaAlterada', obj);
	}

	getComentario(IDG061){
		return this.http.post<any>(this.url + 'mo/deliverynf/getComentario', IDG061);
	}
	salvarResposta(obj){
		return this.http.post<any>(this.url + 'mo/deliverynf/salvarResposta', obj);
	}
	visualizarCanhoto(obj){
		return this.http.post<any>(this.url + 'multidoc/info', obj);

	}
	downloadCanhoto(obj):Observable<any>{
		return this.http.get(this.url + 'multidoc/download/' + obj.IDG082, { responseType: 'blob' });

	}

	downloadCanhotoCTE(PKS007):Observable<any>{
		return this.http.get(this.url + 'multidoc/downloadCte/' + PKS007, { responseType: 'blob' });

	}
	removerCanhoto(obj){
		return this.http.delete(this.url + 'multidoc/remove/' + obj.IDG082);
	}
	gerarXML(obj){
		// let UrlEvt = localStorage.getItem('URL_EVT');
		// return this.http.get<any>(UrlEvt + 'docsyn/pod/generate/' + obj.IDG043);

		return this.http.post<any>(this.url + 'mo/deliverynf/auxGerarXML', obj);
	}
	listarQM(obj) {
		// let UrlEvt = localStorage.getItem('URL_EVT');
		// return this.http.post<any>(UrlEvt + 'mo/deliverynf/listarQm', obj);

		return this.http.post<any>(this.url + 'mo/deliverynf/listarQmAux', obj);
	}
	listarConteudoQM(obj) {
		// let UrlEvt = localStorage.getItem('URL_EVT');
		// return this.http.post<any>(UrlEvt + 'mo/deliverynf/listarConteudoQM', obj);

		return this.http.post<any>(this.url + 'mo/deliverynf/listarConteudoQMAux', obj);
	}
	visualizarQM(obj) {
		// let UrlEvt = localStorage.getItem('URL_EVT');
		// return this.http.post<any>(UrlEvt + 'mo/deliverynf/visualizarQM', obj);

		return this.http.post<any>(this.url + 'mo/deliverynf/visualizarQMAux', obj);
	}
	getDatasToAtendimentoAg(IDG083) {
		return this.http.post<any>(this.url + 'mo/deliverynf/getDatasToAtendimentoAg', IDG083);
	}
	getDanfe(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/danfeGeneratorByXml',obj);
	}

	downloadDocs(obj):Observable<any> {
		return this.http.get(this.url + 'mo/deliverynf/downloadXmlDocs/' + obj, { responseType: 'blob' });
	}

	getDacte(obj) {
		return this.http.post<any>(this.url + 'mo/deliverynf/dacteGeneratorByXml',obj);
	}

	buscarAcoes(obj) {
		return this.http.post<any>(this.url + "filtro/Acoes", obj)
	};

	enableMailReceptionNPS(obj){
		return this.http.post<any>(this.url + 'mo/deliverynf/enableMailReceptionNPS',obj);
	}
}
