import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

// - Indicadores
import { IndicadorHome } from '../../models/indicador-home.model';

// - Services
import { GlobalsServices } from '../../services/globals.services';
import { DashboardService } from '../../services/crud/dashboard.service';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	private global = new GlobalsServices();
	url = this.global.getApiHost();

	// - Formgroup utilizado para enviar para api.
	objFormFilterTransporteDashboard: FormGroup;
	// - Formgroup auxiliar para o usuário preencher os campos.
	objFormFilterTransporteDashboardAux: FormGroup;

	public realizouFiltro: boolean = false;
	public noValueDiasAtraso: boolean = false;

	// - Objeto de Indicadores
	indicadores: IndicadorHome[] = [];

	// - Valor dos Indicadores
	vlQtdEntregAtiva: number = 0;    // Quantidade de Atendimentos em Aberto
	vlQtdEntregAtras: number = 0;    // Quantidade de Ocorrências em Aberto
	vlQtdEntregReali: number = 0;    // Quantidade de Entregas em Aberto
	vlTotalEntregas:  string = '0';  // Total de Entregas

	objEntregas = {};

	objDiasAtrazo = {};


	objDispVei = {};

	objFrotaDisp = {};

	// - Formgroup que representa o filtro da Datagrid inicial da home
	objFormFilterHome: FormGroup;

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

	public isLoading	: boolean = true;
	public isSearched	: boolean = false;
	public errorFound	: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private dashboardService	: DashboardService,
		private utilServices: UtilServices,
		private toastr: ToastrService
		) {
		// - Carrega os Indicadores na página
		// - Valor dos Indicadores
		this.indicadores.push(
			{ desc: 'Entregas Ativas', value: this.vlQtdEntregAtiva + '',  color:  'green', icon: 'icon-ecommerce-cart-content' },
			{ desc: 'Entregas Atrasadas',  value: this.vlQtdEntregAtras + '',  color:  'blue',  icon: 'icon-ecommerce-cart-download' },
			{ desc: 'Entregas Realizadas', 	value: this.vlQtdEntregReali + '', color:  'teal',  icon: 'icon-ecommerce-cart-upload' },
			{ desc: 'Total de Entregas', 	value: this.vlTotalEntregas  + '', color:  'red',   icon: 'icon-ecommerce-cart-plus' }
		);

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterTransporteDashboardAux = formBuilder.group({
			NF: [],
			G014_IDG014: [],
			DTINICIO: 		 [],
			DTFIM: 			 [],
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterTransporteDashboard = formBuilder.group({
			G014_IDG014:	 [],
			G043_DTEMINOT: 	 []
		});
	}

	dataClick(event){
		let dia = event.year + '-' + event.month + '-' + event.day;
		this.diaSelecionado = new Date(dia);
		this.dataClicou = event;
		this.anoSelecionado = event.year;
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

	// - Função para atualizar os valores do Indicador
	refreshIndicadores(): void {
		this.indicadores = [];
		this.indicadores.push(
			{ desc: 'Entregas Ativas', value: this.vlQtdEntregAtiva + '',  color:  'green', icon: 'icon-ecommerce-cart-content' },
			{ desc: 'Entregas Atrasadas',  value: this.vlQtdEntregAtras + '',  color:  'blue',  icon: 'icon-ecommerce-cart-download' },
			{ desc: 'Entregas Realizadas', 	value: this.vlQtdEntregReali + '', color:  'teal',  icon: 'icon-ecommerce-cart-upload' },
			{ desc: 'Total de Entregas', 	value: this.vlTotalEntregas  + '', color:  'red',   icon: 'icon-ecommerce-cart-plus' }
		);
	}

	// - Função que prepara o Formgroup para ser enviado ao server.
	prepareFilter(): void {
		// - Seto o G051_DTEMICTR
		if ((this.objFormFilterTransporteDashboardAux.controls['DTFIM'].value != null) && (this.objFormFilterTransporteDashboardAux.controls['DTINICIO'].value != null)) {
			this.objFormFilterTransporteDashboard.controls['G043_DTEMINOT'].setValue(
				[
					this.dataC(this.objFormFilterTransporteDashboardAux.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterTransporteDashboardAux.controls['DTFIM'].value)
				]
			);
		}
		// - Seto o G014_IDG014
		if (this.objFormFilterTransporteDashboardAux.controls['G014_IDG014'].value != null && this.objFormFilterTransporteDashboardAux.controls['G014_IDG014'].value instanceof Array) {
			if (this.objFormFilterTransporteDashboardAux.controls['G014_IDG014'].value.length > 0) {
				this.objFormFilterTransporteDashboard.controls['G014_IDG014'].setValue({in:this.objFormFilterTransporteDashboardAux.controls['G014_IDG014'].value})
			}
		}
	}

	limpar(){
		this.objFormFilterTransporteDashboard.reset();
		this.objFormFilterTransporteDashboardAux.reset();
	}

	preparaDashboardDiasEmAtraso(data): void {
		let arrayCores = ['rgb(26, 63, 112)', 'rgb(38, 99, 179)', 'rgb(17, 39, 69)', 'rgb(60, 136, 237)','rgb(38, 99, 179)', 'rgb(17, 39, 69)', 'rgb(60, 136, 237)'];
		if (data instanceof Array) {
			if (data.length > 0) {
				let valores = data.map(e => ({ value: e.QTDDIAS, name: e.NRDIAS +'d'}));
				let valoresLegend = data.map(e => (e.NRDIAS+ 'd'));
				this.objDiasAtrazo = {
					tooltip : {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						orient: 'horizontal',
						left: 'center',
						data: valoresLegend
					},
					series : [
						{
							name: 'Quantidade',
							type: 'pie',
							radius : '55%',
							center: ['50%', '60%'],
							data: valores,
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},
						}
					]
				}
			} else {
				this.noValueDiasAtraso = true;
			}
		}
	}

	preparaEntregasNoPrazoEIndicadores(data): void {
		this.vlQtdEntregAtiva = data.QTATIVO;
		this.vlQtdEntregAtras = data.QTENTATR;
		this.vlQtdEntregReali = data.QTENTPRA;
		this.vlTotalEntregas  = data.QTTOTAL;

		this.refreshIndicadores();
	}

	initCharts() {
		this.utilServices.loadGridShow(); // - Mostro o Loader
		this.prepareFilter(); // - Prepara o filtro para o back-end;

		// - Monto gráfico de Situação de Atendimento
		this.dashboardService.getDashboardIndicadores(this.objFormFilterTransporteDashboard.value).subscribe(
			data=>{
				// - Preparo o gráfico de Entregas no Prazo
				this.preparaEntregasNoPrazoEIndicadores(data);

				this.dashboardService.getDashboardDiasEmAtraso(this.objFormFilterTransporteDashboard.value).subscribe(
					data=>{
						this.preparaDashboardDiasEmAtraso(data);

						this.dashboardService.getDashboardEntregas(this.objFormFilterTransporteDashboard.value).subscribe(
							data=>{
								this.preparaDashboardEntregas(data);

								this.realizouFiltro = true;
								this.utilServices.loadGridHide();
							},err=>{
								this.errorFound = true;
								this.utilServices.loadGridHide();
								this.toastr.error('Não foi possível carregar o resultado.');
							}
						);
					},err=>{
						this.errorFound = true;
						this.utilServices.loadGridHide();
						this.toastr.error('Não foi possível carregar o resultado.');
					}
				);
			},err=>{
				this.errorFound = true;
				this.utilServices.loadGridHide();
				this.toastr.error('Não foi possível carregar o resultado.');
			}
		);
	}

	preparaDashboardEntregas(data):void {
		if (data instanceof Array) {
			if (data.length > 15) {
				data = data.splice(0,15);
			}

			let qtdEntregas = data.map(e => ({ value: e.QTENTREG,	itemStyle:{color: 'rgb(26, 63, 112)'}}));
			let datas = data.map(e => e.DTENTREG);

			this.objEntregas = {
				tooltip : {
					trigger: 'axis',
					axisPointer : {
						type : 'shadow'
					}
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis : [
					{
						type : 'category',
						data : datas,
						axisTick: {
							alignWithLabel: true
						},
            axisLabel: {
              interval: 0,
              rotate: 30
            }
					}
				],
				yAxis : [
					{
						type : 'value'
					}
				],
				series : [
					{
						name:'Quantidade',
						type:'bar',
						barWidth: '60%',
						data: qtdEntregas
					}
				]
			}
		}
	}

	ngOnInit() {
		this.objFormFilterTransporteDashboardAux.controls['DTINICIO'].setValue(this.utilServices.getStringFromDateObj(this.dtInicioDefault));
		this.objFormFilterTransporteDashboardAux.controls['DTFIM'].setValue(this.utilServices.getStringFromDateObj(this.dtTerminoDefault));
		this.objFormFilterTransporteDashboard.controls['G043_DTEMINOT'].setValue(
			[
				this.dataC(this.dtInicioDefault[0]),
				this.dataC(this.dtTerminoDefault[0])
			]
		);

		this.autoInitCharts();
	}

	autoInitCharts() {
		this.utilServices.loadGridShow(); // - Mostro o Loader

		// - Monto gráfico de Situação de Atendimento
		this.dashboardService.getDashboardIndicadores(this.objFormFilterTransporteDashboard.value).subscribe(
			data=>{
				// - Preparo o gráfico de Entregas no Prazo
				this.preparaEntregasNoPrazoEIndicadores(data);

				this.dashboardService.getDashboardDiasEmAtraso(this.objFormFilterTransporteDashboard.value).subscribe(
					data=>{
						this.preparaDashboardDiasEmAtraso(data);

						this.dashboardService.getDashboardEntregas(this.objFormFilterTransporteDashboard.value).subscribe(
							data=>{
								this.preparaDashboardEntregas(data);
								this.realizouFiltro = true;
								this.utilServices.loadGridHide();
							},err=>{
								this.errorFound = true;
								this.utilServices.loadGridHide();
								this.toastr.error('Não foi possível carregar o resultado.');
							}
						);
					},err=>{
						this.errorFound = true;
						this.utilServices.loadGridHide();
						this.toastr.error('Não foi possível carregar o resultado.');
					}
				);
			},err=>{
				this.errorFound = true;
				this.utilServices.loadGridHide();
				this.toastr.error('Não foi possível carregar o resultado.');
			}
		);
	}
}
