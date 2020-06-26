//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { ConhecimentoTransporte } from '../../models/conhecimento-transporte.model';
import { AtendimentosService } from '../../services/crud/atendimentos.service';


@Component({
	selector: 'app-report-nps',
	templateUrl: './report-nps.component.html',
	styleUrls: ['./report-nps.component.scss']
})

export class ReportNpsComponent implements OnInit {
	private global = new GlobalsServices();
	url            = this.global.getApiHost();

	@ViewChild('modalCteCompleta'  ) private modalCteCompleta;
	@ViewChild('modalAlteraNota'   ) private modalAlteraNota;
	@ViewChild('modalStEmailSatisf') private modalStEmailSatisf;

	// ##### ARRAYS // OBJECTS
	arIdCte = [];

	objStyle = {
		'background': '#43295b',
		'color': '#ffffff',
		'iconColor': '#ffffff',
		'iconOpacity': '0.5'
	};
	objAux = { IdCte: { in: [] } };

	// ###### CONTROL NGX-CHARTS ######
	colorSchemeEstado = { domain: ['#11A8AB'] };
  colorScheme1 = { domain: ['#11AB3C', '#FCB150','#E64C65'] };
  schemeType = 'ordinal';

	arNpsAnalytics = [
    { name: 'Promotores', value: 0 },
		{ name: 'Neutros', value: 0 },
		{ name: 'Detratores', value: 0 }
	];

	dataNps;
	dataNpsFilial;

	npsPorFilial = []
  // ###### ##### ######

	//##### FORMS
	objFormFilter    : FormGroup;
	objFormFilterH   : FormGroup;
	objEnvioResposta: FormGroup;
	objFormAlteraNota: FormGroup;

