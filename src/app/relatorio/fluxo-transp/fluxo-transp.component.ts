//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-fluxo-transp',
  templateUrl: './fluxo-transp.component.html',
  styleUrls: ['./fluxo-transp.component.scss']
})

export class FluxoTranspComponent implements OnInit {
  private global = new GlobalsServices();
  url            = this.global.getApiHost();

  // ##### ARRAYS // OBJECTS
	arIdCte = [];
  arIdNfe = [];
  
  objAux = {
		IdCte: { in: [] },
		idNfe: { in: [] }
	};


	objStyle             = {
		'background' : '#43295b',
		'color'      : '#ffffff',
		'iconColor'  : '#ffffff',
		'iconOpacity': '0.5'
	  };

  //##### FORMS
  objFormFilter    : FormGroup;
  objFormFilterAux: FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private grid        : DatagridComponent,
    private toastr      : ToastrService,
    private utilServices: UtilServices
  ) {

    this.objFormFilter = formBuilder.group({
      G043_NRNOTA : [],
      G051_CDCTRC : [],
      G051_DTEMICTR: [],
      G014_IDG014: [],
      G051_IDG005CO: []
    });

    this.objFormFilterAux = formBuilder.group({
			DTINICIO  : [],
      DTFIM: [],
      G051_IDG005CO: []
		});
  }

  ngOnInit() {
    this.objFormFilter.controls['G051_DTEMICTR'].setValue(
			[
				this.dataC(this.dtInicioDefault[0]),
				this.dataC(this.dtTerminoDefault[0])
			]
    );
  }


  data = new Date();
	dataMinima = [{ year: '', month: '', day: '' }];
	dataMaxima = [{ year: '', month: '', day: '' }];
	dtInicioDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1 }];
	dtTerminoDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate() }]
	dataInicio: any;
	horas = [];
	busca = '';
	mesSelecionado = '';
	anoSelecionado = '';
	diaDaSemana: any;
	dataClicou = [];
	diaSelecionado;


  dataC(event) {
		let thiscontext = '';
		if (event.day < 10) {
			thiscontext = "0" + event.day;
		} else {
			thiscontext = event.day;
		}
		if (event.month < 10) {
			thiscontext += "/0" + event.month;
		} else {
			thiscontext += "/" + event.month;
		}
		thiscontext += "/" + event.year;
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
    
  dataClick(event) {
    if (event != null) {
      let dia = event.year + '-' + event.month + '-' + event.day;
      this.diaSelecionado = new Date(dia);
      this.dataClicou = event;
      this.anoSelecionado = event.year;
    }
  }
    


  idNfe = [];
  idCte = [];
  
  filtrar() {
    
    if ((this.objFormFilterAux.controls['DTINICIO'].value == null || this.objFormFilterAux.controls['DTINICIO'].value == undefined || this.objFormFilterAux.controls['DTINICIO'].value == "") ||
      (this.objFormFilterAux.controls['DTFIM'].value == null || this.objFormFilterAux.controls['DTFIM'].value == undefined || this.objFormFilterAux.controls['DTFIM'].value == "")) {
      this.toastr.warning("O filtro por faixa temporal é obrigatório.");
      return false;
    }


    this.objAux.IdCte = { in: [] };
		this.objAux.idNfe = { in: [] };

    if (this.arIdNfe.length > 0) {
      for (let i of this.arIdNfe) {
        this.objAux.idNfe.in.push(i.name)
      }
      this.objFormFilter.controls['G043_NRNOTA'].setValue(this.objAux.idNfe);
    } else {
      this.objFormFilter.controls['G043_NRNOTA'].setValue(null);
    }

    if (this.arIdCte.length > 0) {
      for (let i of this.arIdCte) {
        this.objAux.IdCte.in.push(i.name)
      }
      this.objFormFilter.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
    } else {
      this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
    }


    if((this.objFormFilterAux.controls['DTFIM'].value != null) && (this.objFormFilterAux.controls['DTINICIO'].value != null)){
			this.objFormFilter.controls['G051_DTEMICTR'].setValue(
				[
					this.dataC(this.objFormFilterAux.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterAux.controls['DTFIM'].value)
        ]
      )
		}else{
      this.objFormFilter.controls['G051_DTEMICTR'].setValue(null);
    }
    
    if (this.objFormFilterAux.controls['G051_IDG005CO'].value && this.objFormFilterAux.controls['G051_IDG005CO'].value.length != 0) {
      this.objFormFilter.controls['G051_IDG005CO'].setValue({ in: this.objFormFilterAux.controls['G051_IDG005CO'].value });
    } else {
      this.objFormFilter.controls['G051_IDG005CO'].setValue(null);
    }

    this.grid.findDataTable('fluxoTransportadora', 'objFormFilter');

  }

  limpar(){
    this.objFormFilter.reset();
    this.objFormFilterAux.reset();
    this.arIdCte.length = 0;
		this.arIdNfe.length = 0;
  }

}
