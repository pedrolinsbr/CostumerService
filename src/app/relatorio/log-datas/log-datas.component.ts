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
  selector: 'app-log-datas',
  templateUrl: './log-datas.component.html',
  styleUrls: ['./log-datas.component.scss']
})

export class LogDatasComponent implements OnInit {
  private global = new GlobalsServices();
  url            = this.global.getApiHost();

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

  dataNova = new Date();

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
      G051_DTAGENDA    : [],
      G051_DTCOMBIN    : [],
      DESTINATARIO: 	 [],

      //filtros que valem
      G043_NRNOTA   : [],
      G051_IDG051   : [],
      G051_CDCTRC	  :	[],
      G046_CDVIAOTI   : [],
      G051_IDG005RE :	[],
      G043_IDG005DE : [],
      G024_IDG024   : [],
      G005DE_CJCLIENTDE : [],
      A001_DTREGIST : [],
      G051_TPTRANSP : [],
      A001_IDSOLIDO : [],
      A001_IDA001   : []

    });


    this.objFormFilterH = formBuilder.group({
      DTINICIO    : [],
      G051_DTAGENDA    : [],
      G051_DTCOMBIN    : [],
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

      //ID's CIDADES
      G005RE_IDG003 : [],
      G005DE_IDG003 : [],
      G005CO_IDG003 : [],
      G005RC_IDG003 : [],
      G005EX_IDG003 : [],
      A001_IDSOLIDO : [],
      A001_IDA001   : []
    });
  }

  ngOnInit() {
    this.objFormFilter.controls['A001_DTREGIST'].setValue(
      [
        this.dataC(this.dtInicioDefault[0]),
        this.dataC(this.dtTerminoDefault[0])
      ]
    );
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

    // RANGE DATA EMISSÃO NF
    if((this.objFormFilterH.controls['DTFIM'].value != null) && (this.objFormFilterH.controls['DTINICIO'].value !=null)){
      this.objFormFilter.controls['A001_DTREGIST'].setValue(
        [
          this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
          this.dataC(this.objFormFilterH.controls['DTFIM'].value)
        ]
      );
    }else{
        this.objFormFilter.controls['A001_DTREGIST'].setValue(null);
    }

    if(this.objFormFilterH.controls['G051_DTAGENDA'].value != null){
      this.objFormFilter.controls['G051_DTAGENDA'].setValue(this.dataFormat(this.objFormFilterH.controls['G051_DTAGENDA'].value));
    }else{
      this.objFormFilterH.controls['G051_DTAGENDA'].setValue(null);
    }

    if(this.objFormFilterH.controls['G051_DTCOMBIN'].value != null){
      this.objFormFilter.controls['G051_DTCOMBIN'].setValue(this.dataFormat(this.objFormFilterH.controls['G051_DTCOMBIN'].value));
    }else{
      this.objFormFilter.controls['G051_DTCOMBIN'].setValue(null);
    }

    // ID's USUÁRIO
    if(this.objFormFilterH.controls['A001_IDSOLIDO'].value &&  this.objFormFilterH.controls['A001_IDSOLIDO'].value.length != 0){
      this.objFormFilter.controls['A001_IDSOLIDO'].setValue({in:this.objFormFilterH.controls['A001_IDSOLIDO'].value});
    }else{
      this.objFormFilter.controls['A001_IDSOLIDO'].setValue(null);
    }

    // ID's ATENDIMENTO
    if(this.objFormFilterH.controls['A001_IDA001'].value &&  this.objFormFilterH.controls['A001_IDA001'].value.length != 0){
      this.objFormFilter.controls['A001_IDA001'].setValue({in:this.objFormFilterH.controls['A001_IDA001'].value});
    }else{
      this.objFormFilter.controls['A001_IDA001'].setValue(null);
    }


    this.grid.findDataTable('relatorioDatas', 'objFormFilter');

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