	//###### DATAS
	data             = new Date();
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}]
	mesSelecionado   = '';
	anoSelecionado   = '';
	dataClicou       = [];

	diaSelecionado;

	IDG043_selecionada: number;
	IDG051_selecionada: number;
	IDG061_selecionada: number;
	NMTRANSP_selecionada: any;

	objParam;

	objComent={
		DSCOMENT: null,
		NRNOTA: null
	};

	validAvalid;

	controlExibir = 1;
	controlExibirTela = 1;

	idCliente: any;

	objCTE: ConhecimentoTransporte;

	public loading = false;
	public loadingModal = false;

	searched = false;
	dashLoad = false;

	listaStEmailSatisf = [];

	constructor(
		private formBuilder : FormBuilder,
		private grid        : DatagridComponent,
		private toastr      : ToastrService,
		private utilServices: UtilServices,
		private modal : ModalComponent,
		private deliveryNfService: DeliverysNfService,
		private atendimentosService: AtendimentosService
	) {
		this.objFormFilter = formBuilder.group({
			G061_DTAVALIA	:	[],
			G005_IDG005		: [],
			G051_CDCTRC		:	[],
			G002_IDG002		:	[],
			G005_TPPESSOA	:	[],
			G051_DTEMICTR	:	[],
			G061_CLASS		:	[],
			G061_STAVALIA	:	[],
			TPOPERAC			:	[],
			STNPS					:	[],
			G022_SNSATISF	:	[],
			G008_TPCONTAT	:	[],
			QTDCONTAT			: [],
			SNNPSCON			:	[]
		});

		this.objEnvioResposta = formBuilder.group({
			DSAVALID: [],
			STAVALIA:	[]
		});


		this.objFormFilterH = formBuilder.group({
			DTINICIO    : [],
			DTFIM       : [],
			G005_IDG005	: [],
			DTEMICTR0		: [],
			DTEMICTR1		: [],
			SNNPSCON		:	[]
		});

		this.objFormAlteraNota = formBuilder.group({
			NRNOTA_ALTER: [],
			OBSERV: [],
			NRNOTA:	[]
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


	filtrarHome(): void {
		this.controlExibirTela = this.controlExibirTela == 2 ? 1 : this.controlExibirTela;

		this.searched = true;
		this.dashLoad = true;

		this.objAux.IdCte = { in: [] };

		if (this.arIdCte.length > 0) {
			for (let i of this.arIdCte) {
				this.objAux.IdCte.in.push(i.name);
			}
			this.objFormFilter.controls['G051_CDCTRC'].setValue(this.objAux.IdCte);
		} else {
			this.objFormFilter.controls['G051_CDCTRC'].setValue(null);
		}

		// - Id Cliente
		if(this.objFormFilterH.controls['G005_IDG005'].value &&  this.objFormFilterH.controls['G005_IDG005'].value.length != 0){
			this.objFormFilter.controls['G005_IDG005'].setValue({in:this.objFormFilterH.controls['G005_IDG005'].value});
		}else{
			this.objFormFilter.controls['G005_IDG005'].setValue(null);
		}

		if((this.objFormFilterH.controls['DTFIM'].value != null) && (this.objFormFilterH.controls['DTINICIO'].value !=null)){
			this.objFormFilter.controls['G061_DTAVALIA'].setValue(
				[
					this.dataC(this.objFormFilterH.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterH.controls['DTFIM'].value)
				]
			);
		}else{
			this.objFormFilter.controls['G061_DTAVALIA'].setValue(null);
		}

		if((this.objFormFilterH.controls['DTEMICTR0'].value != null) && (this.objFormFilterH.controls['DTEMICTR1'].value !=null)){
			this.objFormFilter.controls['G051_DTEMICTR'].setValue(
				[
					this.dataC(this.objFormFilterH.controls['DTEMICTR0'].value),
					this.dataC(this.objFormFilterH.controls['DTEMICTR1'].value)
				]
			);
		}else{
			this.objFormFilter.controls['G051_DTEMICTR'].setValue(null);
		}

		if (this.objFormFilter.controls['QTDCONTAT'    ].value &&
			 (this.objFormFilter.controls['G008_TPCONTAT'].value == null ||
				this.objFormFilter.controls['G008_TPCONTAT'].value == '')) {
			this.toastr.warning('É necessário especificar o Tipo de Contato!', 'ATENÇÃO:');
		}
		else if ((this.objFormFilter.controls['G008_TPCONTAT'].value &&
						 (this.objFormFilter.controls['QTDCONTAT'].value == null ||
							this.objFormFilter.controls['QTDCONTAT'].value == ''))) {
			this.toastr.warning('É necessário informar a Quantidade de Contato!', 'ATENÇÃO:');
		}
		else {
			this.grid.findDataTable('relatorioGrid'       , 'objFormFilter');
			this.grid.findDataTable('relatorioGridCliente', 'objFormFilter');
			this.filtrarDashboards();
		}

		
	}


	filtrarDashboards() {
		this.atendimentosService.getDashboardsNps(this.objFormFilter.value).subscribe(
			data => {
				console.log(data);
				this.dashLoad = false;
				this.dataNps = data;
				if (this.dataNps.nps.data.length > 0) {
					this.arNpsAnalytics[0].value = data.nps.promotoresPerc;
					this.arNpsAnalytics[1].value = data.nps.neutrosPerc;
					this.arNpsAnalytics[2].value = data.nps.detratoresPerc;
					this.npsPorFilial = data.npsFilial.valuesDashboard;
					this.npsPorFilial.sort((n1, n2) => n2.value - n1.value);
					this.dataNpsFilial = data.npsFilial.data;
					this.dataNpsFilial.sort((n1, n2) => n2.VALORNPS - n1.VALORNPS);
				}
				

			},
			err => {
				console.log(err);
				this.dashLoad = false;
				this.toastr.error('Erro ao buscar estatísticas. ');
			}
		);
	}

	limparHome(){
		this.objFormFilterH.reset();
		this.objFormFilter.reset();
		//this.grid.findDataTable('relatorioGrid', 'objFormFilter');
	}

	visualizarCTeNps(IDG051): void {
		let objNotas = IDG051;

		this.IDG043_selecionada = objNotas.IDG043;
		this.IDG051_selecionada = objNotas.IDG051;
		this.IDG061_selecionada = objNotas.IDG061;
		this.NMTRANSP_selecionada = objNotas.G024_NMTRANSP;

		 let controllerView =
		 {
		 	'IDG043'	:	this.IDG043_selecionada,
		 	'IDG051'	:	this.IDG051_selecionada,
		 	'NFE'		:	false,
		 	'IT_NFE'	:	false,
		 	'CTE'		:	true,
		 	'NT_CTE'	:	true,
		 	'CARGA'		:	false,
		 	'RASTREIO'	:	false,
		 	'TRACKING'	:	false,
		 	'EMAIL'		:	false
		 }

		 this.loadInformacoesNotaFiscal(controllerView);
	}

	loadInformacoesNotaFiscal(objReq): void {
		this.loading = true;
		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
			data => {
				this.objCTE = data.CTE;
				this.deliveryNfService.getComentario({IDG061: this.IDG061_selecionada}).subscribe(
					data1 => {
						if (data1 && data1.length > 0) {
							this.validAvalid = data1[0].DSAVALID
							this.objComent.DSCOMENT = data1[0].DSCOMENT;
							this.objComent.NRNOTA = data1[0].NRNOTA;
							this.objEnvioResposta.controls['DSAVALID'].setValue(data1[0].DSAVALID);
							this.loading = false;
							this.showModalCteCompleta();
						} else {
							this.loading = false;
							this.toastr.warning('Esse CTe não possui uma avaliação.');
						}

					},
					err => {
						this.loading = false;
						this.toastr.error('Erro ao buscar informações. ');
					}
				);
			},
			err => {
				this.loading = false;
				this.toastr.error('Erro ao buscar informações. ');
			}
		);


	}

	closeModalCteCompleta() {
		this.modal.closeModal();
	}

	showModalCteCompleta() : void {
		this.modal.open(this.modalCteCompleta, { size: 'lg' });
	}

	salvarResposta(){
		this.loadingModal = true;
		this.objParam = {
			IDG061: this.IDG061_selecionada,
			DSAVALID: this.objEnvioResposta.controls['DSAVALID'].value != '' && this.objEnvioResposta.controls['DSAVALID'].value != null ? this.objEnvioResposta.controls['DSAVALID'].value : null,
			STAVALIA: this.objEnvioResposta.controls['STAVALIA'].value
		}
		this.deliveryNfService.salvarResposta(this.objParam).subscribe(
			data => {
				this.toastr.success('Resposta salva com sucesso! ');
				this.closeModalCteCompleta();
				this.loadingModal = false;
				this.filtrarHome();
			},

			err => {
				this.loadingModal = false;
				this.toastr.error('Erro ao salvar resposta! ');
			}

		);
	}

	alteraNota(IDG061) {
		this.modal.open(this.modalAlteraNota, { size: 'lg' });
		let obj = JSON.parse(IDG061);
		this.objFormAlteraNota.controls['NRNOTA'].setValue(obj.G061_NRNOTA);
		this.IDG061_selecionada = obj.IDG061;
	}

	salvarAlterarNota() {
		if (this.objFormAlteraNota.controls['NRNOTA_ALTER'].value == null || this.objFormAlteraNota.controls['NRNOTA_ALTER'].value == '') {
			this.toastr.warning('O campo Nota Altera é obrigatório');
		} else if (this.objFormAlteraNota.controls['OBSERV'].value == null || this.objFormAlteraNota.controls['OBSERV'].value == '') {
			this.toastr.warning('O campo Observação é obrigatório');
		} else {
			this.utilServices.loadGridShow();
			let objParam = {
				IDG061: this.IDG061_selecionada,
				DSAVALID: this.objFormAlteraNota.controls['OBSERV'].value,
				NRNOTA: this.objFormAlteraNota.controls['NRNOTA_ALTER'].value
			}

			this.deliveryNfService.salvarNotaAlterada(objParam).subscribe(
				data => {
					console.log(data);
					this.toastr.success('Nota alterada com sucesso');
					this.utilServices.loadGridHide();
					this.modal.closeModal();
					this.grid.findDataTable('relatorioGrid'       , 'objFormFilter');
					this.grid.findDataTable('relatorioGridCliente', 'objFormFilter');
				},
				err => {
					console.log(err);
					this.toastr.error('Erro ao alterar a nota');
					this.utilServices.loadGridHide();
				}
			)
		}
	}

	changeStatus(status) {
		if (status != this.objEnvioResposta.controls['STAVALIA'].value) {
			this.objEnvioResposta.controls['STAVALIA'].setValue(status);
		} else {
			this.objEnvioResposta.controls['STAVALIA'].setValue(null);
		}
	}

	visualizarStEmailSatisf(cliente) {
		cliente = JSON.parse(cliente);
		this.utilServices.loadGridShow();

		this.atendimentosService.listaStEmail({ IDG005: cliente.IDG005 }).subscribe(
			data => {
				this.toastr.success('Lista de status de E-mail carregada com sucesso!', 'SUCESSO:');
				this.utilServices.loadGridHide();
				this.listaStEmailSatisf = data;

				this.modal.open(this.modalStEmailSatisf, { size: 'lg' });
			},
			err => {
				this.toastr.error('Falha ao buscar lista de status de E-mail!', 'ERRO:');
				this.utilServices.loadGridHide();
				console.error(err);
			}
		)
	}

	visualizarContatos(cliente) {
		cliente = JSON.parse(cliente);
		this.idCliente = cliente.IDG005;
		this.controlExibir = 2;
	}

	voltarTela(event) {
		if (event) this.controlExibir = 1;
	}

	changeOption(opc) {

		if (!this.searched && opc == 2) {
			this.toastr.warning('Você deve realizar uma filtragem antes de selecionar essa opção.');
			return false;
		}
		if (opc == 2 && this.searched && this.dashLoad && (this.objFormFilter.controls['STNPS'].value == 'NR' || this.objFormFilter.controls['STNPS'].value == 'NE')) {
			this.toastr.warning('A visão de Dashboard é apenas para NPS respondido.');
			return false;
		}
		if (this.dashLoad && opc == 2) {
			this.toastr.info('Aguarde o carregamento dos gráficos.');
			return false;
		}
		if (!this.dashLoad && opc == 2 && this.searched && this.dataNps.nps.data.length == 0) {
			this.toastr.warning('Não foram econtrados resultados na pesquisa.');
			return false;
		}

		this.controlExibirTela = opc;
  }

}
