//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';


@Component({
  selector: 'app-atendimentos',
  templateUrl: './atendimentos.component.html',
  styleUrls: ['./atendimentos.component.scss']
})

export class AtendimentosComponent implements OnInit {
	 global = new GlobalsServices();
	url            = this.global.getApiHost();

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
	private utilServices: UtilServices) {
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
			A001_IDSOLIDO:	 [],
			//filtros que valem
			G043_DTEMINOT : [],
			G043_NRNOTA   : [],
			G051_IDG051   : [],
			G051_CDCTRC	  :	[],
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
			G051_IDG024   : [],
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

			G051_TPTRANSP : [],

			//Data Agendada
			G051_DTAGENDA:	[],

			//Data Prevista
			DTPREENT: [],

			A006_DSSITUAC	: []
		});


		this.objFormFilterH = formBuilder.group({
			DTINICIO    : [],
			DTFIM       : [],
			G043_NRNOTA : [],
			G043_IDG005DE : [],
			G024_IDG024   : [],
			G046_CDVIAOTI   : [],

			//ID's
			G051_IDG005RE :	[],
			G051_IDG005DE :	[],
			G051_IDG005RC :	[],
			G051_IDG005EX :	[],
			G051_IDG005CO :	[],
			G051_IDG024   : [],

			//ID's CIDADES
			G005RE_IDG003 : [],
			G005DE_IDG003 : [],
			G005CO_IDG003 : [],
			G005RC_IDG003 : [],
			G005EX_IDG003 : [],

			//Data Agendada
			G051_DTAGENDA:	[],

			//Data Prevista
			DTPREENT: []
		});
	}

	ngOnInit() {
		this.objFormFilter.controls['G043_DTEMINOT'].setValue(
			[
			this.dataC(this.dtInicioDefault[0]),
			this.dataC(this.dtTerminoDefault[0])
			]
		);

		this.objFormFilter.controls['A006_DSSITUAC'].setValue("Aberto");
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

	dataFormat(event) {

		const objStringMonth = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	
		let thiscontext = '';
		if(event.day < 10){
		  thiscontext = "0"+event.day;
		}else{
		  thiscontext = event.day;
		}
		thiscontext += "/"+objStringMonth[event.month-1];
	
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
		} else {
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
		} else {
			this.objFormFilter.controls['G051_IDG005RC'].setValue(null);
		}

		// ID EXPEDIDOR
		if(this.objFormFilterH.controls['G051_IDG005EX'].value &&  this.objFormFilterH.controls['G051_IDG005EX'].value.length != 0){
			this.objFormFilter.controls['G051_IDG005EX'].setValue({in:this.objFormFilterH.controls['G051_IDG005EX'].value});
		} else {
			this.objFormFilter.controls['G051_IDG005EX'].setValue(null);
		}

		// ID Transportadora
		if(this.objFormFilterH.controls['G051_IDG024'].value &&  this.objFormFilterH.controls['G051_IDG024'].value.length != 0){
			this.objFormFilter.controls['G051_IDG024'].setValue({in:this.objFormFilterH.controls['G051_IDG024'].value});
		}else{
			this.objFormFilter.controls['G051_IDG024'].setValue(null);
		}

		// ID NOTA FISCAL
		if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			  this.idNfe.in.push(i.name)
			}
			this.objFormFilter.controls['G043_NRNOTA'].setValue(this.idNfe);
		  }else{
			this.objFormFilter.controls['G043_NRNOTA'].setValue(null);
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
			this.objFormFilter.controls['G043_DTEMINOT'].setValue(
			[
				this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
				this.dataC(this.objFormFilterH.controls['DTFIM'].value)
			]
		);
		}else{
			this.objFormFilter.controls['G043_DTEMINOT'].setValue(null);
		}

		//DATA AGENDADA
		if(this.objFormFilterH.controls['G051_DTAGENDA'].value != null){
			this.objFormFilter.controls['G051_DTAGENDA'].setValue(this.dataFormat(this.objFormFilterH.controls['G051_DTAGENDA'].value));
		}else{
			this.objFormFilterH.controls['G051_DTAGENDA'].setValue(null);
		}

		//DATA PREVISTA
		if(this.objFormFilterH.controls['DTPREENT'].value != null){
			this.objFormFilter.controls['DTPREENT'].setValue(this.dataC(this.objFormFilterH.controls['DTPREENT'].value));
		}else{
			this.objFormFilterH.controls['DTPREENT'].setValue(null);
		}

		this.grid.findDataTable('relatorioAtendGrid', 'objFormFilter');
	}

	limparHome(){
		this.objFormFilterH.reset();
		this.objFormFilter.reset();
		this.arIdNfe.length = 0;
		this.arIdCte.length = 0;
		this.objFormFilter.controls['A006_DSSITUAC'].setValue("Aberto");
	}

	formataCnpj(value){
		let retorno = null;
		if (value.length < 18) {
			retorno = value;
			this.toastr.warning('CNPJ Inválido', 'Alerta');
		} else {
			let result = value.split('/');
			result[0] = result[0].split('.');
			result[1] = result[1].split('-');
			retorno = result[0][0]+result[0][1]+result[0][2]+result[1][0]+result[1][1];
			return retorno;
		}
	}

}
