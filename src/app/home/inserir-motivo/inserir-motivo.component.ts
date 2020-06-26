import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';

// - Components da Aplicação
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

// - Services da Aplicação
import { AtendimentosService } from '../../services/crud/atendimentos.service';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

// - Models da Aplicação
import { TiposDeAcao } from '../../models/tipos-de-acao.model';
import { MotivosAtendimento } from '../../models/motivos-atendimento.model';
import { NotaFiscal } from '../../models/nota-fiscal.model';
import { NfeResume } from '../../models/nfe-resume.model';

import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import * as $ from 'jquery';

@Component({
	selector: 'app-inserir-motivo',
	templateUrl: './inserir-motivo.component.html',
	styleUrls: ['./inserir-motivo.component.css']
})
export class InserirMotivoComponent implements OnInit {
	token = localStorage.getItem('token');

	// - Componentes Filhos
	@ViewChild('modalCargaNfe')  modalCargaNfe;

	 global = new GlobalsServices();
	url = this.global.getApiHost();

	// - Controladores do Loading do Componente
	public loadingAtendimento = false;

	// - Array de Tipos de Ação disponíveis
	 tiposDeAcaoList: TiposDeAcao[] = [];

	// - Array de Motivos do Atendimento
	 motivosList: MotivosAtendimento[] = [];
	 listMotivos: MotivosAtendimento[] = [];
	 motivosList4PL: MotivosAtendimento[] = [];
	 motivosListBkp: MotivosAtendimento[] = [];
	

	// - Lista de Notas Fiscais Selecionadas
	 listNfeSelecionadas: NfeResume[] = [];

	// - Lista de arquivos em anexo
	 listArquivos = [];

	 carregando:boolean = true;

	// - Datas de apresentação na alteração de datas
	 DTEMINOT: string = ''; // Data de Emissão da NFe
	 DTEMICTR: string = ''; // Data de Emissão do CTe
	 DTENTCON: string = ''; // Data de SLA
	 DTPREENT: string = ''; // Data de Previsão de Entrega
	 DTCOLETA: string = ''; // Data de Coleta
	 DTAGENDA: string = ''; // Data Agendada
	 DTCOMBIN: string = ''; // Data Combinada
	 DTROTERI: string = ''; // Data de Roteirização
	 DTENTREG: string = ''; // Data de Entrega
	 DTPRECOR: string = ''; // Data de previsão de entrega corretiva
	 DTENTPLA: string = ''; // Data de previsão de entrega
	// Variáveis para validação 4PL (Reason Code)
	 TPMODCAR: string = ''; /* Tipo Carga Modelo 1 - 3PL || 2 - 4PL || 3 - Mista */
	 STCTRC  : string = ''; /* Situação do CTE */
	 SNCTEVIN: string = ''; /* Se o CTE está vinculado com a nota */
	 ASNINTCL: number = null; /* ASN STINTCLI da  G048 */
	 STCARGA: string = ''; /* Status da carga */
	 DTPREORI: string = ''; /* DTPREORI da tabela G048 */
	 CDCARGA: string = ''; /* Número da Carga */


	 uploadResult: any = null;

	public isEntregue: 			 boolean = true;
	public needDataRoteirizacao: boolean = true;
	public canMovAtendimento: 	 boolean = true;

	// - Váriaveis recebidas pelo Componente
	// -------------------------------------
	@Input() IDG043: any = ''; // - Nota Fiscal Selecionada
	@Input() IDA001: any = ''; // - Nota Fiscal Selecionada
	@Input() bloqueio: boolean = false; // - Campo para informar que é tipo bloqueio.
	@Input() desbloqueio: boolean = false; // - Campo para informar que é tipo desbloqueio.


	auxIDA001;

	objNfe: NotaFiscal;
	IDG043_arr: number[] = [];

	// - FormGroup para criação de atendimento
	objFormNewAtendimento: FormGroup;
	// - FormGroup para Filtrar Carga na Seleção de Notas
	objFormFiltrarCarga: FormGroup;
	// - FormGroup para Filtrar Carga na Seleção de Notas
	objFormFiltrarCargaAux: FormGroup;


	@Output() callHome = new EventEmitter<any>();
	@Output() movAtendimentoEvent = new EventEmitter<number>();

	tipoAtendimento: number = 0;

	/* Visualizar Carga Controllers */
	selecionarNotas: boolean = false;
	txtButtonSelecionarNotas: string = 'Ver Carga';
	classButtonSelecionarNotas: string = 'primary';
	/* Fim Carga Controllers */

