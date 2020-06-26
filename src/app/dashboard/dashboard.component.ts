import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

// - Indicadores
import { IndicadorHome } from '../models/indicador-home.model';

// - Services
import { GlobalsServices            } from '../shared/componentesbravo/src/app/services/globals.services';
import { DashboardService } from '../services/crud/dashboard.service';
import { UtilServices } from '../shared/componentesbravo/src/app/services/util.services';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent  {
	global = new GlobalsServices();
	url = this.global.getApiHost();

	// - Formgroup utilizado para enviar para api.
	objFormFilterDashboard: FormGroup;
	// - Formgroup auxiliar para o usuário preencher os campos.
	objFormFilterDashboardAux: FormGroup;

	public realizouFiltro: boolean = false;
	public noValueDiasAtraso: boolean = false;
	public noValueAtendimentoPorAtendente: boolean = false;

	// - Objeto de Indicadores
	indicadores: IndicadorHome[] = [];

	// - Valor dos Indicadores
	vlQtdEntregAtiva: number = 0;    // Quantidade de Atendimentos em Aberto
	vlQtdEntregAtras: number = 0;    // Quantidade de Ocorrências em Aberto
	vlQtdEntregReali: number = 0;    // Quantidade de Entregas em Aberto
	vlTotalEntregas:  string = '0';  // Total de Entregas

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

	objVisaoDemanda  = {};
	objEntregasPrazo = {};
	objDiasAtrazo = {};

	public controllerFirstSearch: boolean = false;
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
			{ desc: 'Em Andamento', value: this.vlQtdEntregAtiva + '',  color:  'green', icon: 'icon-ecommerce-cart-content' },
			{ desc: 'Em Atraso',  value: this.vlQtdEntregAtras + '',  color:  'blue',  icon: 'icon-ecommerce-cart-download' },
			{ desc: 'Realiz. no Prazo', 	value: this.vlQtdEntregReali + '', color:  'teal',  icon: 'icon-ecommerce-cart-upload' },
			{ desc: 'Total', 	value: this.vlTotalEntregas  + '', color:  'red',   icon: 'icon-ecommerce-cart-plus' }
		);

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterDashboardAux = formBuilder.group({
			NF: [],
			G014_IDG014: [],
			DTINICIO: 		 [],
			DTFIM: [],
			VISAO: ['CTE']
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterDashboard = formBuilder.group({
			G014_IDG014:	 [],
			G043_DTEMINOT: 	 [],
			VISAO: []
		});
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

	// - Função para atualizar os valores do Indicador
	refreshIndicadores(): void {
		this.indicadores = [];
		this.indicadores.push(
			{ desc: 'Em Andamento', value: this.vlQtdEntregAtiva + '',  color:  'green', icon: 'icon-ecommerce-cart-content' },
			{ desc: 'Em Atraso',  value: this.vlQtdEntregAtras + '',  color:  'blue',  icon: 'icon-ecommerce-cart-download' },
			{ desc: 'Ent. no Prazo', 	value: this.vlQtdEntregReali + '', color:  'teal',  icon: 'icon-ecommerce-cart-upload' },
			{ desc: 'Total', 	value: this.vlTotalEntregas  + '', color:  'red',   icon: 'icon-ecommerce-cart-plus' }
		);
	}

	initCharts() {
		this.utilServices.loadGridShow(); // - Mostro o Loader
		this.prepareFilter(); // - Prepara o filtro para o back-end;

		// - Monto gráfico de Situação de Atendimento
		this.dashboardService.getDashboardIndicadores(this.objFormFilterDashboard.value).subscribe(
			data=>{
				// - Preparo o gráfico de Entregas no Prazo
				this.preparaEntregasNoPrazoEIndicadores(data);

				this.dashboardService.getDashboardDemanda(this.objFormFilterDashboard.value).subscribe(
					data=>{
						this.preparaDashboardDemanda(data);

						this.dashboardService.getDashboardDiasEmAtraso(this.objFormFilterDashboard.value).subscribe(
							data=>{
								this.preparaDashboardDiasEmAtraso(data);

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

	// - Função que prepara o Formgroup para ser enviado ao server.
	prepareFilter(): void {
		// - Seto o G051_DTEMICTR
		if ((this.objFormFilterDashboardAux.controls['DTFIM'].value != null) && (this.objFormFilterDashboardAux.controls['DTINICIO'].value != null)) {
			this.objFormFilterDashboard.controls['G043_DTEMINOT'].setValue(
				[
					this.dataC(this.objFormFilterDashboardAux.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterDashboardAux.controls['DTFIM'].value)
				]
			);
		}
		// - Seto o G014_IDG014
		if (this.objFormFilterDashboardAux.controls['G014_IDG014'].value != null && this.objFormFilterDashboardAux.controls['G014_IDG014'].value instanceof Array) {
			if (this.objFormFilterDashboardAux.controls['G014_IDG014'].value.length > 0) {
				this.objFormFilterDashboard.controls['G014_IDG014'].setValue({in:this.objFormFilterDashboardAux.controls['G014_IDG014'].value})
			}
		}

		if (this.objFormFilterDashboardAux.controls['VISAO'].value != null) {
			this.objFormFilterDashboard.controls['VISAO'].setValue(this.objFormFilterDashboardAux.controls['VISAO'].value);
		}
	}

	limpar(){
		this.objFormFilterDashboardAux.reset();
		this.objFormFilterDashboard.reset();
	}

	preparaDashboardDemanda(data): void {
		let contador = 0;
		let arrayDatas = [];
		let arComCte = [];
		let arSemCte = [];
		let totalNotas = 0;
		let totaisNotas = [];
		let index = 0
		let dataAux = '';

		if (data instanceof Array) {
			if (data.length > 0) {

				data.forEach(function (item) {
					totalNotas += item.QTTOTAL;

					if (item.DTEMINOT != dataAux) {
						arrayDatas.push(item.DTEMINOT);
						dataAux = item.DTEMINOT;
						totaisNotas[index] = parseInt(item.QTTOTAL);
						index++;

						if (item.SNG051 == 1) {
							if (item.PCNOTAS >= 100) {
								arComCte.push(100);
								arSemCte.push(0);
							} else {
								arComCte.push(item.PCNOTAS.toFixed(2));
							}
						} else {
							if (item.PCNOTAS >= 100) {
								arSemCte.push(100);
								arComCte.push(0);
							} else {
								arSemCte.push(item.PCNOTAS.toFixed(2));
							}
						}
					} else {
						totaisNotas[(index-1)] += parseInt(item.QTTOTAL);
						if (item.SNG051 == 1) {
							if (item.PCNOTAS >= 100) {
								arComCte.push(100);
								arSemCte.push(0);
							} else {
								arComCte.push(item.PCNOTAS.toFixed(2));
							}
						} else {
							if (item.PCNOTAS >= 100) {
								arSemCte.push(100);
								arComCte.push(0);
							} else {
								arSemCte.push(item.PCNOTAS.toFixed(2));
							}
						}
					}
				});
			}
		}

		this.objVisaoDemanda = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					crossStyle: {
						color: '#999'
					}
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			legend: {
				data:['Com CTE','Sem CTE','Total']
			},
			xAxis: [
				{
					type: 'category',
					data: arrayDatas,
					axisPointer: {
						type: 'shadow'
          },
          axisLabel: {
            interval: 0,
            rotate: 30
          },
				}
			],
			yAxis: [
				{
					type: 'value',
					name: 'Percentual',
					min: 0,
					//max: 100,
					interval: 10,
					axisLabel: {
						formatter: '{value}%'
					}
				},
				{
					type: 'value',
					name: 'Quantidade',
					min: 0,
					//max: totalNotas,
					//interval: 5,
					axisLabel: {
						formatter: '{value}'
					}
				}
			],
			series: [
				{
					name:'Com CTE',
					type:'bar',
					stack: 'GRUPO',
					label: {
						normal: {
							show: true,
							position: 'insideRight'
						}
					},
					data:arComCte
				},
				{
					name:'Sem CTE',
					type:'bar',
					stack: 'GRUPO',
					label: {
						normal: {
							show: true,
							position: 'insideRight'
						}
					},
					data:arSemCte
				},
				{
					name:'Total',
					type:'line',
					//stack: 'GRUPO',
					yAxisIndex: 1,
					data:totaisNotas
				}
			]
		}
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

		let percEntregas = data.PCENTPRA.toFixed(0);
		this.objEntregasPrazo = {
			color: ['rgb(26, 63, 112)', 'rgb(38, 99, 179)', 'rgb(17, 39, 69)'],
			tooltip : {
				formatter: "{a} <br/>{b} : {c}%"
			},
			toolbox: {
				show : true,
				feature : {}
			},
			series : [
				{
					name:'Porcentagem',
					type:'pie',
					detail : {formatter:'{value}%'},
					data:[{value: percEntregas, name: this.vlQtdEntregReali}], // + ' Cargas'
					axisLine: {
						show: true,
						lineStyle: {
							color: [
								[0.85, 'rgb(235, 85, 75)'],
								[0.95, 'rgb(227, 207, 28)'],
								[1, 'rgb(63, 168, 80)']
							]
						}
					},
				}
			]
		};
	}

	ngOnInit() {
		this.objFormFilterDashboardAux.controls['DTINICIO'].setValue(this.utilServices.getStringFromDateObj(this.dtInicioDefault));
		this.objFormFilterDashboardAux.controls['DTFIM'].setValue(this.utilServices.getStringFromDateObj(this.dtTerminoDefault));
		this.objFormFilterDashboard.controls['G043_DTEMINOT'].setValue(
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
		this.dashboardService.getDashboardIndicadores(this.objFormFilterDashboard.value).subscribe(
			data=>{
				// - Preparo o gráfico de Entregas no Prazo
				this.preparaEntregasNoPrazoEIndicadores(data);

				this.dashboardService.getDashboardDemanda(this.objFormFilterDashboard.value).subscribe(
					data=>{
						this.preparaDashboardDemanda(data);

						this.dashboardService.getDashboardDiasEmAtraso(this.objFormFilterDashboard.value).subscribe(
							data=>{
								this.preparaDashboardDiasEmAtraso(data);
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
