/************************
COMPONENTES/PLUGINS..
************************/
import { Injectable } from '@angular/core';
import * as $ from 'jquery';
/************************
PROVIDERS
************************/

@Injectable()
class globalsVariables{
	isLogged:boolean = false;
	showNav:boolean;
	user: any;
}

export class GlobalsServices {

	cargaMontada: any = [];

	arTpOcorrenciasNF = [
		{value:'C', text: 'COMPLEMENTO'},
		{value:'D', text: 'DEVOLUÇÃO'},
		{value:'I', text: 'INDUSTRIALIZAÇÃO'},
		{value:'S', text: 'SUBSTITUTO'},
		{value:'T', text: 'TRANSFERÊNCIA'},
		{value:'V', text: 'VENDA'},
		{value:'O', text: 'OUTROS'},
	];

	arSnAgNf = [
		{value: '1', text: 'Sim'},
		{value: '0', text: 'Não'}
	];

	arDtEntreg = [
		{value: '1', text: 'Sim'},
		{value: '0', text: 'Não'}
	];

	getApiHost(){
		var url = "";
		$.ajax({
			url: "assets/env/env.json", async: false, success: function (result) {
				
				var url_atual = window.location.href;
				var url_https = url_atual.slice(0, 5);

				if (url_https == 'https') {
					url = result.URL_API_S;
	        localStorage.setItem('URL_API', result.URL_API_S);
					localStorage.setItem('URL_INT', result.URL_INT_S);
					localStorage.setItem('URL_EVT', result.URL_EVT_S);
				} else {
					url = result.URL_API;
	        localStorage.setItem('URL_API', result.URL_API);
					localStorage.setItem('URL_INT', result.URL_INT);
					localStorage.setItem('URL_EVT', result.URL_EVT);
				}
		}});

	   return url;
	}

	getApiHostUrlEvt(){
		var urlEvt = "";
		urlEvt = localStorage.getItem('URL_EVT');
	   return urlEvt;
	}

	private globalsVariables = new globalsVariables();

	/************
	GET VARIAVEL
	*************/
	getVariavel(nome_variavel){
		return this.globalsVariables[nome_variavel];
	}

	/************
	SET VARIAVEL
	*************/
	setVariavel(nome_variavel, valor){
		this.globalsVariables[nome_variavel] = valor;
		return this.globalsVariables;
	}

}
