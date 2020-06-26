//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';


@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})

export class PerformanceComponent implements OnInit {
  global = new GlobalsServices();
  url = this.global.getApiHost();
  modalRef: NgbModalRef;
  advancedFilter = false;


  // ##### ARRAYS // OBJECTS
	arIdCte = [];
	arIdNfe =[];

	objStyle             = {
		'background' : '#43295b',
		'color'      : '#ffffff',
		'iconColor'  : '#ffffff',
		'iconOpacity': '0.5'
	  };

  //##### FORMS
  objFormFilter    : FormGroup;
  objFormFilterH   : FormGroup;

  //###### DATAS
  data             = new Date();
  dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
  dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
  mesSelecionado   = '';
  anoSelecionado   = '';
  dataClicou       = [];

  diaSelecionado;


  constructor(
    private formBuilder : FormBuilder,
    private grid        : DatagridComponent,
    private toastr      : ToastrService,
    private utilServices: UtilServices
  ) {
    this.objFormFilter = formBuilder.group({
      NF: [],
      IDG043: 		 [],
      IDG051: 		 [],
      IDG046: 		 [],
      IDG005RE:		 [],
      IDG005DE:		 [],
      IDG005_TRANSP:	 [],
      NRNOTA: 		 [],
      NRCTE: 			 [],
      DTINICIO: 		 [],
      DTFIM: 			 [],
      DESTINATARIO: 	 [],

      //filtros que valem
      G083_DTEMINOT : [],
      G083_NRNOTA   : [],
      G051_IDG051   : [],
      G051_CDCTRC   : [],
      G046_CDVIAOTI   : [],
      G051_IDG005RE :	[],
      G043_IDG005DE : [],
      G024_IDG024   : [],
      G005DE_CJCLIENTDE : [],

      //ID's
      G051_IDG005DE:	[],
      G051_IDG005RC :	[],
      G051_IDG005EX :	[],
      G051_IDG005CO :	[],

      //CNPJ's
      G005RE_CJCLIENT : [],
      G005DE_CJCLIENT : [],
      G005CO_CJCLIENT : [],
      G005RC_CJCLIENT : [],
      G005EX_CJCLIENT : [],

      //ID's CIDADES
      G005RE_IDG003 : [],
      G005DE_IDG003 : [],
      G005CO_IDG003 : [],
      G005RC_IDG003 : [],
      G005EX_IDG003 : [],

      G051_TPTRANSP: [],
      G051_STCTRC:  [],
      A002_IDA008:  [],

      TPMODCAR: [],
    });


    this.objFormFilterH = formBuilder.group({
      DTINICIO    : [],
      DTFIM       : [],
      G083_NRNOTA : [],
      G043_IDG005DE : [],
      G024_IDG024   : [],
      G046_CDVIAOTI   : [],

      //ID's
      G051_IDG005RE :	[],
      G051_IDG005DE :	[],
      G051_IDG005RC :	[],
      G051_IDG005EX :	[],
      G051_IDG005CO :	[],

      //ID's CIDADES
      G005RE_IDG003 : [],
      G005DE_IDG003 : [],
      G005CO_IDG003 : [],
      G005RC_IDG003 : [],
      G005EX_IDG003: [],
      G051_STCTRC:  [],
      A002_IDA008:  [],

      //Filtro para transportadora bravo ou terceiras 
      TPMODCAR: []
    });
  }

  ngOnInit() {
    this.objFormFilter.controls['G083_DTEMINOT'].setValue(
      [
        this.dataC(this.dtInicioDefault[0]),
        this.dataC(this.dtTerminoDefault[0])
      ]
    );
    this.objFormFilter.controls['G051_STCTRC'].setValue('A');
  }

  dataClick(event){
    if(event != null){
      let dia = event.year + '-' + event.month + '-' + event.day;
      this.diaSelecionado = new Date(dia);
      this.dataClicou = event;
      this.anoSelecionado = event.year;
    }
  }

  dataC(event) {
    let thiscontext = '';
    if(event.day < 10){
      thiscontext = "0"+event.day;
    }else{
      thiscontext = event.day;
    }
    if(event.month < 10){
      thiscontext += "/0"+event.month;
    }else{
      thiscontext += "/"+event.month;
    }
    thiscontext += "/"+event.year;
    return thiscontext;
  }

  idNfe = {in:[]};
  idCte = {in:[]};

