import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SacDashboardService } from '../../services/crud/dashboard-sac.service';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardAdmComponent implements OnInit {
	private global = new GlobalsServices();
	url = this.global.getApiHost();

	public realizouFiltro: boolean = false;

	// - Objeto de Todos Gráficos
	objAtendentes = {}; 	 // - Gráfico de Atendimento por Atendentes
	objTempAtendimento = {}; // - Gráfico de Tempo por Atendimento
	objSitAtendimento = {};  // - Gráfico de Situação de Atendimentos
	objAcaoXMotivo = {};	 // - Gráfico de Ação x Motivos


	// - Formgroup utilizado para enviar para api.
	objFormFilterSac: FormGroup;
	// - Formgroup auxiliar para o usuário preencher os campos.
	objFormFilterSacAux: FormGroup;

	public noValueAtendimentoPorAtendente:  boolean = false;
	public noValueTempoDeAtendimento: 		boolean = false;
	public noValueSituacaoDeAtendimento: 	boolean = false;
	public noValueAcaoEMotivo: 				boolean = false;


	data            = new Date();
	dataMinima      = [{year: '', month: '', day: ''}];
	dataMaxima      = [{year: '', month: '', day: ''}];
	dtInicioDefault  = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1}];
	dtTerminoDefault = [{year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate()}];
	dataInicio      : any;
	horas           = [];
	busca           = '';
	mesSelecionado  = '';
	anoSelecionado  = '';
	diaDaSemana     : any;
	dataClicou      = [];
	diaSelecionado;

	public isLoading	: boolean = true;
	public isSearched	: boolean = false;
	public errorFound	: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private sacDashboardService	: SacDashboardService,
		private utilServices: UtilServices,
		private toastr: ToastrService
		) {
		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterSacAux = formBuilder.group({
			NF: [],
			G014_IDG014: [],
			DTINICIO: 		 [],
			DTFIM: 			 [],
		});

		// - Filtro da Datagrid Inicial da Home
		this.objFormFilterSac = formBuilder.group({
			G014_IDG014:	 [],
			A001_DTREGIST: 	 []
		});

	}

	// - Função para clicar na data do datepicker.
	dataClick(event){
		let dia = event.year + '-' + event.month + '-' + event.day;
		this.diaSelecionado = new Date(dia);
		this.dataClicou = event;
		this.anoSelecionado = event.year;
	}

	initCharts() {
		this.utilServices.loadGridShow(); // - Mostro o Loader
		this.prepareFilter(); // - Prepara o filtro para o back-end;

		// - Monto gráfico de Situação de Atendimento
		this.sacDashboardService.getDashboardSituacaoAtendimento(this.objFormFilterSac.value).subscribe(
			data=>{
				// - Preparo o gráfico de Situação de Atendimento
				this.prepareSituacaoAtendimento(data);

				// - Monto gráfico de Tempo de Atendimento
				this.sacDashboardService.getDashboardTempoAtendimento(this.objFormFilterSac.value).subscribe(
					data=>{
						// - Prepara o gráfico de tempo de atendimento
						this.prepareTempoAtendimentoFinal(data);

						// - Monto gráfico de Atendimento por Atendente
						this.sacDashboardService.getDashboardAtendimentoPorAtendente(this.objFormFilterSac.value).subscribe(
							data=>{
								// - Prepara o gráfico de tempo de atendimento
								this.prepareAtendimentoPorAtendente(data);

								this.sacDashboardService.getDashboardAcaoXMotivo(this.objFormFilterSac.value).subscribe(
									data=>{
										// - Prepara Ação e Motivo
										this.prepareAcaoMotivo(data);

										this.utilServices.loadGridHide();
										this.realizouFiltro = true;
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
			},err=>{
				this.errorFound = true;
				this.utilServices.loadGridHide();
				this.toastr.error('Não foi possível carregar o resultado.');
			}
		);
	}

	// - Função que prepara o Formgroup para ser enviado ao server.
	prepareFilter(): void {
		// - Seto o A001_DTREGIST
		if ((this.objFormFilterSacAux.controls['DTFIM'].value != null) && (this.objFormFilterSacAux.controls['DTINICIO'].value != null)) {
			this.objFormFilterSac.controls['A001_DTREGIST'].setValue(
				[
					this.dataC(this.objFormFilterSacAux.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterSacAux.controls['DTFIM'].value)
				]
			);
		}
		// - Seto o G014_IDG014
		if (this.objFormFilterSacAux.controls['G014_IDG014'].value != null && this.objFormFilterSacAux.controls['G014_IDG014'].value instanceof Array) {
			if (this.objFormFilterSacAux.controls['G014_IDG014'].value.length > 0) {
				this.objFormFilterSac.controls['G014_IDG014'].setValue({in:this.objFormFilterSacAux.controls['G014_IDG014'].value})
			}
		}
	}

	limpar(){
		this.objFormFilterSacAux.reset();
		this.objFormFilterSac.reset();
	}

	// - Prepara a Data para o formato convencionado dd/mm/yyyy
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

	prepareAcaoMotivo(data): void {
		if (data instanceof Array && data.length > 0) {
			let arDadosOC = [];
			let arDadosAT = [];
			let arTitulo = [];
			data.forEach(function (item) {
				let obItem = {
					value: item.QTVALUE,
					name: item.DSVALUE
				};

				if (item.DSACAO == 'AT') {
					arDadosAT.push(obItem);
				} else {
					arDadosOC.push(obItem);
				}

				arTitulo.push(item.DSVALUE);
			});

			this.objAcaoXMotivo = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b}: {c} ({d}%)"
				},
				legend: {
					type: 'scroll', 
					orient: 'vertical',
					left: 'left',
					right: 10,
					top: 20,
					bottom: 20,
					data: arTitulo
				},
				series: [
				{
					name:'Ocorrências',
					type:'pie',
					selectedMode: 'single',
					radius: [0, '40%'],
					center: ['75%', '50%'],
					label: {
						normal: {
							show: false,
							position: 'inner'
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:arDadosOC
				},
				{
					name:'Atendimento',
					type:'pie',
					radius: ['45%', '60%'],
					center: ['75%', '50%'],
					label: {
						normal: {
							show: false,
							position: 'inner'
						}
					},

					data: arDadosAT
				}]
			};
		} else {
			this.noValueAcaoEMotivo = true;
		}
	}

	// - Função para preparar o gráfico de situação de atendimento:
	prepareSituacaoAtendimento(data): void {
		if (data instanceof Array && data.length > 0) {
			let arDados = [];
			let arTitulo = [];

			// data.forEach(function (item) {
			// 	arTitulo.push(item.DSMOVIME + " - " + item.DSOPERAC);
			// 	let obItem = {
			// 		value: item.QTD,
			// 		name: item.DSMOVIME + " - " + item.DSOPERAC
			// 	};
			// 	arDados.push(obItem);
			// });			

			data.forEach(function (item) {
				arTitulo.push(item.DSMOVIME);
				let obItem = {
					value: item.QTD,
					name: item.DSMOVIME
				};
				arDados.push(obItem);
			});

			this.objSitAtendimento = {
				color: ['rgb(28, 88, 177)', 'rgb(18, 63, 130)', 'rgb(1, 80, 198)', 'rgb(105, 159, 240)'],
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'horizontal',
					left: 'center',
					data: arTitulo
				},
				series : [
					{
						name: 'Quantidade',
						type: 'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:arDados,
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
			this.noValueSituacaoDeAtendimento = true;
		}
	}

	// - Função para preparar o gráfico de Tempo de Atendimento
	prepareTempoAtendimentoFinal(data): void {
		if (data instanceof Array && data.length > 0) {
			let quatroHorasMenos	: number = 0;
			let cincoHoras			: number = 0;
			let seisHoras			: number = 0;
			let seteHorasMais		: number = 0;

			if (data instanceof Array) {
				if (data.length > 0) {
					data.forEach(function (item) {
						if (item.NRHORAS <= 4) {
							quatroHorasMenos += item.QTD;
						}

						if (item.NRHORAS == 5) {
							cincoHoras += item.QTD;
						}

						if (item.NRHORAS == 6) {
							seisHoras += item.QTD;
						}

						if (item.NRHORAS >= 7) {
							seteHorasMais += item.QTD;
						}
					});
				}
			}

			let dataFinal =
			[
				{
					value: quatroHorasMenos, name: '4h'
				},
				{
					value: cincoHoras, name: '5h'
				},
				{
					value: seisHoras, name: '6h'
				},
				{
					value: seteHorasMais, name: '7h ou mais'
				}
			]

			this.objTempAtendimento = {
				color: ['rgb(70,130,180)', 'rgb(0,191,255)', 'rgb(17, 39, 69)', 'rgb(60, 136, 237)'],
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'horizontal',
					left: 'center',
					data: ['4h','5h','6h','7h ou mais']
				},
				series : [
					{
						name: 'Quantidade',
						type: 'pie',
						radius : '65%',
						center: ['50%', '60%'],
						data: dataFinal,
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
			this.noValueTempoDeAtendimento = true;
		}
	}

	// - Função para preparar o gráfico de atendimento por atendente
	prepareAtendimentoPorAtendente(data): void {
		// Cor default: color: 'rgb(26, 63, 112)'

		if (data instanceof Array && data.length > 0) {
			// let nomesAtendentes = data.map(e => (e.NMUSUARI + " [" + e.DSOPERAC + "]"));
			let nomesAtendentes = data.map(e => (e.NMUSUARI));
			let qtdAtendimentos = data.map(e => ({ value: e.QTD,	itemStyle:{color: 'rgb(26, 63, 112)'}}));
			this.objAtendentes = {
				tooltip : {
						trigger: 'axis',
						axisPointer : {
								type : 'cross'
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
								data : nomesAtendentes,
								axisTick: {
										alignWithLabel: true
                },
                axisLabel: {
                  interval: 0,
				  rotate: 30,
				  show: false
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
							data:qtdAtendimentos
						}
				]
			};
		} else {
			this.noValueAtendimentoPorAtendente = true;
		}
	}

	ngOnInit() {
		this.objFormFilterSacAux.controls['DTINICIO'].setValue(this.utilServices.getStringFromDateObj(this.dtInicioDefault));
		this.objFormFilterSacAux.controls['DTFIM'].setValue(this.utilServices.getStringFromDateObj(this.dtTerminoDefault));
		this.objFormFilterSac.controls['A001_DTREGIST'].setValue(
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
		this.sacDashboardService.getDashboardSituacaoAtendimento(this.objFormFilterSac.value).subscribe(
			data=>{
				// - Preparo o gráfico de Situação de Atendimento
				this.prepareSituacaoAtendimento(data);

				// - Monto gráfico de Tempo de Atendimento
				this.sacDashboardService.getDashboardTempoAtendimento(this.objFormFilterSac.value).subscribe(
					data=>{
						// - Prepara o gráfico de tempo de atendimento
						this.prepareTempoAtendimentoFinal(data);

						// - Monto gráfico de Atendimento por Atendente
						this.sacDashboardService.getDashboardAtendimentoPorAtendente(this.objFormFilterSac.value).subscribe(
							data=>{
								// - Prepara o gráfico de tempo de atendimento
								this.prepareAtendimentoPorAtendente(data);

								this.sacDashboardService.getDashboardAcaoXMotivo(this.objFormFilterSac.value).subscribe(
									data=>{
										// - Prepara Ação e Motivo
										this.prepareAcaoMotivo(data);

										this.utilServices.loadGridHide();
										this.realizouFiltro = true;
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
			},err=>{
				this.errorFound = true;
				this.utilServices.loadGridHide();
				this.toastr.error('Não foi possível carregar o resultado.');
			}
		);
	}
}
