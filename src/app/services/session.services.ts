/************************
COMPONENTES/PLUGINS
************************/
import { Injectable } from '@angular/core';
import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';
import { Http, Response, Headers } from '@angular/http';
import * as CryptoJS from 'crypto-js';

/************************
PROVIDERS
************************/

@Injectable()
export class SessionServices {
    private global = new GlobalsServices();
    //private url;
    //private headers;
		private user: any;

	constructor(private http: Http) {
        //this.url = this.global.getApiHost();

        //this.headers = new Headers();
        //this.headers.append('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMWYwM2U5ZjYzNGE5N2M2ZWQ0ZTNiMiIsImVtYWlsIjoidmFuZXNzYXNvdXRvY0BnbWFpbC5jb20iLCJuYW1lIjoiVmFuZXNzYSBTb3V0byIsInJvbGVzIjpbXSwiaWF0IjoxNTEyMDkyMjc1fQ.tz_c4O6GenwKsm7GO9NaC6N3tT7EWjBUIfGdQGTeNvc')
    }

	/************
	GET LOGIN
	*************/
	getLogin(form) {
		this.user = { email: form.uname, password: form.password };
		return this.http.post(localStorage.getItem('URL_API')+'auth/login', this.user).map(
			(res:Response)=>{
				//console.log(res.json());	
				return res.json();
			}
		);
	}

	/************
	GET LOGOUT
	*************/
	getLogout() {
		//console.log('vou sair agora');
	}


	/************************************************************************
	NEW LOGIN
	*************************************************************************/

	getLoginNew(form) {
		this.user = { dsemalog: form.uname, dssenha: form.password, dsmodulo: 'MONITORIA' };
		return this.http.post(localStorage.getItem('URL_API')+'usuario/login', this.user).map(
			(res:Response)=>{
				//console.log("getLoginNew", res.json());
				localStorage.setItem('ID_USER', res.json().IDS001);
				localStorage.setItem('DSMODULO', 'monitoria');
				return res.json();
			}
		);
	}

	encrypt(message) {
		var key = "6Le0DgMTAAAAANokdEEial";
		var iv = "mHGFxENnZLbienLyANoi.e";
		// Encrypt
		var ciphertext = CryptoJS.AES.encrypt(message, key, { iv: iv });
		return ciphertext.toString();
	}

	decrypt(message) {
		var key = "6Le0DgMTAAAAANokdEEial";
		var iv = "mHGFxENnZLbienLyANoi.e";
		// Decrypt
		var bytes = CryptoJS.AES.decrypt(message, key, { iv: iv });
		return bytes.toString(CryptoJS.enc.Utf8);
	}

}