	/* Visualizar Datas Controllers */
	vlChangeDatas: boolean = false;
	txtButtonChangeDatas: string = 'Alterar Datas';
	classButtonChangeDatas: string = 'primary';
	/* Fim Datas Controllers */

	/* Visualizar Datas Reason Code Controllers */
	vlChangeDatasReasonConde: boolean = false;
	txtButtonReasonCode: string = 'Alterar Datas 4PL';
	classButtonChangeDatasReasonCode: string = 'primary';

	// - Controller para saber se o usuário clicou em Ver Carga ou Alteração de Datas
	controllerTouchedCarga: boolean = true;
	controllerTouchedData: boolean = true;
	controllerTouchedDataReasonCode: boolean = true;

	// - Controller pra saber se uma NFE possui Carga vinculada a ela
	controllerCargaPorNfe: boolean = true;


	public beforeChange($event: NgbTabChangeEvent) {
	    if ($event.nextId === 'bar') {
	      $event.preventDefault();
	    }
	}


	constructor
	(
		private formBuilder: FormBuilder,
		private atendimentosService: AtendimentosService,
		private deliverysNfService: DeliverysNfService,
		private toastr: ToastrService,
		private modal : ModalComponent,
		private utilServices: UtilServices,
		private grid : DatagridComponent
	) {
		this.loadingAtendimento = true;

		// - Formulário de cadastro de atendimento
		this.objFormNewAtendimento = formBuilder.group({
			IDA008:		[],
			IDA002: 	['', Validators.required], // - Motivo da Ação
			IDSOLIDO:	['', Validators.required], // - Id do usuário da base de dados
			IDG005: 	[], // - Cliente
			IDG024: 	[], // - Transportadora
			IDS001DE: 	[], // - Usuário Destino do Atendimento
			IDG043: 	[], // - NF-e
			G043_NRNOTA: [{value: '', disabled: true}], // - Número da Nota
			DSOBSERV: 	[],
			NMSOLITE: 	[],
			TFSOLITE: 	[],
			DTAGENDA:	[],
			DTCOMBIN:	[],
			DTROTERI:	[],
			DTPRECOR:	[],
			IDG051:		[],
			NF:			[],
			REFDATA:    [],
			DTENTREG:   [],
			DTENTPLA:   []
		});

		// - Formulário de cadastro de atendimento
		this.objFormFiltrarCarga = formBuilder.group({
			G046_IDG046: 	[], // - Número da Carga
			G051_CDCTRC: 	[]  // - Número do CT-e
		});

		// - Formulário de cadastro de atendimento
		this.objFormFiltrarCargaAux = formBuilder.group({
			G046_IDG046: 	[], // - Número da Carga
			G051_CDCTRC: 	[]  // - Número do CT-e
		});

		// - Busca todos os tipos de ação
		this.atendimentosService.getTiposDeAcao().subscribe(
			data => {
				this.tiposDeAcaoList = data;

				this.deliverysNfService.isEntregue({IDG043: this.IDG043}).subscribe(
					data => {
						if (data.isEntregue > 0) {
							this.isEntregue = true;
						} else {
							this.isEntregue = false;
						}

						if (data.needDataRoteri == 0) {
							this.needDataRoteirizacao = true;
						} else {
							this.needDataRoteirizacao = false;
						}

						if (data.canMovAtendimento > 0) {
							this.canMovAtendimento = true;
						} else {
							this.canMovAtendimento = false;
						}
					}, err => {
						this.isEntregue 		  = true;
						this.needDataRoteirizacao = true;
						this.canMovAtendimento 	  = false;
					}
				);

				// - Busca todos os motivos
				this.atendimentosService.getAllMotivos().subscribe(
					data => {
						// Carrega a listagem de motivos disponíveis
						this.motivosList = data;
						// Guarda a listagem de bkp para manipulação de motivos 3PL e 4PL
						this.motivosListBkp = data;

						// - Busca todos os motivos 4 PL
						this.atendimentosService.getAllMotivos4PL().subscribe(
							data => {
								// Carrega a listagem de motivos 4 PL disponíveis
								this.motivosList4PL = data;
							},
							err => {
								this.loadingAtendimento = false;
							}
						);

						// - Workaround - Para selecionar a primeira opção do select
						this.objFormNewAtendimento.controls['IDA008'].setValue(1);
						this.objFormNewAtendimento.controls['IDA002'].setValue('');

						// - Array de Notas Fiscais Vinculadas ao Atendimento.
						this.IDG043_arr.push(this.IDG043);

						// - Seta o código de nota fiscal no Formgroup
						this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043_arr);

		
						if (this.IDA001 == '' || this.IDA001 == null) {
							
							//console.log("NÃO POSSUI ATENDIMENTO");
							// Faz a busca pela nota fiscal selecionada
							let controllerView =
							{
								'IDG043'	: 	this.IDG043,
								'NFE'		:	true,
								'CARGA'		:	true,
								'CTE'		:	true
							}

							// - Busca todas as informações da Nota Fiscal
							this.deliverysNfService.getInformacoesNotaFiscal(controllerView).subscribe(
								data => {
									this.objNfe = data.NFE;
									this.objFormNewAtendimento.controls['G043_NRNOTA'].setValue(data.NFE.NRNOTA);
									console.log(" getInformacoesNotaFiscal  ", data);
									/* Variáveis de validação 4PL Reason Code */
									this.TPMODCAR = data.CARGA.TPMODCAR ? data.CARGA.TPMODCAR : 0; // tipo de carga mista, 3PL ou 4PL
									this.STCTRC = data.CTE.STCTRC ? data.CTE.STCTRC : null; // valida status do CTE
									this.SNCTEVIN = data.CTE.CDCTRC ? 'S' : 'N'; // valida se existe CTE vinculado com a nota
									this.ASNINTCL = (data.CARGA.STINTCLI != null && data.CARGA.STINTCLI != '') ? Number(data.CARGA.STINTCLI) : null; // Validar ASN se já foi gerado G048.STINTCLI > 0
									this.STCARGA = data.CARGA.STCARGA ? data.CARGA.STCARGA : null; /* Valida status da carga */
									this.DTPREORI = data.CARGA.DTPREORI ? data.CARGA.DTPREORI : null; /* DTPREORI da tabela G048 */
									this.CDCARGA = data.CARGA.IDG046 ? data.CARGA.IDG046 : null;

									console.log("STCARGAAA ", this.STCARGA);
									
									this.listNfeSelecionadas.push(
										{
											IDG043	: data.NFE.IDG043,
											NRNOTA  : data.NFE.NRNOTA,
											CDCTRC	: data.NFE.CDCTRC,
											DSMODENF: data.NFE.DSMODENF,
											DTEMINOT: data.NFE.DTEMINOT,
											NRSERINF: data.NFE.NRSERINF,
											TPDELIVE: data.NFE.TPDELIVE,
											IDG051	: data.NFE.IDG051,
											DTENTCON: '',
											DTENTREG: ''
										}
									);

									
									// - Carrego as datas do atendimento:
									this.deliverysNfService.getDatasToAtendimento({IDG043: this.IDG043}).subscribe(
										data => {
											console.log("CHEGOU NO getDatasToAtendimento ", data);
											this.DTEMINOT = data.DTEMINOT;
											this.DTEMICTR = data.DTEMICTR;
											this.DTENTCON = data.DTENTCON;
											this.DTPREENT = data.DTPREENT;
											this.DTCOLETA = data.DTCOLETA;
											this.DTENTREG = data.DTENTREG;
											this.DTENTPLA = data.DTENTPLA;								

											this.objFormNewAtendimento.controls['DTAGENDA'].setValue(data.DTAGENDA);
											this.objFormNewAtendimento.controls['DTROTERI'].setValue(data.DTROTERI);
											this.objFormNewAtendimento.controls['DTCOMBIN'].setValue(data.DTCOMBIN);
											this.objFormNewAtendimento.controls['DTPRECOR'].setValue(data.DTPRECOR);
											this.objFormNewAtendimento.controls['IDG051'].setValue(data.IDG051);

											this.objFormNewAtendimento.controls['DTENTREG'].setValue('');
											this.objFormNewAtendimento.controls['DTENTPLA'].setValue('');
											//this.DTENTREG = data.DTENTREG;
											// - Esconde o Loader
											this.loadingAtendimento = false;

											//this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Alteração de Datas');
											// if (this.bloqueio) {
											// 	this.objFormNewAtendimento.controls['IDA002'].setValue(47);
											// } else if (this.desbloqueio) {
											// 	this.objFormNewAtendimento.controls['IDA002'].setValue(48);
											// } else {
											// 	this.selectTipoAcao('');
											// 	this.objFormNewAtendimento.controls['IDA002'].setValue(46);
											// 	this.objFormNewAtendimento.controls['IDA002'].disable();
											// }
											//this.objFormNewAtendimento.controls['DTROTERI'].setValidators([Validators.required]);
										},
										err => {
											this.loadingAtendimento = false;
										}
									);
								},
								err => {
									this.loadingAtendimento = false;
								}
							);
						}
					},
					err => {
						this.loadingAtendimento = false;
					}
				);
			},
			err => {
				this.loadingAtendimento = false;
			}
		);

	}

	ngOnInit() {

	}

	/* Método responsável por selecionar se é atendimento ou ocorrência */

	checkarNotas(): void {
		// - Show Loader
		this.utilServices.loadGridShow();
		// - Seto a váriavel abaixo para saber que o usuário clicou em Ver Carga.
		//this.controllerTouchedCarga = false;

		// - Busca todas as informações da Carga
		let controllerView =
		{
			'IDG043'	: 	this.IDG043,
			'CARGA'		:	true
		}
		// - Busca todas as informações necessárias
		this.deliverysNfService.getInformacoesNotaFiscal(controllerView).subscribe(
			data => {
				// - Esconde o loader
				this.utilServices.loadGridHide();
				// - Seta o código da Carga da NFE no Filter
				this.objFormFiltrarCargaAux.controls['G046_IDG046'].setValue((data.CARGA.IDG046));
				// - Open Modal com Carga Nota Fiscal
				this.modal.open(this.modalCargaNfe,{ size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
			},
			err => {
				this.utilServices.loadGridHide();
			}
		);
	}

	// - Faz o filtro da DataTable de Notas Fiscais por Carga
	filtrarCargaPorNfe(): void {
		if (this.objFormFiltrarCargaAux.controls['G046_IDG046'].value) {
			this.controllerCargaPorNfe = true;
			// - Se possui carga faz o filtro por carga
			this.objFormFiltrarCarga.controls['G046_IDG046'].setValue(this.objFormFiltrarCargaAux.controls['G046_IDG046'].value);

			if (this.objFormFiltrarCargaAux.controls['G051_CDCTRC'].value) {
				this.objFormFiltrarCarga.controls['G051_CDCTRC'].setValue(this.objFormFiltrarCargaAux.controls['G051_CDCTRC'].value.text);
			}
		} else {
			// - Se não possui carga, não deixa fazer o filtro por CTE.
			this.controllerCargaPorNfe = false;

			// - Verificar se o objeto de nota fiscal está preenchido
			if (this.objNfe) {
				this.objFormFiltrarCarga.controls['G051_CDCTRC'].setValue(this.objNfe.CDCTRC);
			} else {
				// - Show Loader
				this.utilServices.loadGridShow();
				// - Busca todas as informações da Carga
				let controllerView =
				{
					'IDG043'	: 	this.IDG043,
					'CTE'		:	true
				}
				// - Busca todas as informações necessárias
				this.deliverysNfService.getInformacoesNotaFiscal(controllerView).subscribe(
					data => {
						// - Esconde o loader
						this.utilServices.loadGridHide();
						// - Seta o código da Carga da NFE no Filter
						this.objFormFiltrarCargaAux.controls['G051_CDCTRC'].setValue((data.CTE.CDCTRC));
					},
					err => {
						this.utilServices.loadGridHide();
					}
				);
			}
		}

		this.grid.findDataTable('listarNotasFiscaisCarga', 'objFormFiltrarCarga');
	}

	generateDateAtual() {
		let today = new Date();
		let dd = today.getDate();
		let yyyy = today.getFullYear();
		let mm = today.getMonth() + 1;
		let dd_aux = '';
		let mm_aux = '';

		if (dd < 10) {
			dd_aux = '0' + dd;
		} else {
			dd_aux = dd + '';
		}

		if (mm < 10) {
			mm_aux = '0' + mm;
		} else {
			mm_aux = mm + '';
		}

		return dd_aux + '/' + mm_aux + '/' + yyyy;
	}

	// - Função para fechar o modal de seleção da nf-e com base na carga
	closeCargaNfe(): void {
		this.modal.closeModal();
	}

	// - Função para limpar uma posição do Array de Notas Selecionadas
	removeNfeSelecionada(index): void {
		this.listNfeSelecionadas.splice(index, 1);
	}

	addNfesSelecionadas(objNotasSelecionadas) {
		if (objNotasSelecionadas.length > 0) {
			this.controllerTouchedCarga = false;
			// - Limpo o Array de Notas Selecionadas.
			let objArray: NfeResume[] = [];
			this.listNfeSelecionadas  = [];
			// - Crio um Obj Auxiliar
			let objProv: NfeResume = {
				IDG043	: 0,
				NRNOTA	: 0,
				CDCTRC	: 0,
				DSMODENF: '',
				DTEMINOT: '',
				NRSERINF: '',
				TPDELIVE: '',
				IDG051	: 0,
				DTENTCON: '',
				DTENTREG: ''
			}
			// - Faço um Each pra encontrar todas as notas selecionadas
			for(let item of objNotasSelecionadas) {
				let objAux = JSON.parse($('input[type="hidden"][name="obj_checkbox_listarNotasFiscaisCarga_'+item+'"]')[0].value);
				objProv = {
					IDG043	: objAux.IDG043,
					NRNOTA	: objAux.NRNOTA,
					CDCTRC	: objAux.CDCTRC,
					DSMODENF: objAux.DSMODENF,
					DTEMINOT: objAux.DTEMINOT,
					NRSERINF: objAux.NRSERINF,
					TPDELIVE: objAux.TPDELIVE,
					IDG051	: objAux.IDG051,
					DTENTCON: objAux.DTENTCON,
					DTENTREG:	objAux.DTENTREG
				}
				this.listNfeSelecionadas.push(objProv);
			}
			if (this.listNfeSelecionadas.length > 0 && Array.isArray(this.listNfeSelecionadas)) {
				this.toastr.success('Notas incluídas com sucesso!');
			} else {
				this.toastr.error('Não foi possível incluir as notas selecionadas.');
			}
		} else {
			this.toastr.warning('Não hás notas selecionadas.');
		}
	}

	backToHome() {
		this.callHome.emit();
		return false;
	}

	carregaCategoria(event) {
		this.tipoAtendimento = event.srcElement.value;
	}

	getDateNow() {
		return new Date(Date.now()).toLocaleString();
	}

	movimentarAtendimento(IDA001) {
		this.movAtendimentoEvent.emit(IDA001);
	}

	salvarFinalizarAtendimentoMotivosQM() {
		
		if (this.objFormNewAtendimento.controls['IDA002'].value == '' ||
			this.objFormNewAtendimento.controls['IDA002'].value == null) {
			this.toastr.error('O motivo do atendimento é obrigatório.');
			return false;
		}
		
		if (this.objFormNewAtendimento.controls['NMSOLITE'].value == '' ||
			this.objFormNewAtendimento.controls['NMSOLITE'].value == null) {
			this.toastr.error('O campo nome do solicitante é obrigatório.');
			return false;
		}

		if(this.CDCARGA == null || this.CDCARGA == ''){
			this.toastr.error('Nota sem carga vinculada.');
			return false;
		}

		if (this.objFormNewAtendimento.controls['DSOBSERV'].value == '' ||
			this.objFormNewAtendimento.controls['DSOBSERV'].value == null) {
			this.toastr.error('O observação é obrigatório.');
			return false;
		}

		

		let IDSOLIDO = localStorage.getItem('ID_USER');
		this.objFormNewAtendimento.controls['IDSOLIDO'].setValue(IDSOLIDO);

		// - Busca todos os tipos de ação
		this.loadingAtendimento = true;

		// - Seta o IDG043
		if (Array.isArray(this.listNfeSelecionadas) && this.listNfeSelecionadas.length > 1) {
			this.objFormNewAtendimento.controls['IDG043'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.IDG043;
				}
			));
		} else {
			this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043);
		}
		

		var objAux: any;

	
		objAux = this.objFormNewAtendimento.getRawValue();
		objAux.CDCARGA = this.CDCARGA;
		
		//debugger;
	
		this.atendimentosService.salvarFinalizarNovoAtendimentoMotivoQM(objAux).subscribe(
			data => {
				this.loadingAtendimento = false;
				this.toastr.success('Motivo inserido com sucesso.');
				
				
				this.objFormNewAtendimento.reset();
				this.IDG043_arr = [];

				this.movimentarAtendimento(data);

				this.initForm();
				
			}, err => {
				this.loadingAtendimento = false;
				this.toastr.error('Não foi possível inserir motivo.');
			}
		);

		return false;
	}

	initForm() {
		// - Popula novamente o array de notas fiscais selecionadas
		this.IDG043_arr.push(this.IDG043);
		// - Seta a Nota Fiscal Selecionada no Formulário
		this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043_arr);
		this.objFormNewAtendimento.controls['G043_NRNOTA'].setValue(this.objNfe.NRNOTA);

		// - Workaround - Para selecionar a primeira opção do select
		this.objFormNewAtendimento.controls['IDA002'].setValue('');
		this.objFormNewAtendimento.controls['IDA008'].setValue(1);
	}

}
