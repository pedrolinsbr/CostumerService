import { Component, OnInit, ViewChild, TemplateRef, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { GlobalsServices } from '../../../app/services/globals.services';
import { AdminLayoutService } from '../../services/admin-layout.service';

@Component({
	selector: 'app-backlog',
	templateUrl: './backlog.component.html',
	styleUrls: ['./backlog.component.css']
})
export class BacklogComponent implements OnInit, DoCheck {
	global = new GlobalsServices();
// - Formgroup que representa o filtro da Datagrid inicial da Sac/Backlog
	objFormFilterTransporte: FormGroup;
	// - Formgroup que representa o filtro da Datagrid inicial da Sac/Backlog
	objFormFilterNfe: FormGroup;
	// - Formgroup para representar a criação de um atendimento
	objFormNewAtendimento: FormGroup;

	// - Formgroup que representa o filtro da Datagrid inicial da Sac/Backlog
	objFormFilter : FormGroup;
	objFormFilterH: FormGroup;

	// ##### ARRAYS // OBJECTS
	arIdCte = [];
	arIdNfe =[];

	objStyle             = {
		'background' : '#43295b',
		'color'      : '#ffffff',
		'iconColor'  : '#ffffff',
		'iconOpacity': '0.5'
	  };

	objAux = {
		IdCte: 			{in:[]},
		idNfe: 			{in:[]},
		G043_IDG005RE:	[],
		G043_IDG005DE: 	[],
		G051_IDG005CO: 	[],
		dataInicioAux:  [],
		dataFimAux:		[]
	};

	selected = true;
	auxGoTransporte = false;


	buscouNotaFiscal: boolean;

	// - Utilitário para componente de datepicker
	data             = new Date();
	dataMinima       = [{year: '', month: '', day: ''}];
	dataMaxima       = [{year: '', month: '', day: ''}];
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
	dataInicio       : any;
	horas            = [];
	busca            = '';
	mesSelecionado   = '';
	anoSelecionado   = '';
	diaDaSemana      : any;
	dataClicou       = [];
	diaSelecionado;
	DTinici: any;
	DTfinal: any;


	// - Atendimento Selecionado pela Datagrid inicial.
	IDA001_selected: number;

	// - Utilitário para funcionar o Breadcrumbs
	@ViewChild('breadcrumbs') breadcrumbs;

	// - Controlador de Filtro Avançado ou Simplificado
	advancedFilter: boolean = true;

	// - Valor responsável por informar em qual breadcrumbs nós estamos
	exibir = 1;
	// - Array que armazena os passos do Breadcrumbs
	arBreadcrumbsLocal = [];
	url = this.global.getApiHost();
	constructor(
		private formBuilder: FormBuilder,
		private grid : DatagridComponent,
		private adminLayoutService: AdminLayoutService) {

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterTransporte = formBuilder.group({
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
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormNewAtendimento = formBuilder.group({
			NF: []
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterNfe = formBuilder.group({
			NF: []
		});


		// - Filtro da Datagrid Inicial da Home
		this.objFormFilter = formBuilder.group({
			NF    			: [],
			IDG043			: [],
			IDG051			: [],
			G046_IDG046  	: [],
			G043_IDG005RE	: [],
			G043_IDG005DE	: [],
			G043_IDG024TR	: [],
			G043_IDG043  	: [],
			G043_NRNOTA		: {},
			G051_IDG051  	: [],
			G051_CDCTRC		: [],
			DESTINATARIO 	: [],
			A001_DTREGIST	: [],
			A008_IDA008  	: [],
			G051_TPTRANSP	: [],
			A006_DSSITUAC	: [],
			G051_IDG005CO	: []
		});

		this.objFormFilterH = formBuilder.group({
			DTI				: [],
			DTF				: [],
			A008_IDA008		: [],
			G043_IDG005RE	: [],
			G043_IDG005DE	: [],
			G051_IDG005CO	: []
		});
	}

	ngOnInit() {
		this.objFormFilter.controls['A008_IDA008'].setValue(2);
		this.objFormFilter.controls['A006_DSSITUAC'].setValue({in: ['Aberto','Encaminhado']});
	}

	ngDoCheck(){
		if(this.adminLayoutService.exibir == true){
			this.exibir = 1;
			this.arBreadcrumbsLocal = [];
			this.adminLayoutService.exibir = false;
			/*this.selected = false;
			this.auxGoTransporte = true;
			if(this.objAux.dataInicioAux[0] != null){
				this.DTinici = this.objAux.dataInicioAux;
			}else{
				this.DTinici = null;
			}
			if(this.objAux.dataFimAux[0] != null){
				this.DTfinal = this.objAux.dataFimAux;
			}else{
				this.DTfinal = null;
			}*/
		}
	}

	dataClick(event){
		let dia = event.year + '-' + event.month + '-' + event.day;
		this.diaSelecionado = new Date(dia);
		this.dataClicou = event;
		this.anoSelecionado = event.year;
	}

	// - Função que seta novos passos no breadcrumbs
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

	// - Função que volta para a primeira posição do Breadcrumbs
	goHome(event){
		this.cancelarCadastro();
		this.selected = false;
		this.auxGoTransporte = true;
		if(this.objAux.dataInicioAux[0] != null){
			this.DTinici = this.objAux.dataInicioAux;
		}else{
			this.DTinici = null;
		}
		if(this.objAux.dataFimAux[0] != null){
			this.DTfinal = this.objAux.dataFimAux;
		}else{
			this.DTfinal = null;
		}
	}

	// - Função que volta para o primeiro indice do Breadcrumbs
	cancelarCadastro() {
		this.objFormNewAtendimento.reset()
		this.arBreadcrumbsLocal = [];
		this.exibir = 1;

		this.selected = false;
		this.auxGoTransporte = true;
		if(this.objAux.dataInicioAux[0] != null){
			this.DTinici = this.objAux.dataInicioAux;
		}else{
			this.DTinici = null;
		}
		if(this.objAux.dataFimAux[0] != null){
			this.DTfinal = this.objAux.dataFimAux;
		}else{
			this.DTfinal = null;
		}

		return false;
	}

	// - Limpar novos passos do breadcrumbs
	clearNext(item){
		let ar = [];
		for(let itemFor of this.arBreadcrumbsLocal){
			ar.push(itemFor);
			if(item.id == itemFor.id){
				break;
			}
		}
		this.arBreadcrumbsLocal = ar
	}

	// - Função para abrir atendimento
	criarAtendimento() : void {
		this.set(1,"Novo Atendimento", "criarAtendimento", '', "fa fa-plus-square");
		this.exibir = 2;
	}


	movimentarAtendimento(IDA001) : void {
		this.IDA001_selected = IDA001;
		this.set(2,'Detalhes do Atendimento', 'movimentarAtendimento', '', 'fa fa-file-alt');
		this.exibir = 2;
	}

	backToAtendimento() : void {
		this.breadcrumbs.goBack();
		this.exibir = 1;

		this.selected = false;
		this.auxGoTransporte = true;
		if(this.objAux.dataInicioAux[0] != null){
			this.DTinici = this.objAux.dataInicioAux;
		}else{
			this.DTinici = null;
		}
		if(this.objAux.dataFimAux[0] != null){
			this.DTfinal = this.objAux.dataFimAux;
		}else{
			this.DTfinal = null;
		}
	}

	buscarNotaFiscal() : void {
		this.buscouNotaFiscal = true;
	}

	filtrar(){
		this.objAux.idNfe = {in:[]};
		this.objAux.IdCte = {in:[]};
		this.objAux.G051_IDG005CO = [];
		this.objAux.G043_IDG005DE = [];
		this.objAux.G043_IDG005RE = [];

		if(this.objFormFilterH.controls['DTI'].value && this.objFormFilterH.controls['DTF'].value){
			this.objFormFilter.controls[ 'A001_DTREGIST' ].setValue([this.dataC(this.objFormFilterH.controls['DTI'].value),this.dataC(this.objFormFilterH.controls['DTF'].value)]);
		}else{
			this.objFormFilter.controls[ 'A001_DTREGIST' ].setValue(null);
		}

		this.objAux.dataInicioAux[0] = this.objFormFilterH.controls['DTI'].value;
		this.objAux.dataFimAux[0] = this.objFormFilterH.controls['DTF'].value;

		if(this.objFormFilterH.controls['G043_IDG005RE'].value &&  this.objFormFilterH.controls['G043_IDG005RE'].value.length != 0){
			this.objAux.G043_IDG005RE = this.objFormFilterH.controls['G043_IDG005RE'].value;
			this.objFormFilter.controls['G043_IDG005RE'].setValue({in:this.objFormFilterH.controls['G043_IDG005RE'].value});
		}else{
			this.objAux.G043_IDG005RE = null;
		}

		if(this.objFormFilterH.controls['G043_IDG005DE'].value && this.objFormFilterH.controls['G043_IDG005DE'].value.length != 0){
			this.objAux.G043_IDG005DE = this.objFormFilterH.controls['G043_IDG005DE'].value;
			this.objFormFilter.controls['G043_IDG005DE'].setValue({in:this.objFormFilterH.controls['G043_IDG005DE'].value});
		}else{
			this.objAux.G043_IDG005DE = null;
		}

		if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			  this.objAux.idNfe.in.push(i.name)
			}
			this.objFormFilter.controls['G043_NRNOTA'].setValue(this.objAux.idNfe);
		  }else{
			this.objFormFilter.controls['G043_NRNOTA'].setValue(null);
		  }

		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			  this.objAux.IdCte.in.push(i.name)
			}
			this.objFormFilter.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
		}else{
			this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
		}

		if(this.objFormFilterH.controls['G051_IDG005CO'].value && this.objFormFilterH.controls['G051_IDG005CO'].value.length != 0){
			this.objAux.G051_IDG005CO = this.objFormFilterH.controls['G051_IDG005CO'].value;
			this.objFormFilter.controls['G051_IDG005CO'].setValue({in:this.objFormFilterH.controls['G051_IDG005CO'].value});
		}else{
			this.objFormFilter.controls['G051_IDG005CO'].setValue(null);
			this.objAux.G051_IDG005CO = null;
		}
		 this.find('gridAtendCriadosTransp');
	}

	limpar(){
		this.objFormFilter.reset();
		this.objFormFilterH.reset();
		this.arIdNfe.length = 0;
		this.arIdCte.length = 0;
		this.objFormFilter.controls['A008_IDA008'].setValue(2);
		this.objFormFilter.controls['A006_DSSITUAC'].setValue("Aberto");
		this.objFormFilter.controls['G051_TPTRANSP'].setValue("");
	}

	find(id){ //ATUALIZAR DATA GRID
		this.grid.findDataTable(id);
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
}
