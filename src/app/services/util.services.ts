/************************
UTIL SERVICES FUNCTION
************************/
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

/************************
PROVIDERS
************************/

@Injectable()
export class UtilServices {


    private global = new GlobalsServices();
    private url;

    constructor(private http: Http) {
      this.url = this.global.getApiHost();
    }

    /* CONSTROE COLUNAS NO NGX-DATAGRID */
    columns(aryColumns){

    }

    usuarios(){
        return this.http.get(this.url + "usuarios")
        .map(res => res.json());
    }

    formataDinheiro(n) {
      if(n == null || n == undefined){
        return n
      }
      return "R$ " + n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }

    formataVolume(n){
        //return n;
        if(n == null || n == undefined){
          return n
        }
        return n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }

    formataPeso(n){
      if(n == null || n == undefined){
        return n
      }
      return n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.") + ' kg';
    }

    formataQtProdut(n){
      if(n == null || n == undefined){
        return n
      }
      n = parseFloat(n);
      return n.toFixed(4).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
  }

    formataDistancia(n){
      if(n == null || n == undefined){
        return n
      }
      return n.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }

    formataPorcentagem(n){
      if(n == null || n == undefined){
        return n
      }
      return n.toFixed(1).replace('.', ',');
    }
    formataDataBrasil(n){
      if(n == null || n == undefined){
        return n
      }
      var res = n.split("-");
      var ano = res[0];
      var mes = res[1];
      var dia = res[2];
      return dia + "/" + mes + "/" + ano;
    }

    parseDate(n){
      var partesData = n.split("/");
      return new Date(partesData[2], partesData[1] - 1, partesData[0]);
    }

    validaField(field) {
      if (field != '' && field != undefined && field != null) {
        return true;
      } else {
        return false;
      }
    }

}
