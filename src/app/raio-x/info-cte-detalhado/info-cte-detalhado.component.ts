import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';

import { FormsModule, FormBuilder, FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';

// - Services da Aplicação
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices } from '../../shared/componentesbravo/src/app/services/globals.services';

import { ConhecimentoService } from '../../shared/componentesbravo/src/app/services/crud/conhecimento.service';



import { DragulaService  } from 'ng2-dragula';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import * as mapboxgl from "mapbox-gl";
import * as MapboxDraw from 'mapbox-gl-draw';


import * as $ from 'jquery';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';


@Component({
	selector: 'info-cte-detalhado',
	templateUrl: './info-cte-detalhado.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./info-cte-detalhado.component.css']
})


export class InfoCteDetalhadoComponent implements OnInit {

	private global = new GlobalsServices();
	url = this.global.getApiHost();
	@ViewChild('breadcrumbs') breadcrumbs;

	// - Váriaveis recebidas pelo Componente
	// -------------------------------------
	@Input() IDG051: any = ''; // - Carga Selecionada
	@Input() IDG043: any = ''; // - Nota Selecionada
	@Input() showCarga: any = ''; // - Controller Paradas
	@Input() showParadas: any = ''; // - Controller Paradas
	@Input() showCTE: any = ''; // - Controller CTE
	@Input() showNFE: any = ''; // - Controller NFE
	@Input() showNFE_AUX: any = ''; // - Controller NFE
	@Input() showAtendimentos: any = ''; // - Controller Atendimento
	@Input() mostrarMapa: any = false;

	public isLoading: boolean = true;
	public isSearched: boolean = false;
	public errorFound: boolean = false;

	cargaObj: any;//InfoCarga;
	arrRestricoes = [];
	objConhecimento: any = {};//C.T.R.C;
	// objConhecimento: any;//C.T.R.C;
	// objConhecimento: any;//C.T.R.C
	arBreadcrumbsLocal = [];


	goHome(event = null){ //IR PARA TELA INICIAL
		// this.arBreadcrumbsLocal = [];
		this.controlViews = 1;
	  }

	set(id, name, functionName,parameter, icon){
		let valid = true;
		let data = {
			id: id,
			name: name,
			function: functionName,
			parameter: parameter,
			icon: icon
		}

		for(let item of this.arBreadcrumbsLocal){
			if(item.id == data.id || item.name == name){
				valid = false;
			}
		}

		if(valid){
			this.arBreadcrumbsLocal.push(data);
		}
	}
	
	objbreadcrumbs = {}
	showGrid = false;
	viewConhecimento(obj) {
		this.showGrid       = false
		this.objbreadcrumbs = obj;
		this.IDG043 = obj.IDG043;
		this.idConhecimentoView = obj.IDG043;
		this.set(obj.IDG043,obj.IDG043,"viewConhecimento",obj,null);
		this.controlViews = 2;
		console.log('codigo',obj);
		setTimeout(() => {
			this.showGrid = true;
		}, 1000);
	  }

	controlViews = 1;



	constructor(
		public formBuilder: FormBuilder,
		public toastr: ToastrService,
		public utilServices: UtilServices,
		public ConhecimentoService: ConhecimentoService,
		public grid:DatagridComponent
	) {

	}



	apiUrl              = localStorage.getItem('URL_API');
	idDataGrid          = "dePara";
	urlCargaGrid        = this.apiUrl+'tp/conhecimento/listar';
	urlMovimentoGrid    = this.apiUrl+'tp/conhecimento/listarInfMovimento';
	urlProdutoGrid      = this.apiUrl+'tp/conhecimento/listarInfProdutos';
	urlNotasGrid        = this.apiUrl+'tp/conhecimento/listarInfNotas';
	idCargaView = 0;
	idConhecimentoView = 0;

	showAll = false;

	ngOnInit() {

		console.log('Chegou isso aqui:: ', this.IDG051)


if (this.IDG051 != '' && this.IDG051 != null) { // Check if empty value
	
	this.utilServices.loadGridShow();
	this.ConhecimentoService.getInfoConhecimento({IDG051:this.IDG051, IDG043:this.IDG043}).subscribe(
		data => {
			
			if(data.data.length > 0){
				this.objConhecimento=data.data[0];
				this.showAll = true;
			}
			console.log('Objeto:',this.objConhecimento);
				
			this.utilServices.loadGridHide();
		},
		err => {
			this.errorFound = true; // - Controller Error.
			this.utilServices.loadGridHide();
		}
	);
} else {
	this.errorFound = true; // - Controller Error.
}


	}
	

}