  filtrarHome() : void {

    this.idNfe = {in:[]};
    this.idCte = {in:[]};

    // ID REMETENTE
    if(this.objFormFilterH.controls['G051_IDG005RE'].value &&  this.objFormFilterH.controls['G051_IDG005RE'].value.length != 0){
      this.objFormFilter.controls['G051_IDG005RE'].setValue({in:this.objFormFilterH.controls['G051_IDG005RE'].value});
    }else{
      this.objFormFilter.controls['G051_IDG005RE'].setValue(null);
    }

    // ID DESTINATÁRIO
    if(this.objFormFilterH.controls['G051_IDG005DE'].value &&  this.objFormFilterH.controls['G051_IDG005DE'].value.length != 0){
      this.objFormFilter.controls['G051_IDG005DE'].setValue({in:this.objFormFilterH.controls['G051_IDG005DE'].value});
    }else{
      this.objFormFilter.controls['G051_IDG005DE'].setValue(null);
    }

    // ID TOMADOR
    if(this.objFormFilterH.controls['G051_IDG005CO'].value &&  this.objFormFilterH.controls['G051_IDG005CO'].value.length != 0){
      this.objFormFilter.controls['G051_IDG005CO'].setValue({in:this.objFormFilterH.controls['G051_IDG005CO'].value});
    }else{
      this.objFormFilter.controls['G051_IDG005CO'].setValue(null);
    }

    // ID RECEBEDOR
    if(this.objFormFilterH.controls['G051_IDG005RC'].value &&  this.objFormFilterH.controls['G051_IDG005RC'].value.length != 0){
      this.objFormFilter.controls['G051_IDG005RC'].setValue({in:this.objFormFilterH.controls['G051_IDG005RC'].value});
    }else{
      this.objFormFilter.controls['G051_IDG005RC'].setValue(null);
    }

    // ID EXPEDIDOR
    if(this.objFormFilterH.controls['G051_IDG005EX'].value &&  this.objFormFilterH.controls['G051_IDG005EX'].value.length != 0){
      this.objFormFilter.controls['G051_IDG005EX'].setValue({in:this.objFormFilterH.controls['G051_IDG005EX'].value});
    }else{
      this.objFormFilter.controls['G051_IDG005EX'].setValue(null);
    }

    // ID NOTA FISCAL
    if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			  this.idNfe.in.push(i.name)
			}
			this.objFormFilter.controls['G083_NRNOTA'].setValue(this.idNfe);
		  }else{
			this.objFormFilter.controls['G083_NRNOTA'].setValue(null);
		  }

		// ID CTE
		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			  this.idCte.in.push(i.name)
			}
			this.objFormFilter.controls['G051_CDCTRC'].setValue(this.idCte);
		}else{
			this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
		}

    // CNPJ REMETENTE
    if(this.objFormFilter.controls['G005RE_CJCLIENT'].value){
      this.objFormFilter.controls['G005RE_CJCLIENT'].setValue(this.formataCnpj(this.objFormFilter.controls['G005RE_CJCLIENT'].value));
    }

    // CNPJ DESTINATÁRIO
    if(this.objFormFilter.controls['G005DE_CJCLIENT'].value){
      this.objFormFilter.controls['G005DE_CJCLIENT'].setValue(this.formataCnpj(this.objFormFilter.controls['G005DE_CJCLIENT'].value));
    }

    // CNPJ TOMADOR
    if(this.objFormFilter.controls['G005CO_CJCLIENT'].value){
      this.objFormFilter.controls['G005CO_CJCLIENT'].setValue(this.formataCnpj(this.objFormFilter.controls['G005CO_CJCLIENT'].value));
    }

    // CNPJ RECEBEDOR
    if(this.objFormFilter.controls['G005RC_CJCLIENT'].value){
      this.objFormFilter.controls['G005RC_CJCLIENT'].setValue(this.formataCnpj(this.objFormFilter.controls['G005RC_CJCLIENT'].value));
    }

    // CNPJ EXPEDIDOR
    if(this.objFormFilter.controls['G005EX_CJCLIENT'].value){
      this.objFormFilter.controls['G005EX_CJCLIENT'].setValue(this.formataCnpj(this.objFormFilter.controls['G005EX_CJCLIENT'].value));
    }

    // ID CIDADE REMETENTE
    if(this.objFormFilterH.controls['G005RE_IDG003'].value &&  this.objFormFilterH.controls['G005RE_IDG003'].value.length != 0){
      this.objFormFilter.controls['G005RE_IDG003'].setValue({in:this.objFormFilterH.controls['G005RE_IDG003'].value});
    }else{
      this.objFormFilter.controls['G005RE_IDG003'].setValue(null);
    }

    // ID CIDADE DESTINATÁRIO
    if(this.objFormFilterH.controls['G005DE_IDG003'].value &&  this.objFormFilterH.controls['G005DE_IDG003'].value.length != 0){
      this.objFormFilter.controls['G005DE_IDG003'].setValue({in:this.objFormFilterH.controls['G005DE_IDG003'].value});
    }else{
      this.objFormFilter.controls['G005DE_IDG003'].setValue(null);
    }

    // ID CIDADE TOMADOR
    if(this.objFormFilterH.controls['G005CO_IDG003'].value &&  this.objFormFilterH.controls['G005CO_IDG003'].value.length != 0){
      this.objFormFilter.controls['G005CO_IDG003'].setValue({in:this.objFormFilterH.controls['G005CO_IDG003'].value});
    }else{
      this.objFormFilter.controls['G005CO_IDG003'].setValue(null);
    }

    // ID CIDADE RECEBEDOR
    if(this.objFormFilterH.controls['G005RC_IDG003'].value &&  this.objFormFilterH.controls['G005RC_IDG003'].value.length != 0){
      this.objFormFilter.controls['G005RC_IDG003'].setValue({in:this.objFormFilterH.controls['G005RC_IDG003'].value});
    }else{
      this.objFormFilter.controls['G005RC_IDG003'].setValue(null);
    }

    // ID CIDADE EXPEDIDOR
    if(this.objFormFilterH.controls['G005EX_IDG003'].value &&  this.objFormFilterH.controls['G005EX_IDG003'].value.length != 0){
      this.objFormFilter.controls['G005EX_IDG003'].setValue({in:this.objFormFilterH.controls['G005EX_IDG003'].value});
    }else{
      this.objFormFilter.controls['G005EX_IDG003'].setValue(null);
    }

    // RANGE DATA EMISSÃO NF
    if((this.objFormFilterH.controls['DTFIM'].value != null) && (this.objFormFilterH.controls['DTINICIO'].value !=null)){
      this.objFormFilter.controls['G083_DTEMINOT'].setValue(
        [
          this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
          this.dataC(this.objFormFilterH.controls['DTFIM'].value)
        ]
      );
    }else{
      this.objFormFilter.controls['G083_DTEMINOT'].setValue(null);
    }

    if (this.objFormFilterH.controls['G051_STCTRC'].value == 'A' || this.objFormFilterH.controls['G051_STCTRC'].value == 'C') {
      this.objFormFilter.controls['G051_STCTRC'].setValue(this.objFormFilterH.controls['G051_STCTRC'].value);
    } else if (this.objFormFilterH.controls['G051_STCTRC'].value == 'N') {
      this.objFormFilter.controls['G051_STCTRC'].setValue('');
    } else {
      this.objFormFilter.controls['G051_STCTRC'].setValue('A');
    }

    if (this.objFormFilterH.controls['A002_IDA008'].value == 0) {
      this.objFormFilter.controls['A002_IDA008'].setValue(null);
    } else if (this.objFormFilterH.controls['A002_IDA008'].value == 1) {
      this.objFormFilter.controls['A002_IDA008'].setValue('1');
    } else if (this.objFormFilterH.controls['A002_IDA008'].value == 2) {
      this.objFormFilter.controls['A002_IDA008'].setValue('2');
    }


    //Filtro para Tranportadora Bravo/Terceiro/Todos 
    this.objFormFilter.controls['TPMODCAR'].setValue(this.objFormFilterH.controls['TPMODCAR'].value);
    


    // if(this.objFormFilterH.controls['G043_IDG005DE'].value && this.objFormFilterH.controls['G043_IDG005DE'].value.length != 0){
    // 	this.objFormFilter.controls['G043_IDG005DE'].setValue({in:this.objFormFilterH.controls['G043_IDG005DE'].value});
    // }else{
    //   this.objFormFilter.controls['G043_IDG005DE'].setValue(null);
    //
    // }

    // if(this.objFormFilterH.controls['G024_IDG024'].value && this.objFormFilterH.controls['G024_IDG024'].value.length != 0){
    // 	this.objFormFilter.controls['G024_IDG024'].setValue({in:this.objFormFilterH.controls['G024_IDG024'].value});
    // }else{
    //   this.objFormFilter.controls['G024_IDG024'].setValue(null);
    // }




    console.log("objFormFilter :: ", this.objFormFilter.value)
    this.grid.findDataTable('relatorioPerformanceGrid', 'objFormFilter');

  }

  limparHome(){
    this.objFormFilterH.reset();
    this.objFormFilter.reset();
    this.arIdCte.length = 0;
    this.arIdNfe.length = 0;
  }

  formataCnpj(value){
    let retorno = null;
    if(value.length < 18){
      retorno = value;
      this.toastr.warning('CNPJ Inválido', 'Alerta');

    }else{
      let result = value.split('/');
      result[0] = result[0].split('.');
      result[1] = result[1].split('-');
      retorno = result[0][0]+result[0][1]+result[0][2]+result[1][0]+result[1][1];
      return retorno;
    }
  }

}
