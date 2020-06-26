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
import { FileUploader, FileItem } from 'ng2-file-upload/ng2-file-upload';

import * as $ from 'jquery';

@Component({
	selector: 'app-novo-atendimento',
	templateUrl: './novo-atendimento.component.html',
	styleUrls: ['./novo-atendimento.component.css']
})
export class NovoAtendimentoComponent implements OnInit {
	token = localStorage.getItem('token');

	// - Componentes Filhos
	@ViewChild('modalCargaNfe') private modalCargaNfe;
	@ViewChild('modalAnexoOcorrencia') private modalAnexoOcorrencia;
	@ViewChild('modalViewAnexoOcorrencia') private modalViewAnexoOcorrencia;
	@ViewChild('downloadZipLink') private downloadZipLink: ElementRef;

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
	DTEMINOT: any = ''; // Data de Emissão da NFe
	DTEMICTR: string = ''; // Data de Emissão do CTe
	DTENTCON: any; // Data de SLA
	DTCOLETA: string = ''; // Data de Coleta
	DTAGENDA: string = ''; // Data Agendada
	DTCOMBIN: string = ''; // Data Combinada
	DTROTERI: string = ''; // Data de Roteirização
	DTENTREG: string = ''; // Data de Entrega
	DTPRECOR: string = ''; // Data de previsão de entrega corretiva
	DTENTPLA: string = ''; // Data de previsão de entrega
	// Variáveis para validação 4PL (Reason Code)
	TPMODCAR: any; /* Tipo Carga Modelo 1 - 3PL || 2 - 4PL || 3 - Mista */
	STCTRC  : string = ''; /* Situação do CTE */
	SNCTEVIN: string = ''; /* Se o CTE está vinculado com a nota */
	ASNINTCL: number = null; /* ASN STINTCLI da  G048 */
	STCARGA: string = ''; /* Status da carga */
	DTPREORI: string = ''; /* DTPREORI da tabela G048 */
	CDCARGA: string = ''; /* Número da Carga */
	SNTIM4PL: string = ''; /* SN time 4PL, usado para validar botão de recusa apenas time 4PL*/
	DTPREENT: string; // Data de Previsão de Entrega
	SNADMIN;
	STRECUSA;
	SNFIMREC;
	SNREC3PL;
	SNBRAVO;

	uploadResult: any = null;

	public isEntregue: 			 boolean = true;
	public needDataRoteirizacao: boolean = true;
	public canMovAtendimento: 	 boolean = true;

	// - Váriaveis recebidas pelo Componente
	// -------------------------------------
	@Input() IDG043: any = ''; // - Nota Fiscal Selecionada
	@Input() IDG083: any = '';
	@Input() IDG051: any = ''; // - CTe Selecionada
	@Input() IDA001: any = ''; // - Nota Fiscal Selecionada
	@Input() bloqueio: boolean = false; // - Campo para informar que é tipo bloqueio.
	@Input() desbloqueio: boolean = false; // - Campo para informar que é tipo desbloqueio.
	@Input() ultimoMotivo: any = ''; //motivo do ultimo atendimento.
	@Input() IDG046: any = ''; //ID da carga ( Nesse caso a prioridade é para cargas 4PL)
	@Input() validaSyngenta: boolean = false; //Valida se é syngenta
	@Input() ultCarga: any;


	auxIDA001;

	bkpMotivoAtendimento;

	objNfe: NotaFiscal;
	IDG043_arr: number[] = [];

	// - FormGroup para criação de atendimento
	objFormNewAtendimento: FormGroup;
	// - FormGroup para Filtrar Carga na Seleção de Notas
	objFormFiltrarCarga: FormGroup;
	// - FormGroup para Filtrar Carga na Seleção de Notas
	objFormFiltrarCargaAux: FormGroup;


	@Output() callListAtendimentos = new EventEmitter<any>();
	@Output() movAtendimentoEvent = new EventEmitter<number>();

	tipoAtendimento: number = 0;

	/*Marcar para manter fazer a remoção da data de entrega*/
	vlRemoveEntrega: boolean = false;
	txtButtonRemoveEntrega: string = 'Remover Data de Entrega';
	classButtonRemoveEntrega: string = 'primary';
	controllerTouchedDataRemove: boolean = true;

	/*Marcar para manter SLA após o bloqueio*/
	vlMarkBloque: boolean = false;
	txtButtonMarkBlock: string = 'Manter SLA';
	classButtonMarkBlock: string = 'primary';

	/* Visualizar Carga Controllers */
	selecionarNotas: boolean = false;
	txtButtonSelecionarNotas: string = 'Ver Carga';
	classButtonSelecionarNotas: string = 'primary';
	/* Fim Carga Controllers */

	/* Visualizar Datas Controllers */
	vlChangeDatas: boolean = false;
	txtButtonChangeDatas: string = 'Registrar Agendamento';
	classButtonChangeDatas: string = 'primary';
	/* Fim Datas Controllers */

	/* Visualizar Datas Reason Code Controllers */
	vlChangeDatasReasonConde: boolean = false;
	txtButtonReasonCode: string = 'Alterar Datas 4PL';
	classButtonChangeDatasReasonCode: string = 'primary';

	vlRecusaNotas: boolean = false;
	vlCancelaRecusa: boolean = false;
	txtButtonRecusa: string = 'Recusa de Notas';
	txtButtonCancelaRecusa: string = 'Cancelar Recusa';
	classButtonRecusaNotas: string = 'primary';
	classButtonCancelaRecusaNotas: string = 'primary';
	showRecusaInfo: boolean = false;
	showCancelaRecusaInfo: boolean = false;
	controllerTouchedRecusaNota: boolean = true;
	controllerTouchedCancelaRecusa: boolean = true;

	// - Controller para saber se o usuário clicou em Ver Carga ou Alteração de Datas
	controllerTouchedCarga: boolean = true;
	controllerTouchedData: boolean = true;
	controllerTouchedDataReasonCode: boolean = true;

	// - Controller pra saber se uma NFE possui Carga vinculada a ela
	controllerCargaPorNfe: boolean = true;

	disabledConfig: boolean = true;


	public beforeChange($event: NgbTabChangeEvent) {
	    if ($event.nextId === 'bar') {
	      $event.preventDefault();
	    }
	}
	//*******SFTP**********************************************
	/*uploader: FileUploader = new FileUploader({
		url: this.global.getApiHost() + 'file/monitoria/upload?token='+this.token,
		isHTML5: true,
	// authToken: this.token
	});*/

	uploader: FileUploader = new FileUploader({
		url: this.global.getApiHost() + 'mo/atendimentos/uploadFileOC?token='+this.token,
		isHTML5: true,
		//disableMultipart: true
	// authToken: this.token
	});

	hasBaseDropZoneOver = false;
	hasAnotherDropZoneOver = false;

	fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}

	fileOverAnother(e: any): void {
		this.hasAnotherDropZoneOver = e;
	}

	arrConfigMotivo = [];
	objTypeInput    = { M: 'text', S: 'text', N: 'number' };

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
			IDA008: 	['', Validators.required], // - Tipo de Ação
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
			DTENTPLA:   [],
			NRPROTOC:   [],
			SNDEVNOT: [],
			SNSYNGENTA: [],
			NMGRUPOC: [],
			MANTESLA: [],
			DTCALDEP: [],
			NRNOTA: [],
			CDCTRC: [],
			SNUPLOAD: [],
			SNFINALIZA: [],
			IDG046: []

		});

		// - Formulário de cadastro de atendimento
		this.objFormFiltrarCarga = formBuilder.group({
			G046_IDG046: 	[], // - Número da Carga
			G051_CDCTRC: [],  // - Número do CT-e
			G051_IDG051: [] // - IDG051
		});

		// - Formulário de cadastro de atendimento
		this.objFormFiltrarCargaAux = formBuilder.group({
			G046_IDG046: 	[], // - Número da Carga
			G051_CDCTRC: 	[]  // - Número do CT-e
		});
		// valida se o usuário logado é tipo 4PL ou administrador para ver certas ações
		let idUserLogado = localStorage.getItem('ID_USER');
		this.atendimentosService.validaTime4pl({ID_USER: idUserLogado}).subscribe(
			data => {
				console.log("validaTime4pl", data);
				this.SNADMIN = data.SNADMIN;
				this.SNBRAVO = data.SNBRAVO;
				// se for administrador ou do time 4pl, seta como S
				if(data.SNCAR4PL == 1 || data.SNADMIN == 1){
					this.SNTIM4PL = 'S';
				}else{
					this.SNTIM4PL = 'N';
				}
			}, err => {
				this.SNTIM4PL = 'N';
				this.toastr.error('Ocorreu um erro ao validar tipo de usuário');
			}
		);

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
						if (this.SNBRAVO == 1) {
							this.motivosList = data;
						} else {
							this.motivosList = data.filter(
								function (obj) {
									return obj.SNVISCLI == 1;
								});
						}
						// Guarda a listagem de bkp para manipulação de motivos 3PL e 4PL
						this.motivosListBkp = this.motivosList;
						// - Busca todos os motivos 4 PL
						this.atendimentosService.getAllMotivos4PL().subscribe(
							data => {
								// Carrega a listagem de motivos 4 PL disponíveis
								if (this.SNBRAVO == 1) {
									this.motivosList4PL = data;
								} else {
									this.motivosList4PL = data.filter(
										function (obj) {
											return obj.SNVISCLI == 1;
										});
								}
								//Atribui na lista de motivos 4pl a motivo para remoção da data de entrega
								this.motivosList.forEach(element => {
									if (element.IDA002 == 136) {
										this.motivosList4PL.push(element);
									}
								});
							},
							err => {
								this.loadingAtendimento = false;
							}
						);

						// - Workaround - Para selecionar a primeira opção do select
						this.objFormNewAtendimento.controls['IDA008'].setValue(0);
						this.objFormNewAtendimento.controls['IDA002'].setValue(0);

						// - Array de Notas Fiscais Vinculadas ao Atendimento.
						this.IDG043_arr.push(this.IDG043);

						// - Seta o código de nota fiscal no Formgroup
						this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043_arr);

						// - Verifico se possuí atendimento
						if (this.IDA001 !== '' && this.IDA001 !== null) {
							console.log("POSSUI ATENDIMENTO");
							this.disabledConfig = true;
							// - Atendimento já criado
							// - Busca todas as informações da Nota Fiscal
							this.atendimentosService.getInformacoesAtendimento({IDA001: this.IDA001}).subscribe(
								data => {
									console.log("CHEGOU NO getInformacoesAtendimento ", data);
									this.objFormNewAtendimento.controls['IDA008'].setValue(data[0].IDA008);
									this.objFormNewAtendimento.controls['IDA008'].disable();

									this.selectTipoAcao('');

									this.arrConfigMotivo = data[0].ARCONFIG ? data[0].ARCONFIG : [];

									this.bkpMotivoAtendimento = data[0].IDA002;
									this.objFormNewAtendimento.controls['IDA002'].setValue(data[0].IDA002);
									this.objFormNewAtendimento.controls['IDA002'].disable();
									

									if (data[0].NMUSUARI != null) {
										let objAux = {text: data[0].NMUSUARI, id: data[0].IDS001DE};
										this.objFormNewAtendimento.controls['IDS001DE'].setValue(objAux);
									} else {
										let objAux = {text: 'n.i.', id: 0};
										this.objFormNewAtendimento.controls['IDS001DE'].setValue(objAux);
									}
									this.objFormNewAtendimento.controls['IDS001DE'].disable();
									
									if (data[0].TFSOLITE != null) {
										this.objFormNewAtendimento.controls['TFSOLITE'].setValue(data[0].TFSOLITE);
									} else {
										this.objFormNewAtendimento.controls['TFSOLITE'].setValue('n.i.');
									}
									this.objFormNewAtendimento.controls['TFSOLITE'].disable();

									if (data[0].NMSOLITE != null) {
										this.objFormNewAtendimento.controls['NMSOLITE'].setValue(data[0].NMSOLITE);
									} else {
										this.objFormNewAtendimento.controls['NMSOLITE'].setValue('n.i.');
									}
									this.objFormNewAtendimento.controls['NMSOLITE'].disable();

									let isAlteracaoDatas = data[0].SNDTALTE == 1;

									this.deliverysNfService.getNotasVinculadasAtendimento({IDA001: this.IDA001}).subscribe(
										data => {
											console.log(" getNotasVinculadasAtendimento 11 ", data);
											this.listNfeSelecionadas = data;

											if (isAlteracaoDatas) {
												if (!this.IDG043 && this.listNfeSelecionadas.length == 1) {
													this.IDG043 = this.listNfeSelecionadas[0].IDG043;
												}
												this.listDatesAtendimento();
												this.vlChangeDatas = true;
											} else {
												// - Carrego as datas do atendimento:
												this.deliverysNfService.getDatasToAtendimento({IDG043: this.IDG043, IDG083: this.IDG083}).subscribe(
													data => {
														this.DTEMINOT = data.DTEMINOT;
														this.DTEMICTR = data.DTEMICTR;
														this.DTENTCON = data.DTENTCON;

														this.DTPREENT = data.DTPREENT;

														this.DTCOLETA = data.DTCOLETA;
														this.DTENTREG = data.DTENTREG;
														this.DTENTPLA = this.validaSyngenta ? data.DTENTPLA : data.DTCALDEP;

														this.objFormNewAtendimento.controls['DTAGENDA'].setValue(data.DTAGENDA);
														this.objFormNewAtendimento.controls['DTROTERI'].setValue(data.DTROTERI);
														this.objFormNewAtendimento.controls['DTCOMBIN'].setValue(data.DTCOMBIN);
														this.objFormNewAtendimento.controls['IDG051'].setValue(data.IDG051);

														this.objFormNewAtendimento.controls['DTENTREG'].setValue('');
														this.objFormNewAtendimento.controls['DTENTPLA'].setValue('');
														//this.DTENTREG = data.DTENTREG;
													},
													err => {
														this.loadingAtendimento = false;
													}
												);
											}

											this.loadingAtendimento = false;
										}, err => {
											this.loadingAtendimento = false;
										}
									);

								},
								err => {
									this.loadingAtendimento = false;
								}
							);
						} else {
							this.disabledConfig = false;
							//console.log("NÃO POSSUI ATENDIMENTO");
							// Faz a busca pela nota fiscal selecionada
							let controllerView =
							{
								'IDG043'	: 	this.IDG043,
								'IDG051'	:	this.IDG051,
								'NFE'		:	true,
								'CARGA'		:	true,
								'CTE'		:	true,
								'IDG046': this.IDG046,
								'IDG083': this.IDG083
							}

							this.bkpMotivoAtendimento = '';

							// - Busca todas as informações da Nota Fiscal
							this.deliverysNfService.getInformacoesNotaFiscal(controllerView).subscribe(
								data => {
									this.objNfe = data.NFE;
									this.objFormNewAtendimento.controls['G043_NRNOTA'].setValue(data.NFE.NRNOTA);
									this.STRECUSA = data.NFE.STRECUSA;
									this.SNFIMREC = data.NFE.SNFIMREC;
									this.SNREC3PL = data.NFE.SNREC3PL;

									if (this.STRECUSA > 0 || this.SNFIMREC == 1 || this.SNREC3PL) {
										this.txtButtonRecusa = 'Nota Recusada';
										this.classButtonRecusaNotas = 'Secondary';
									} else {
										this.txtButtonRecusa = 'Recusa de Notas';
										this.classButtonRecusaNotas = 'primary';
									}
									console.log(" getInformacoesNotaFiscal  ", data);
									/* Variáveis de validação 4PL Reason Code */
									if(data.CARGA != null && data.CARGA != undefined){
										this.TPMODCAR = data.CARGA.TPMODCAR ? data.CARGA.TPMODCAR : 0; // tipo de carga mista, 3PL ou 4PL
										this.ASNINTCL = (data.CARGA.STINTCLI != null && data.CARGA.STINTCLI != '') ? Number(data.CARGA.STINTCLI) : null; // Validar ASN se já foi gerado G048.STINTCLI > 0
										this.STCARGA = data.CARGA.STCARGA ? data.CARGA.STCARGA : null; /* Valida status da carga */
										this.DTPREORI = data.CARGA.DTPREORI ? data.CARGA.DTPREORI : null; /* DTPREORI da tabela G048 */
										this.CDCARGA = data.CARGA.IDG046 ? data.CARGA.IDG046 : null;
									}
									if (data.CTE == null || data.CTE == undefined) {
										this.STCTRC = null;
										this.SNCTEVIN = 'N';
									} else {
										this.STCTRC = data.CTE.STCTRC ? data.CTE.STCTRC : null; // valida status do CTE
										this.SNCTEVIN = data.CTE.CDCTRC ? 'S' : 'N'; // valida se existe CTE vinculado com a nota
									}

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
											IDG051: 	data.NFE.IDG051,
											DTENTCON: '',
											DTENTREG: ''
										}
									);

									if (this.bloqueio || this.desbloqueio) {
										// - Tipo de Ação
										this.objFormNewAtendimento.controls['IDA008'].setValue(1);
										this.objFormNewAtendimento.controls['IDA008'].disable();

										this.selectTipoAcao('');
										// - Motivo do Atendimento
										this.objFormNewAtendimento.controls['IDA002'].setValue((this.bloqueio ? 47 : 48));
										this.objFormNewAtendimento.controls['IDA002'].disable();
										// - Nome do Solicitante
										this.objFormNewAtendimento.controls['NMSOLITE'].setValue('n.i.');
										this.objFormNewAtendimento.controls['NMSOLITE'].disable();
										// - Destinado para: 
										let objAux = {text: 'n.i.', id: 0};
										this.objFormNewAtendimento.controls['IDS001DE'].setValue(objAux);
										this.objFormNewAtendimento.controls['IDS001DE'].disable();
										// - IDG051
										this.objFormNewAtendimento.controls['IDG051'].setValue(this.objNfe.IDG051);
										// - Telefone do Solicitante
										this.objFormNewAtendimento.controls['TFSOLITE'].setValue('n.i.');
										this.objFormNewAtendimento.controls['TFSOLITE'].disable();
										// - Descrição do Atendimento
										this.objFormNewAtendimento.controls['DSOBSERV'].setValue((this.bloqueio ? 'Bloqueio de Nota Fiscal por: ' : 'Desbloqueio de Nota Fiscal por: '));

										if (this.bloqueio && this.validaSyngenta) {
											this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Bloqueio de Nota Fiscal mantendo a SLA original por: ');
											this.objFormNewAtendimento.controls['MANTESLA'].setValue('S');
										}
										
										// - Busca por um atendimento de bloqueio para manter SLA original
										if (this.desbloqueio) {
											this.atendimentosService.buscaManterSla({ IDG043: this.IDG043 }).subscribe(
												data => {
													if (data != undefined && data != null) {
														this.txtButtonMarkBlock = 'Manter SLA original';
														this.classButtonMarkBlock = 'Secondary';
														this.vlMarkBloque = true;
														this.objFormNewAtendimento.controls['MANTESLA'].setValue('S');
													}
													
												},
												err => {
													this.loadingAtendimento = false;
												}
											)
										}
									}
									
									// - Carrego as datas do atendimento:
									this.deliverysNfService.getDatasToAtendimento({IDG043: this.IDG043, IDG083: this.IDG083}).subscribe(
										data => {
											console.log("CHEGOU NO getDatasToAtendimento ", data);
											this.DTEMINOT = data.DTEMINOT;
											this.DTEMICTR = data.DTEMICTR;
											this.DTENTCON = data.DTENTCON;
											
											this.DTPREENT = data.DTPREENT;
	
											this.DTCOLETA = data.DTCOLETA;
											this.DTENTREG = data.DTENTREG;
											this.DTENTPLA = this.validaSyngenta ? data.DTENTPLA : data.DTCALDEP;
											
											this.DTAGENDA = data.DTAGENDA;
											this.DTCOMBIN = data.DTCOMBIN;
											this.DTROTERI = data.DTROTERI;

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
									
									this.atendimentosService.buscaUltimoMotivo({IDG043: this.IDG043}).subscribe(
										data => {
											console.log(data);
											if (data != null && data != undefined  && !this.bloqueio && !this.desbloqueio) {
												this.objFormNewAtendimento.controls['IDA002'].setValue(data.A002_IDA002);
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


		//  this.uploader.onBeforeUploadItem = (fileItem) => {
			
	    //   // let obj = {
	    //   //   'dir': "CTE",
	    //   //
	    //   //   'files':[fileItem]
	    //   // };
	    //   // this.cteService.uploadFile(obj).subscribe(
	    //   //   data=>{
	    //   //     console.log(data);
	    //   //   },
	    //   //   err=>{
	    //   //
	    //   //   }
	    //   // );
	    //   //console.log("Maluko:: ", obj);
		// };
		
		

	    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
		  //form.append('dir', "CTE");
		//   console.log("1");

		// form.delete("files");

		// debugger;

		//fileItem = null;

		//form.delete("files");

		//Entra nessa função imediatamente antes do upload
		//Abaixo é realizado o append dos itens restantes da fila

		for (const item of this.uploader.queue) {
		  
		  
	
		  if (typeof item._file.size !== 'number') {
			throw new TypeError('The file specified is no longer valid');
		  }
		  //É ignorado o primeiro pois ele já está na lista do que deve ir, o resto é embutido abaixo
		  if(item != this.uploader.queue[0]){
			form.append("files", item._file, item.file.name);
		  }
		  
		}
		  //Append de outros itens importantes para o envio do email
		  form.append('IDA001', this.auxIDA001);
		  form.append('IDG043', this.objFormNewAtendimento.controls['IDG043'].value);
		  //Stringfy converte objetos em string, pois o append envia apenas no formato de string
		  form.append('NMGRUPOC', JSON.stringify(this.objFormNewAtendimento.controls['NMGRUPOC'].value));
		  form.append('SNFINALIZA', this.objFormNewAtendimento.controls['SNFINALIZA'].value);

		  
		

		 

	    }

	    // this.uploader.uploadAll = () => {
	    //   //this.enviarAquivos();
	    // };


	    this.uploader.onSuccessItem = (item, response, status, headers) => {
	      this.uploadResult = {
	        "success": true, "item": item, "response":
	          response, "status": status, "headers": headers
	      };
	    };
	    this.uploader.onErrorItem = (item, response, status, headers) => {
	      this.uploadResult = {
	        "success": false, "item": item,
	        "response": response, "status": status, "headers": headers
	      };
		};
		
	    this.uploader.onCompleteAll = () => {
			//console.log("2");

			

	      this.handleUploadComplete();
	    };

	}

	ngOnInit() {

	}

	/* Método responsável por selecionar se é atendimento ou ocorrência */
	selectTipoAcao(event): void {
		if (event != '') {
			this.arrConfigMotivo = [];
		}
		this.tipoAtendimento = this.objFormNewAtendimento.controls['IDA008'].value;

		let tipoAcaoSelecionado = this.objFormNewAtendimento.controls['IDA008'].value;
		if (this.bloqueio && !this.IDA001) {
			this.listMotivos = this.motivosList.filter(
			function (obj) {
				return obj.IDA008 == tipoAcaoSelecionado && obj.IDA002 == 47;
			});
		} else if (this.desbloqueio && !this.IDA001) {
			this.listMotivos = this.motivosList.filter(
			function (obj) {
				return obj.IDA008 == tipoAcaoSelecionado && obj.IDA002 == 48;
			});
		} else if (!this.IDA001 && !this.vlChangeDatas && !this.vlChangeDatasReasonConde) {
			//# registrar atendimento normal
			this.listMotivos = this.motivosList.filter(
			function (obj) {
				return obj.IDA008 == tipoAcaoSelecionado && obj.IDA002 != 47 && obj.IDA002 != 48 && obj.IDA002 != 46;
			});

		} else if (!this.IDA001 && this.vlChangeDatas && this.vlChangeDatasReasonConde) {
			this.listMotivos = this.motivosList.filter(
			function (obj) {
				return obj.IDA008 == tipoAcaoSelecionado && obj.IDA002 != 47 && obj.IDA002 != 48
			});
		} else {
			if(this.TPMODCAR != '2' && this.TPMODCAR != '3'){
				//# registrar atendimento normal
				this.listMotivos = this.motivosList.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionado;
				});
			}else{
				this.listMotivos = this.motivosList4PL.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionado;
				});;
			}

		}

		if (this.tipoAtendimento == 2 && this.vlChangeDatas) {
			this.changeDates();
		}else if (this.tipoAtendimento == 2 && this.vlChangeDatasReasonConde) {
			this.changeDatesReasonCode()
		}
	}

	checkarNotas(): void {

		if (this.IDG046 != null && this.IDG046 != undefined && this.IDG046 != '') {
			if (this.ultCarga && this.IDG046 != this.ultCarga) {
				this.objFormFiltrarCargaAux.controls['G046_IDG046'].setValue({in: [this.IDG046,this.ultCarga]});
			} else {
				this.objFormFiltrarCargaAux.controls['G046_IDG046'].setValue(this.IDG046);
			}
		} else {
			this.objFormFiltrarCargaAux.controls['G046_IDG046'].setValue(null);
		}
		this.modal.open(this.modalCargaNfe,{ size: 'xl' as 'lg', windowClass: 'modal-adaptive' });

	}

	// - Faz o filtro da DataTable de Notas Fiscais por Carga
	filtrarCargaPorNfe(): void {
		if (this.objFormFiltrarCargaAux.controls['G046_IDG046'].value) {
			this.controllerCargaPorNfe = true;
			// - Se possui carga faz o filtro por carga
			this.objFormFiltrarCarga.controls['G046_IDG046'].setValue(this.objFormFiltrarCargaAux.controls['G046_IDG046'].value);

			if (this.objFormFiltrarCargaAux.controls['G051_CDCTRC'].value) {
				this.objFormFiltrarCarga.controls['G051_CDCTRC'].setValue(this.objFormFiltrarCargaAux.controls['G051_CDCTRC'].value.text);
			} else {
				this.objFormFiltrarCarga.controls['G051_CDCTRC'].setValue(null);
			}

		} else {
			// - Se não possui carga, não deixa fazer o filtro por CTE.
			this.controllerCargaPorNfe = false;

			this.objFormFiltrarCarga.controls['G051_IDG051'].setValue(this.IDG051);
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
					CDCTRC	: objAux.G051_CDCTRC,
					DSMODENF: objAux.DSMODENF,
					DTEMINOT: objAux.DTEMINOT,
					NRSERINF: objAux.NRSERINF,
					TPDELIVE: objAux.TPDELIVE,
					IDG051	: objAux.IDG051,
					DTENTCON: objAux.DTENTCON,
					DTENTREG: objAux.DTENTREG
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

	changeDates(): void {

		// - Seto a váriavel abaixo como false pra saber que o usuário clicou nas datas.
		this.controllerTouchedData = false;

		if (this.vlChangeDatas) {

			if ((this.objFormNewAtendimento.controls['DTAGENDA'].value == '' || this.objFormNewAtendimento.controls['DTAGENDA'].value == null) &&
				//this.objFormNewAtendimento.controls['DTROTERI'].untouched &&
				(this.objFormNewAtendimento.controls['DTCOMBIN'].value == '' || this.objFormNewAtendimento.controls['DTCOMBIN'].value == null)) {

				this.controllerTouchedData = true;
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');

				if(this.bkpMotivoAtendimento != null && this.bkpMotivoAtendimento != undefined && this.bkpMotivoAtendimento != ''){
					this.objFormNewAtendimento.controls['IDA002'].setValue(this.bkpMotivoAtendimento);
				}else{
					this.objFormNewAtendimento.controls['IDA002'].setValue(0);
				}

				this.objFormNewAtendimento.controls['DTROTERI'].setValidators([]);
			}

			this.objFormNewAtendimento.controls['DTAGENDA'].markAsUntouched();
			this.objFormNewAtendimento.controls['DTCOMBIN'].markAsUntouched();

			this.vlChangeDatas = false;
			this.txtButtonChangeDatas = 'Registrar Agendamento';
			this.classButtonChangeDatas = 'primary';
			this.objFormNewAtendimento.controls['REFDATA'].setValue(0);
			this.selectTipoAcao(1);
			this.objFormNewAtendimento.controls['DTAGENDA'].setValue(this.DTAGENDA);
			this.objFormNewAtendimento.controls['DTROTERI'].setValue(this.DTROTERI);
			this.objFormNewAtendimento.controls['DTCOMBIN'].setValue(this.DTCOMBIN);
			this.objFormNewAtendimento.controls['DTPRECOR'].setValue('');
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
			this.objFormNewAtendimento.controls['IDS001DE'].enable();
			this.objFormNewAtendimento.controls['IDA002'].enable();
		} else {
			this.vlChangeDatas = true;
			this.txtButtonChangeDatas = 'Cancelar Agendamento';
			this.classButtonChangeDatas = 'danger';

			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Alteração de Datas');
			this.objFormNewAtendimento.controls['IDS001DE'].disable();
			this.objFormNewAtendimento.controls['DTROTERI'].setValue(this.generateDateAtual());
			this.objFormNewAtendimento.controls['DTAGENDA'].setValue('');
			this.objFormNewAtendimento.controls['DTCOMBIN'].setValue('');
			if (this.bloqueio) {
				this.objFormNewAtendimento.controls['IDA002'].setValue(47);
			} else if (this.desbloqueio) {
				this.objFormNewAtendimento.controls['IDA002'].setValue(48);
			} else {
				this.selectTipoAcao('');
				this.objFormNewAtendimento.controls['IDA002'].setValue(46);
				this.objFormNewAtendimento.controls['REFDATA'].setValue(1);
				//this.objFormNewAtendimento.controls['IDA002'].disable();
			}
			// - Show Loader
			//this.utilServices.loadGridShow();
			// - Busca todas as informações necessárias
			//this.listDatesAtendimento();
		}
	}

	listDatesAtendimento(): void {
		this.deliverysNfService.getDatasToAtendimento({IDG043: this.IDG043, IDG083: this.IDG083}).subscribe(
			data => {
				this.DTEMINOT = data.DTEMINOT;
				this.DTEMICTR = data.DTEMICTR;
				this.DTENTCON = data.DTENTCON;

				this.DTPREENT = data.DTPREENT;

				this.DTCOLETA = data.DTCOLETA;
				this.DTENTREG = data.DTENTREG;
				this.DTPRECOR = data.DTPRECOR;
				this.DTENTPLA = this.validaSyngenta ? data.DTENTPLA : data.DTCALDEP;

				this.objFormNewAtendimento.controls['DTAGENDA'].setValue(data.DTAGENDA);
				this.objFormNewAtendimento.controls['DTROTERI'].setValue(data.DTROTERI);
				this.objFormNewAtendimento.controls['DTCOMBIN'].setValue(data.DTCOMBIN);
				this.objFormNewAtendimento.controls['DTPRECOR'].setValue(data.DTPRECOR);
				this.objFormNewAtendimento.controls['DTENTREG'].setValue('');
				this.objFormNewAtendimento.controls['DTENTPLA'].setValue('');
				this.objFormNewAtendimento.controls['IDG051'].setValue(data.IDG051);

				this.objFormNewAtendimento.controls['IDS001DE'].disable();

				
				// - Esconde o Loader
				this.utilServices.loadGridHide();

				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Alteração de Datas');
				if (this.bloqueio) {
					this.objFormNewAtendimento.controls['IDA002'].setValue(47);
				} else if (this.desbloqueio) {
					this.objFormNewAtendimento.controls['IDA002'].setValue(48);
				} else {
					this.selectTipoAcao('');
					if(this.bkpMotivoAtendimento != '' && this.bkpMotivoAtendimento != null && this.bkpMotivoAtendimento != undefined){
						this.objFormNewAtendimento.controls['IDA002'].setValue(this.bkpMotivoAtendimento);
						this.objFormNewAtendimento.controls['IDA002'].disable();
					}else{
						this.objFormNewAtendimento.controls['IDA002'].setValue(46);
						this.objFormNewAtendimento.controls['IDA002'].disable();
					}
					
				}
				this.objFormNewAtendimento.controls['DTROTERI'].setValidators([Validators.required]);
			},
			err => {
				// - Esconde o Loader
				this.utilServices.loadGridHide();
			}
		);
	}

	backToListAtendimentos() {
		this.callListAtendimentos.emit();
		return false;
	}

	movimentarAtendimento(IDA001) {
		this.movAtendimentoEvent.emit(IDA001);
	}

	carregaCategoria(event) {
		this.tipoAtendimento = event.srcElement.value;
	}

	getDateNow() {
		return new Date(Date.now()).toLocaleString();
	}

	salvarFinalizarAtendimento() {

		this.simNaoUpload(true);


		if (this.objFormNewAtendimento.controls['NMSOLITE'].value == '' ||
			this.objFormNewAtendimento.controls['NMSOLITE'].value == null) {
			this.toastr.error('O campo nome do solicitante é obrigatório.');
			return false;
		}

		if (this.objFormNewAtendimento.controls['IDA002'].value == '' ||
			this.objFormNewAtendimento.controls['IDA002'].value == null) {
			this.toastr.error('O campo motivo é obrigatório.');
			return false;
		}

		let IDSOLIDO = localStorage.getItem('ID_USER');
		this.objFormNewAtendimento.controls['IDSOLIDO'].setValue(IDSOLIDO);

		// - Seta o IDG043
		if (Array.isArray(this.listNfeSelecionadas) && this.listNfeSelecionadas.length > 1) {
			this.objFormNewAtendimento.controls['IDG043'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.IDG043;
				}
			));
			this.objFormNewAtendimento.controls['IDG051'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.IDG051;
				}
			));
		} else {
			this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043);
		}
		

		var objAux: any;

		if (this.bloqueio) {
			objAux = 
			{
				DSOBSERV: this.objFormNewAtendimento.controls['DSOBSERV'].value,
				DTAGENDA: null,
				DTCOMBIN: null,
				DTROTERI: null,
				IDA008: 1,
				IDA002: 47,
				IDG043: this.objFormNewAtendimento.controls['IDG043'].value,
				IDG051: this.objFormNewAtendimento.controls['IDG051'].value,
				IDSOLIDO: IDSOLIDO,
				NMSOLITE: null,
				TFSOLITE: null,
				MANTESLA: this.objFormNewAtendimento.controls['MANTESLA'].value,
				SNUPLOAD: this.objFormNewAtendimento.controls['SNUPLOAD'].value,
				SNFINALIZA: this.objFormNewAtendimento.controls['SNFINALIZA'].value
			}
		} else if (this.desbloqueio) {
			objAux = 
			{
				DSOBSERV: this.objFormNewAtendimento.controls['DSOBSERV'].value,
				DTAGENDA: null,
				DTCOMBIN: null,
				DTROTERI: null,
				IDA008: 1,
				IDA002: 48,
				IDG043: this.objFormNewAtendimento.controls['IDG043'].value,
				IDG051: this.objFormNewAtendimento.controls['IDG051'].value,
				IDSOLIDO: IDSOLIDO,
				NMSOLITE: null,
				TFSOLITE: null,
				MANTESLA: this.objFormNewAtendimento.controls['MANTESLA'].value,
				SNUPLOAD: this.objFormNewAtendimento.controls['SNUPLOAD'].value,
				SNFINALIZA: this.objFormNewAtendimento.controls['SNFINALIZA'].value
			}
		} else {
			
			if (this.validaSyngenta && this.objFormNewAtendimento.controls['IDA002'].value != 143) {
				this.objFormNewAtendimento.controls['SNSYNGENTA'].setValue(1);
			} else {
				this.objFormNewAtendimento.controls['SNSYNGENTA'].setValue(0);
			}

			if (this.objFormNewAtendimento.controls['DTENTPLA'].value != null && this.objFormNewAtendimento.controls['DTENTPLA'].value != '') {
				this.objFormNewAtendimento.controls['DTCALDEP'].setValue(this.objFormNewAtendimento.controls['DTENTPLA'].value);
				this.objFormNewAtendimento.controls['DTENTPLA'].setValue('');
			} else { 
				this.objFormNewAtendimento.controls['DTCALDEP'].setValue('');
			}

			objAux = this.objFormNewAtendimento.getRawValue();
			objAux.CDCARGA = this.CDCARGA ? this.CDCARGA : null;
		}
		//debugger;
		if (this.objFormNewAtendimento.controls['REFDATA'].value == 1 && this.vlChangeDatas) {

			if ((this.objFormNewAtendimento.controls['DTAGENDA'].value == null || this.objFormNewAtendimento.controls['DTAGENDA'].value == '') &&
					(this.objFormNewAtendimento.controls['DTCOMBIN'].value == null || this.objFormNewAtendimento.controls['DTCOMBIN'].value == '') &&
					(this.objFormNewAtendimento.controls['DTENTREG'].value == null || this.objFormNewAtendimento.controls['DTENTREG'].value == '') &&
					(this.objFormNewAtendimento.controls['DTCALDEP'].value == null || this.objFormNewAtendimento.controls['DTCALDEP'].value == '')) {

				this.loadingAtendimento = false;
				this.toastr.error('Por favor, informe a data a ser alterada.');
				return false;
				
			}
			
			if (this.objFormNewAtendimento.controls['DTENTREG'].value != null && this.objFormNewAtendimento.controls['DTENTREG'].value != '') {

				if ((this.objFormNewAtendimento.controls['DTAGENDA'].value != null && this.objFormNewAtendimento.controls['DTAGENDA'].value != '') ||
						(this.objFormNewAtendimento.controls['DTCOMBIN'].value != null && this.objFormNewAtendimento.controls['DTCOMBIN'].value != '') ||
						(this.objFormNewAtendimento.controls['DTROTERI'].value != null && this.objFormNewAtendimento.controls['DTROTERI'].value != '') ||
						(this.objFormNewAtendimento.controls['DTCALDEP'].value != null && this.objFormNewAtendimento.controls['DTCALDEP'].value != '')) {
					
					this.loadingAtendimento = false;
					this.toastr.error('Se deseja alterar a data de entrega você não pode alterar outras datas.');
					return false;
				}

			}
			if (this.objFormNewAtendimento.controls['DTCALDEP'].value != null && this.objFormNewAtendimento.controls['DTCALDEP'].value != '') {

				if ((this.objFormNewAtendimento.controls['DTAGENDA'].value != null && this.objFormNewAtendimento.controls['DTAGENDA'].value != '') ||
						(this.objFormNewAtendimento.controls['DTCOMBIN'].value != null && this.objFormNewAtendimento.controls['DTCOMBIN'].value != '') ||
						(this.objFormNewAtendimento.controls['DTROTERI'].value != null && this.objFormNewAtendimento.controls['DTROTERI'].value != '') ||
						(this.objFormNewAtendimento.controls['DTENTREG'].value != null && this.objFormNewAtendimento.controls['DTENTREG'].value != '')) {
					
					this.loadingAtendimento = false;
					this.toastr.error('Se deseja alterar a data planejada você não pode alterar outras datas.');
					return false;
				}

			}
			
			if ((this.objFormNewAtendimento.controls['DTAGENDA'].value != null && this.objFormNewAtendimento.controls['DTAGENDA'].value != '') ||
				(this.objFormNewAtendimento.controls['DTCOMBIN'].value != null && this.objFormNewAtendimento.controls['DTCOMBIN'].value != '')) {
				
				if (this.objFormNewAtendimento.controls['DTROTERI'].value == null || this.objFormNewAtendimento.controls['DTROTERI'].value == '') {
					this.loadingAtendimento = false;
					this.toastr.error('Se deseja alterar uma data agendada ou combinada, você também deve informar a data de roteirização.');
					return false;
				}

			}
			
			if ((this.objFormNewAtendimento.controls['DTAGENDA'].value != null && this.objFormNewAtendimento.controls['DTAGENDA'].value != '') &&
				(this.objFormNewAtendimento.controls['DTCOMBIN'].value != null && this.objFormNewAtendimento.controls['DTCOMBIN'].value != '')) {
					this.loadingAtendimento = false;
					this.toastr.error('Você não pode alterar a data combinada e agendada ao mesmo tempo.');
					return false;
			}
			
			if ((this.objFormNewAtendimento.controls['DTAGENDA'].value != null && this.objFormNewAtendimento.controls['DTAGENDA'].value != '') ||
				(this.objFormNewAtendimento.controls['DTCOMBIN'].value != null && this.objFormNewAtendimento.controls['DTCOMBIN'].value != '')) {
				
				let dataPrev;
				if (this.objFormNewAtendimento.controls['DTAGENDA'].value != null && this.objFormNewAtendimento.controls['DTAGENDA'].value != '') {
					dataPrev = this.objFormNewAtendimento.controls['DTAGENDA'].value.split('/');
					dataPrev = new Date(dataPrev[2], dataPrev[1], dataPrev[0]);
				} else {
					dataPrev = this.objFormNewAtendimento.controls['DTCOMBIN'].value.split('/');
					dataPrev = new Date(dataPrev[2], dataPrev[1], dataPrev[0]);
				}

				if (Array.isArray(this.listNfeSelecionadas) && this.listNfeSelecionadas.length > 1) {
					let auxErrPrev = null;
					for (let i = 0; i < this.listNfeSelecionadas.length; i++) {
	
						let auxDataEmitPrev = this.listNfeSelecionadas[i].DTEMINOT.split('/');
						auxDataEmitPrev = new Date(auxDataEmitPrev[2], auxDataEmitPrev[1], auxDataEmitPrev[0]);
	
						auxErrPrev = null;
	
						if (dataPrev < auxDataEmitPrev) {
							auxErrPrev = 'Data de Emissão da Nota ' + this.listNfeSelecionadas[i].NRNOTA + ' maior que a Data de Previsão';
							break;
						}
	
					}
					if (auxErrPrev != null) {
						this.toastr.error(auxErrPrev);
						return false;
					}
				} else {
					//#########################################################################################
					//Validação para bloquear incompatibilidade de dados na criação do atendimento
					let dataEmitPrev = this.DTEMINOT.split('/');
					dataEmitPrev = new Date(dataEmitPrev[2], dataEmitPrev[1], dataEmitPrev[0]);
	
					if (dataPrev < dataEmitPrev) {
						this.toastr.error('Data de Emissão dessa Nota maior que a Data de Previsão');
						return false;
					}
				}
				
			}
			
		}
		if (this.objFormNewAtendimento.controls['IDA002'].value == 143) {
			if (!this.objFormNewAtendimento.controls['DSOBSERV'].value || this.objFormNewAtendimento.controls['DSOBSERV'].value == '') {
				this.toastr.error('A descrição para esse motivo selecionado é obrigatório');
				return false;
			} else {
				objAux.IDG046 = this.IDG046;
				this.toastr.info('Por conta do motivo selecionado, essa ocorrência irá se replicar para todas as notas dessa carga.');
			}

		}

		for (let obj of this.arrConfigMotivo) {
			if (obj.SNOBRIGA == 1 && !obj.VRCAMPO) {
				this.toastr.error('Campos obrigatórios não preenchidos.');
				return false;
			}
		}

		this.loadingAtendimento = true;

		objAux.ARCONFIG = this.arrConfigMotivo;

		this.atendimentosService.salvarFinalizarNovoAtendimento(objAux).subscribe(
			data => {
			

				if (data.integrador == 1) {
					this.loadingAtendimento = false;
					this.toastr.warning('Não foi possível salvar o atendimento, porque não há cadastro de "Prazo de Entrega" no Integrador.');
				} else {
					

					this.auxIDA001 = data;
					if(this.uploader.queue.length != 0){
						//Essa função serve para que seja feito o upload de apenas um item, no caso o primeiro da fila
						//Os restantes são "embutidos" na função BuildItemForm que acontece antes da chamada do upload.
						this.uploader.uploadItem(this.uploader.queue[0]);
						

					}else{
						this.loadingAtendimento = false;
						if (this.bloqueio) {
							this.toastr.success('Nota Bloqueada com sucesso!');
						} else if (this.desbloqueio) {
							this.toastr.success('Nota Desbloqueada com sucesso!');
						} else {
							this.toastr.success('Atendimento salvo com sucesso.');
						}
						
						
						this.objFormNewAtendimento.reset();
						this.IDG043_arr = [];

						this.movimentarAtendimento(data);

						this.initForm();
					}

				}
			}, err => {
				this.loadingAtendimento = false;
				this.toastr.error('Não foi possível  criar o atendimento.');
			}
		);

		return false;
	}

	salvarAtendimento() {

		for (let obj of this.arrConfigMotivo) {
			if (obj.SNOBRIGA == 1 && !obj.VRCAMPO) {
				this.toastr.error('Campos obrigatórios não preenchidos.');
				return false;
			}
		}

		if (this.objFormNewAtendimento.controls['NMSOLITE'].value != '' &&
			this.objFormNewAtendimento.controls['NMSOLITE'].value != null) {
			
			let IDSOLIDO = localStorage.getItem('ID_USER');
			this.objFormNewAtendimento.controls['IDSOLIDO'].setValue(IDSOLIDO);

			// - Busca todos os tipos de ação
			this.loadingAtendimento = true;

			// - Seta o IDG043
			this.objFormNewAtendimento.controls['IDG043'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.IDG043;
				}
			));
			this.objFormNewAtendimento.controls['CDCTRC'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.CDCTRC;
				}
			));
			this.objFormNewAtendimento.controls['NRNOTA'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.NRNOTA;
				}
			));

			this.simNaoUpload(false);

			let objAux = this.objFormNewAtendimento.value;
			objAux.ARCONFIG = this.arrConfigMotivo;

			this.atendimentosService.salvarNovoAtendimento(objAux).subscribe(
				data => {
					this.auxIDA001 = data;
					
					if(this.uploader.queue.length != 0){
						//Essa função serve para que seja feito o upload de apenas um item, no caso o primeiro da fila
						//Os restantes são "embutidos" na função BuildItemForm que acontece antes da chamada do upload.
						this.uploader.uploadItem(this.uploader.queue[0]);

					}else{
						
						this.loadingAtendimento = false;
						this.toastr.success('Atendimento salvo com sucesso.');
						
						this.objFormNewAtendimento.reset();
						this.IDG043_arr = [];

						this.movimentarAtendimento(data);

						this.initForm();
					}

				}, err => {
					this.loadingAtendimento = false;
					this.toastr.error('Não foi possível  criar o atendimento.');
				}
			);
		} else {
			this.toastr.error('O Campo nome do solicitante é obrigatório');			
		} 

		return false;
	}

	initForm() {
		// - Popula novamente o array de notas fiscais selecionadas
		this.IDG043_arr.push(this.IDG043);
		// - Seta a Nota Fiscal Selecionada no Formulário
		this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043_arr);
		this.objFormNewAtendimento.controls['G043_NRNOTA'].setValue(this.objNfe.NRNOTA);

		// - Workaround - Para selecionar a primeira opção do select
		this.objFormNewAtendimento.controls['IDA002'].setValue(0);
		this.objFormNewAtendimento.controls['IDA008'].setValue(0);
	}




	changeDatesReasonCode(): void {

		// - Seto a váriavel abaixo como false pra saber que o usuário clicou nas datas.
		this.controllerTouchedDataReasonCode = false;

		if (this.vlChangeDatasReasonConde) {

			if (//this.objFormNewAtendimento.controls['DTAGENDA'].untouched &&
				//this.objFormNewAtendimento.controls['DTROTERI'].untouched &&
				//this.objFormNewAtendimento.controls['DTCOMBIN'].untouched &&
				(this.objFormNewAtendimento.controls['DTENTREG'].value == '' || this.objFormNewAtendimento.controls['DTENTREG'].value == null) &&
				(this.objFormNewAtendimento.controls['DTENTPLA'].value == '' || this.objFormNewAtendimento.controls['DTENTPLA'].value == null)) {
				this.controllerTouchedDataReasonCode = true;
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
				this.objFormNewAtendimento.controls['IDA002'].setValue(0);
				this.objFormNewAtendimento.controls['DTROTERI'].setValidators([]);
			}

			this.objFormNewAtendimento.controls['DTAGENDA'].markAsUntouched();
			this.objFormNewAtendimento.controls['DTCOMBIN'].markAsUntouched();

			// Seto o valor da lista de motivos para motivos 3PL
			this.listMotivos = this.motivosListBkp;

			this.vlChangeDatasReasonConde = false;
			this.txtButtonReasonCode = 'Alterar Datas 4PL';
			this.classButtonChangeDatasReasonCode = 'primary';
			this.objFormNewAtendimento.controls['REFDATA'].setValue(0);
			this.selectTipoAcao(1);
			this.objFormNewAtendimento.controls['DTAGENDA'].setValue(this.DTAGENDA);
			this.objFormNewAtendimento.controls['DTENTREG'].setValue('');
			this.objFormNewAtendimento.controls['DTENTPLA'].setValue('');
			this.objFormNewAtendimento.controls['DTROTERI'].setValue(this.DTROTERI);
			this.objFormNewAtendimento.controls['DTCOMBIN'].setValue(this.DTCOMBIN);
			this.objFormNewAtendimento.controls['DTPRECOR'].setValue('');
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
			this.objFormNewAtendimento.controls['IDS001DE'].enable();
			this.objFormNewAtendimento.controls['IDA002'].enable();
		} else {
			this.vlChangeDatasReasonConde = true;
			this.txtButtonReasonCode = 'Cancelar mudança de datas';
			this.classButtonChangeDatasReasonCode = 'danger';

			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Alteração de Datas 4PL');
			this.objFormNewAtendimento.controls['IDS001DE'].disable();
			if (this.bloqueio) {
				this.objFormNewAtendimento.controls['IDA002'].setValue(47);
			} else if (this.desbloqueio) {
				this.objFormNewAtendimento.controls['IDA002'].setValue(48);
			} else {
				this.selectTipoAcao('');
				// Seto o valor da lista de motivos para os motivos 4PL
				//this.listMotivos = this.motivosList4PL;

				let tipoAcaoSelecionadoAux = this.objFormNewAtendimento.controls['IDA008'].value
				this.listMotivos = this.motivosList4PL.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionadoAux;
				});

				this.objFormNewAtendimento.controls['IDA002'].setValue('');
				this.objFormNewAtendimento.controls['REFDATA'].setValue(1);
				//this.objFormNewAtendimento.controls['IDA002'].disable();
			}
			// - Show Loader
			//this.utilServices.loadGridShow();
			// - Busca todas as informações necessárias
			//this.listDatesAtendimento();
		}
	}

	
	salvarFinalizarAtendimentoReasonCode() {

		//Validações de alteração de data 4PL
		//########################################################################################
		// valida nome do solicitante
		if (this.objFormNewAtendimento.controls['NMSOLITE'].value == '' ||
			this.objFormNewAtendimento.controls['NMSOLITE'].value == null) {
			this.toastr.error('O campo nome do solicitante é obrigatório.');
			return false;
		}
		//########################################################################################
		// valida se os campos estão vazios
		if ( (this.objFormNewAtendimento.controls['DTENTPLA'].value == '' ||
			  this.objFormNewAtendimento.controls['DTENTPLA'].value == null) 
			  && 
			  (this.objFormNewAtendimento.controls['DTENTREG'].value == '' ||
			   this.objFormNewAtendimento.controls['DTENTREG'].value == null) 
			) {
			this.toastr.error('Informe uma data para continuar.');
			return false;
		}
		//########################################################################################
		// valida se as duas datas estão setadas ao mesmo tempo
		if ( (this.objFormNewAtendimento.controls['DTENTPLA'].value != '' 
			  && this.objFormNewAtendimento.controls['DTENTPLA'].value != undefined) 
			  && 
			  (this.objFormNewAtendimento.controls['DTENTREG'].value != '' 
			   && this.objFormNewAtendimento.controls['DTENTREG'].value != undefined) 
			) {
			this.toastr.error('Informa apenas a Data Entrega ou Data Entrega Planejada.');
			return false;
		}
		//########################################################################################
		//valida status da carga, para ambas as datas
		if(this.STCARGA == 'C'){
			this.toastr.error('A carga não está ativa');
			return false;
		}

		if(this.CDCARGA == null || this.CDCARGA == ''){
			this.toastr.error('Nota sem carga vinculada.');
			return false;
		}
		/*
			Validações para alteração de entrega planejada
		*/
		if (this.objFormNewAtendimento.controls['DTENTPLA'].value != '' 
			&& this.objFormNewAtendimento.controls['DTENTPLA'].value != undefined) {
			
			let dataPlanejada = this.objFormNewAtendimento.controls['DTENTPLA'].value.split('/');
			dataPlanejada = new Date(dataPlanejada[2], dataPlanejada[1], dataPlanejada[0]);
			
			if (Array.isArray(this.listNfeSelecionadas) && this.listNfeSelecionadas.length > 1) {
				let auxErrPrev = null;
				for (let i = 0; i < this.listNfeSelecionadas.length; i++) {

					let auxDataEmitPrev = this.listNfeSelecionadas[i].DTEMINOT.split('/');
					auxDataEmitPrev = new Date(auxDataEmitPrev[2], auxDataEmitPrev[1], auxDataEmitPrev[0]);

					auxErrPrev = null;

					if (dataPlanejada < auxDataEmitPrev) {
						auxErrPrev = 'Data de Emissão da Nota ' + this.listNfeSelecionadas[i].NRNOTA + ' maior que a Data Planejada';
						break;
					}

				}
				if (auxErrPrev != null) {
					this.toastr.error(auxErrPrev);
					return false;
				}
			} else {
				//#########################################################################################
				//Validação para bloquear incompatibilidade de dados na criação do atendimento
				let dataEmitPrev = this.DTEMINOT.split('/');
				dataEmitPrev = new Date(dataEmitPrev[2], dataEmitPrev[1], dataEmitPrev[0]);

				if (dataPlanejada < dataEmitPrev) {
					this.toastr.error('Data de Emissão dessa Nota maior que a Data Planejada');
					return false;
				}
			}
			//########################################################################################
			//valida se o CTE estiver cancelado, não deixar altera data planejada
			if(this.STCTRC == 'C' && (this.objFormNewAtendimento.controls['DTENTPLA'].value != '' 
				  && this.objFormNewAtendimento.controls['DTENTPLA'].value != undefined)){
				this.toastr.error('O CTE já está cancelado, não é possivel alterar Data Entrega Planejada.');
				return false;
			}
			//########################################################################################
			//obrigar informar motivos ao alterar datas
			if (this.objFormNewAtendimento.controls['IDA002'].value == '' ||
				this.objFormNewAtendimento.controls['IDA002'].value == null) {
				this.toastr.error('O motivo é obrigatório.');
				return false;
			}
			//########################################################################################
			//valida se a nota está com CTE vinculado
			if(this.SNCTEVIN != 'S'){
				this.toastr.error('Nota sem conhecimento vinculado.');
				return false;
			}
			//########################################################################################
			//Validar ASN se já foi gerado G048.STINTCLI > 0
			if(this.ASNINTCL != null && Number(this.ASNINTCL) == 0){
				this.toastr.error('ASN não gerado.');
				return false;
			}
		}// fim das validações de alteração de entrega planejada

		/*
			Validações para alteração data de entrega
		*/
		if(this.objFormNewAtendimento.controls['DTENTREG'].value != '' 
		   && this.objFormNewAtendimento.controls['DTENTREG'].value != undefined){


			//########################################################################################
			//validação para a data de entrega não ser maior que a data atual

			let dtAtual = new Date().setHours(0,0,0,0);

			let dtEntreg = this.utilServices.parseDate(this.objFormNewAtendimento.controls['DTENTREG'].value);

			if (dtEntreg.getTime() > dtAtual) {
				this.loadingAtendimento = false;
				this.toastr.error('A data de entrega não pode ser maior que a data atual.');
				return false;
			}

		   	//########################################################################################
			//valida se o CTE estiver cancelado, não deixar altera data planejada
			if(this.STCTRC == 'C' && (this.objFormNewAtendimento.controls['DTENTREG'].value != '' 
				  && this.objFormNewAtendimento.controls['DTENTREG'].value != undefined)){
				this.toastr.error('O CTE já está cancelado, não é possivel alterar Data de Entrega.');
				return false;
			}
			//##################################################################################
			//tratativa para ver se existe algum CTE/NF selecionado que tenha data SLA diferente do CTE usado para criar o atendimento
			let dataEntrega = this.objFormNewAtendimento.controls['DTENTREG'].value.split('/');
			dataEntrega = new Date(dataEntrega[2], dataEntrega[1], dataEntrega[0]);
			//motivo 40 - Atraso do Transportador
			//motivo 50 - Entrega Normal
			//motivo 51 - Entrega Antecipada
			
			if (Array.isArray(this.listNfeSelecionadas) && this.listNfeSelecionadas.length > 1) {
				let auxErr = null;
				for (let i = 0; i < this.listNfeSelecionadas.length; i++) {
					let auxDataSLA = this.listNfeSelecionadas[i].DTENTCON.split('/');
					auxDataSLA = new Date(auxDataSLA[2], auxDataSLA[1], auxDataSLA[0]);

					let auxDataEmit = this.listNfeSelecionadas[i].DTEMINOT.split('/');
					auxDataEmit = new Date(auxDataEmit[2], auxDataEmit[1], auxDataEmit[0]);
					
					auxErr = null;

					if ((this.objFormNewAtendimento.controls['IDA002'].value == 51 || this.objFormNewAtendimento.controls['IDA002'].value == 50) && dataEntrega > auxDataSLA) {
						auxErr = 'Data SLA do CT-e ' + this.listNfeSelecionadas[i].CDCTRC + ' incoerente para o motivo inserido';
						break;
					}
	
					if ((this.objFormNewAtendimento.controls['IDA002'].value == 40 || this.objFormNewAtendimento.controls['IDA002'].value == 51) && this.listNfeSelecionadas[i].DTENTCON == this.objFormNewAtendimento.controls['DTENTREG'].value) {
						auxErr = 'Data SLA do CT-e ' + this.listNfeSelecionadas[i].CDCTRC + ' incoerente para o motivo inserido';
						break;
					}
	
					if ((this.objFormNewAtendimento.controls['IDA002'].value == 40 || this.objFormNewAtendimento.controls['IDA002'].value == 50) && dataEntrega < auxDataSLA) {
						auxErr = 'Data SLA do CT-e ' + this.listNfeSelecionadas[i].CDCTRC + ' incoerente para o motivo inserido';
						break;
					}

					if (dataEntrega < auxDataEmit) {
						auxErr = 'Data de Emissão da Nota ' + this.listNfeSelecionadas[i].NRNOTA + ' maior que a Data de Entrega';
						break;
					}
				}
				if (auxErr != null) {
					this.toastr.error(auxErr);
					return false;
				}
			} else {
				//#########################################################################################
				//Validação para bloquear incompatibilidade de dados na criação do atendimento
				let dataSLA = this.DTENTCON.split('/');
				dataSLA = new Date(dataSLA[2], dataSLA[1], dataSLA[0]);

				let dataEmit = this.DTEMINOT.split('/');
				dataEmit = new Date(dataEmit[2], dataEmit[1], dataEmit[0]);

				if ((this.objFormNewAtendimento.controls['IDA002'].value == 51 || this.objFormNewAtendimento.controls['IDA002'].value == 50) && dataEntrega > dataSLA) {
					this.toastr.error('Motivo incoerente com a data de entrega informada');
					return false;
				}

				if ((this.objFormNewAtendimento.controls['IDA002'].value == 40 || this.objFormNewAtendimento.controls['IDA002'].value == 51) && this.DTENTCON == this.objFormNewAtendimento.controls['DTENTREG'].value) {
					this.toastr.error('Motivo incoerente com a data de entrega informada');
					return false;
				}

				if ((this.objFormNewAtendimento.controls['IDA002'].value == 40 || this.objFormNewAtendimento.controls['IDA002'].value == 50) && dataEntrega < dataSLA) {
					this.toastr.error('Motivo incoerente com a data de entrega informada');
					return false;
				}

				if (dataEntrega < dataEmit) {
					this.toastr.error('Data de Emissão dessa Nota maior que a Data de Entrega');
					return false;
				}
			}

			//########################################################################################
			


		}// fim das validações de alteração data de entrega

		for (let obj of this.arrConfigMotivo) {
			if (obj.SNOBRIGA == 1 && !obj.VRCAMPO) {
				this.toastr.error('Campos obrigatórios não preenchidos.');
				return false;
			}
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
			this.objFormNewAtendimento.controls['IDG051'].setValue(this.listNfeSelecionadas.map(
				function (el) {
					return el.IDG051;
				}
			));
		} else {
			this.objFormNewAtendimento.controls['IDG043'].setValue(this.IDG043);
		}
		

		var objAux: any;

		objAux = this.objFormNewAtendimento.getRawValue();
		objAux.CDCARGA  = this.CDCARGA;
		objAux.ARCONFIG = this.arrConfigMotivo;
		
		//debugger;
		
		this.atendimentosService.salvarFinalizarNovoAtendimentoReasonCode(objAux).subscribe(
			data => {
				if (data.integrador == 1) {
					this.loadingAtendimento = false;
					this.toastr.warning('Não foi possível salvar o atendimento, porque não há cadastro de "Prazo de Entrega" no Integrador.');
				} else {
					this.loadingAtendimento = false;
					this.toastr.success('Atendimento salvo com sucesso.');
					this.auxIDA001 = data;
					this.objFormNewAtendimento.reset();
					this.IDG043_arr = [];

					this.movimentarAtendimento(data);

					this.initForm();
					// if(this.uploader.queue.length != 0){
					// 	this.uploader.uploadAll();
					// }
				}
			}, err => {
				console.log(err);
				if (err.error == '1') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois o invoice não foi enviado');
				} else if (err.error == '2') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois está pendente de Pré ASN');
				}else if (err.error == '3') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Previsão de coleta');
				}else if (err.error == '4') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Previsão de entrega');
				}else if (err.error == '5') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Confirmação de coleta');
				}else if (err.error == '6') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Contato com o cliente');
				}else if (err.error == '7') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Previsão de entrega no cliente');
				}else if (err.error == '8') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Previsão de entrega no CD');
				}else if (err.error == '9') {
					this.toastr.error('Não foi possivel alterar a data de entrega pois não foi enviado o milestone de Confirmação de coleta no cliente');
				} else {
					this.toastr.error('Não foi possível  criar o atendimento.');
				}
				this.loadingAtendimento = false;
				
			}
		);

		return false;
	}

	
	openModalAnexoOcorrencia() : void {
		this.modal.open(this.modalAnexoOcorrencia,{ size: 'lg' });
	}
	openModalViewAnexoOcorrencia() : void {
		this.carregando = true;
		this.modal.open(this.modalViewAnexoOcorrencia,{ size: 'lg', windowClass: 'modal-adaptive' });
		this.listArquivos = new Array();
		this.atendimentosService.visualizarAnexo({IDA001: this.IDA001}).subscribe(
			data => {
				this.carregando = false;
				this.listArquivos = data;
			}
		);
	}

	downloadArquivo(selected){
		return this.atendimentosService.downloadAnexo({IDA004: selected.IDA004}).subscribe(data => {
			console.log('receipt data');
			console.log(data);
			
			let url = window.URL.createObjectURL(data);
			var link = document.createElement('a');
			link.href = url;
			link.download = 'Anexo';
			link.dispatchEvent(new MouseEvent('click'));

		});
	}

	// - Função para fechar o modal de anexos em ocorrências
	closeAnexoOcorrencia(): void {
		this.modal.closeModal();
	}

	//Essa função verifica se o atendimento foi finalizado e se há arquivos para upload
	simNaoUpload(finaliza){
		if(finaliza){
			this.objFormNewAtendimento.controls['SNFINALIZA'].setValue('Finalizado');
		}else{
			this.objFormNewAtendimento.controls['SNFINALIZA'].setValue('Aberto');
		}

		if(this.uploader.queue.length != 0){
			this.objFormNewAtendimento.controls['SNUPLOAD'].setValue(true);
		}else{
			this.objFormNewAtendimento.controls['SNUPLOAD'].setValue(false);
		}

	}

	//Entra aqui quando o upload é concluído
	private handleUploadComplete() {


		// debugger;

	    let arObj = [];
	    for(let item of this.uploader.queue){
	      if(!item.isSuccess){
	        arObj.push(item);
	      }
	    }
	    this.uploader.queue = arObj;
	    if (this.uploadResult.success) {

			this.loadingAtendimento = false;
			if (this.bloqueio) {
			this.toastr.success('Nota Bloqueada com sucesso!');
			} else if (this.desbloqueio) {
				this.toastr.success('Nota Desbloqueada com sucesso!');
			} else {
				this.toastr.success('Atendimento salvo com sucesso.');
			}

			this.objFormNewAtendimento.reset();
			this.IDG043_arr = [];

			this.movimentarAtendimento(this.auxIDA001);

			this.initForm();

			//this.router.navigate(['cte/importar']);
			// this.accordionIndex = '1';
	    } else {
			this.loadingAtendimento = false;
			this.toastr.error('Não foi possível  realizar o upload.');
	    }
	}

	recusaNotas(): void {

		this.controllerTouchedRecusaNota = false;


		if (this.vlRecusaNotas) {

			if (this.objFormNewAtendimento.controls['DTAGENDA'].untouched &&
				this.objFormNewAtendimento.controls['DTROTERI'].untouched &&
				this.objFormNewAtendimento.controls['DTENTREG'].untouched &&
				this.objFormNewAtendimento.controls['DTENTPLA'].untouched &&
				this.objFormNewAtendimento.controls['DTCOMBIN'].untouched) {
				this.controllerTouchedRecusaNota = true;
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
				this.objFormNewAtendimento.controls['IDA002'].setValue(0);
				this.objFormNewAtendimento.controls['DTROTERI'].setValidators([]);
			}

		
			this.objFormNewAtendimento.controls['DTAGENDA'].markAsUntouched();
			this.objFormNewAtendimento.controls['DTCOMBIN'].markAsUntouched();

			// Seto o valor da lista de motivos para motivos 3PL
			this.listMotivos = this.motivosListBkp;

			this.showRecusaInfo = false;
			this.vlRecusaNotas = false;
			this.txtButtonRecusa = 'Recusar Notas';
			this.classButtonRecusaNotas = 'primary';
			this.objFormNewAtendimento.controls['REFDATA'].setValue(0);
			this.selectTipoAcao(1);
			this.objFormNewAtendimento.controls['NRPROTOC'].setValue('');
			this.objFormNewAtendimento.controls['SNDEVNOT'].setValue('');
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
			this.objFormNewAtendimento.controls['IDS001DE'].enable();
			this.objFormNewAtendimento.controls['IDA002'].enable();
		} else {
			this.showRecusaInfo = true;
			this.vlRecusaNotas = true;
			this.txtButtonRecusa = 'Cancelar recusa de notas';
			this.classButtonRecusaNotas = 'danger';

			if(this.TPMODCAR == 2 || this.TPMODCAR == 3){
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Alteração de Datas 4PL');
				this.objFormNewAtendimento.controls['IDS001DE'].disable();
				
				this.selectTipoAcao('');
				// Seto o valor da lista de motivos para os motivos 4PL
				//this.listMotivos = this.motivosList4PL;
				
				let tipoAcaoSelecionadoAux = this.objFormNewAtendimento.controls['IDA008'].value
				this.listMotivos = this.motivosList4PL.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionadoAux;
				});
	
				this.objFormNewAtendimento.controls['IDA002'].setValue('');
				this.objFormNewAtendimento.controls['REFDATA'].setValue(1);
				//this.objFormNewAtendimento.controls['IDA002'].disable();
			} else {
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Recusa 3PL');
				this.objFormNewAtendimento.controls['IDS001DE'].disable();
				
				this.selectTipoAcao('');

				let tipoAcaoSelecionadoAux = this.objFormNewAtendimento.controls['IDA008'].value
				this.listMotivos = this.motivosListBkp.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionadoAux;
				});
	
				this.objFormNewAtendimento.controls['IDA002'].setValue(141);
				this.objFormNewAtendimento.controls['IDA002'].disable();
				this.objFormNewAtendimento.controls['REFDATA'].setValue(1);
			}

			
			
			
		}
	}


		salvarFinalizarAtendimentoRecusa() {

		//Validações de alteração de data 4PL
		//########################################################################################
		// valida nome do solicitante
		if (this.objFormNewAtendimento.controls['NMSOLITE'].value == '' ||
			this.objFormNewAtendimento.controls['NMSOLITE'].value == null) {
			this.toastr.error('O campo nome do solicitante é obrigatório.');
			return false;
		}
		
		//########################################################################################
		//valida status da carga, para ambas as datas
		if(this.STCARGA == 'C'){
			this.toastr.error('A carga não está ativa');
			return false;
		}

		//########################################################################################
		//obrigar informar motivos ao alterar datas
		if (this.objFormNewAtendimento.controls['IDA002'].value == '' ||
			this.objFormNewAtendimento.controls['IDA002'].value == null) {
			this.toastr.error('O motivo é obrigatório.');
			return false;
		}
		//########################################################################################
		//valida se a nota está com CTE vinculado
		if(this.SNCTEVIN != 'S'){
			this.toastr.error('Nota sem conhecimento vinculado.');
			return false;
		}

		if(this.CDCARGA == null || this.CDCARGA == ''){
			this.toastr.error('Nota sem carga vinculada.');
			return false;
			}
			
		for (let obj of this.arrConfigMotivo) {
			if (obj.SNOBRIGA == 1 && !obj.VRCAMPO) {
				this.toastr.error('Campos obrigatórios não preenchidos.');
				return false;
			}
		}

		if (this.TPMODCAR == 2 || this.TPMODCAR == 3) {
			if (this.objFormNewAtendimento.controls['NRPROTOC'].value == '' || this.objFormNewAtendimento.controls['NRPROTOC'].value == null) {
				this.toastr.error('O número do protocolo é obrigatório');
				return false;
			}
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
			
		if (this.TPMODCAR == 2 || this.TPMODCAR == 3) {
			this.objFormNewAtendimento.controls['SNSYNGENTA'].setValue(1);
		} else {
			this.objFormNewAtendimento.controls['SNSYNGENTA'].setValue(0);
		}
		

		var objAux: any;

		objAux = this.objFormNewAtendimento.getRawValue();
		objAux.CDCARGA = this.CDCARGA;
			
		objAux.ARCONFIG = this.arrConfigMotivo;
		
		this.atendimentosService.salvarFinalizarNovoAtendimentoRecusa(objAux).subscribe(
			data => {
					this.loadingAtendimento = false;
					this.toastr.success('Atendimento salvo com sucesso.');
					this.auxIDA001 = data;
					this.objFormNewAtendimento.reset();
					this.IDG043_arr = [];

					this.movimentarAtendimento(data.idAtendimento);

					this.initForm();
					// this.uploader.uploadAll();
				
			}, err => {
				this.loadingAtendimento = false;
				this.toastr.error('Não foi possível  criar o atendimento.');
			}
		);

		return false;
	}

	cancelaRecusa(): void {

		this.controllerTouchedCancelaRecusa = false;


		if (this.vlCancelaRecusa) {

			if (this.objFormNewAtendimento.controls['DTAGENDA'].untouched &&
				this.objFormNewAtendimento.controls['DTROTERI'].untouched &&
				this.objFormNewAtendimento.controls['DTENTREG'].untouched &&
				this.objFormNewAtendimento.controls['DTENTPLA'].untouched &&
				this.objFormNewAtendimento.controls['DTCOMBIN'].untouched) {
				this.controllerTouchedCancelaRecusa = true;
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
				this.objFormNewAtendimento.controls['IDA002'].setValue(0);
				this.objFormNewAtendimento.controls['DTROTERI'].setValidators([]);
			}

		
			this.objFormNewAtendimento.controls['DTAGENDA'].markAsUntouched();
			this.objFormNewAtendimento.controls['DTCOMBIN'].markAsUntouched();

			// Seto o valor da lista de motivos para motivos 3PL
			this.listMotivos = this.motivosListBkp;

			this.showCancelaRecusaInfo = false;
			this.vlCancelaRecusa = false;
			this.txtButtonCancelaRecusa = 'Cancelar Recusa';
			this.classButtonCancelaRecusaNotas = 'primary';
			this.objFormNewAtendimento.controls['REFDATA'].setValue(0);
			this.selectTipoAcao(1);
			this.objFormNewAtendimento.controls['NRPROTOC'].setValue('');
			this.objFormNewAtendimento.controls['SNDEVNOT'].setValue('');
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
			this.objFormNewAtendimento.controls['IDS001DE'].enable();
			this.objFormNewAtendimento.controls['IDA002'].enable();
		} else {
			this.showCancelaRecusaInfo = true;
			this.vlCancelaRecusa = true;
			this.txtButtonCancelaRecusa = 'Cancelar o cancelamento da Recusa';
			this.classButtonCancelaRecusaNotas = 'danger';

			if (!this.SNREC3PL) {

				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Cancelamento de Recusa 4PL');
				this.objFormNewAtendimento.controls['IDS001DE'].disable();
				
				this.selectTipoAcao('');
				// Seto o valor da lista de motivos para os motivos 4PL
				//this.listMotivos = this.motivosList4PL;
				
				let tipoAcaoSelecionadoAux = this.objFormNewAtendimento.controls['IDA008'].value
				this.listMotivos = this.motivosList4PL.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionadoAux;
				});

				this.objFormNewAtendimento.controls['IDA002'].setValue(130);
				this.objFormNewAtendimento.controls['IDA002'].disable();
				this.objFormNewAtendimento.controls['REFDATA'].setValue(1);

			} else {
				this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Cancelamento de Recusa 3PL');
				this.objFormNewAtendimento.controls['IDS001DE'].disable();
				
				this.selectTipoAcao('');

				let tipoAcaoSelecionadoAux = this.objFormNewAtendimento.controls['IDA008'].value
				this.listMotivos = this.motivosListBkp.filter(
				function (obj) {
					return obj.IDA008 == tipoAcaoSelecionadoAux;
				});
	
				this.objFormNewAtendimento.controls['IDA002'].setValue(142);
				this.objFormNewAtendimento.controls['IDA002'].disable();
				this.objFormNewAtendimento.controls['REFDATA'].setValue(1);
				
			}
			
			
		}
	}

	cancelamentoRecusa() {
		this.loadingAtendimento = true;

		let objParams = {
			IDG043: this.IDG043,
			IDA002: this.objFormNewAtendimento.controls['IDA002'].value,
			IDSOLIDO: localStorage.getItem('ID_USER'),
			SNSYNGENTA: this.SNREC3PL ? false : true
		}

		this.atendimentosService.cancelarRecusa(objParams).subscribe(
			data => {
				console.log(data);
				this.toastr.success('Recusa Cancelada com Sucesso');
				this.objFormNewAtendimento.reset();
				this.IDG043_arr = [];
				this.loadingAtendimento = false;
				this.initForm();

				console.log(data.idAtendimento);

				this.movimentarAtendimento(data);
			},
			err => {
				console.log(err);
				this.loadingAtendimento = false;
				this.toastr.error('Erro ao Cancelar a Recusa');
			}
		)
	}

	setMarkBlock() {
		if (this.vlMarkBloque) {
			this.vlMarkBloque = false;
			this.txtButtonMarkBlock = 'Manter SLA';
			this.classButtonMarkBlock = 'primary';
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Bloqueio de Nota Fiscal por: ');
			this.objFormNewAtendimento.controls['MANTESLA'].setValue('');
	
		} else {
			this.vlMarkBloque = true;
			this.txtButtonMarkBlock = 'Cancelar Ação';
			this.classButtonMarkBlock = 'danger';
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Bloqueio de Nota Fiscal mantendo a SLA original por: ');
			this.objFormNewAtendimento.controls['MANTESLA'].setValue('S');
		}
	}

	changeDataEntregaRemove(): void {

		this.controllerTouchedDataRemove = false;

		if (this.vlRemoveEntrega) {
			let tipoAcaoSelecionado = this.objFormNewAtendimento.controls['IDA002'].value;
			this.controllerTouchedDataRemove = true;
			this.vlRemoveEntrega = false;
			this.txtButtonRemoveEntrega = 'Remover Data de Entrega';
			this.classButtonRemoveEntrega = 'primary';
			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('');
			this.objFormNewAtendimento.controls['IDS001DE'].enable();
			this.objFormNewAtendimento.controls['IDA002'].setValue('');
			this.objFormNewAtendimento.controls['IDA002'].enable();
		} else {
			this.vlRemoveEntrega = true;
			this.txtButtonRemoveEntrega = 'Cancelar remoção';
			this.classButtonRemoveEntrega = 'danger';

			this.objFormNewAtendimento.controls['DSOBSERV'].setValue('Remoção da data de entrega');
			this.objFormNewAtendimento.controls['IDS001DE'].disable();
			this.objFormNewAtendimento.controls['IDA002'].setValue(136);
			this.objFormNewAtendimento.controls['IDA002'].disable();
		}
	}
	removerDataEntrega() {
		// valida nome do solicitante
		if (this.objFormNewAtendimento.controls['NMSOLITE'].value == '' ||
			this.objFormNewAtendimento.controls['NMSOLITE'].value == null) {
			this.toastr.error('O campo nome do solicitante é obrigatório.');
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

		this.atendimentosService.salvarRemocaoEntrega(objAux).subscribe(
			data => {
					this.loadingAtendimento = false;
					this.toastr.success('Atendimento salvo com sucesso.');
					this.auxIDA001 = data;
					this.objFormNewAtendimento.reset();
					this.IDG043_arr = [];

					this.movimentarAtendimento(data);

					this.initForm();
				
			}, err => {
				console.log(err);
				this.loadingAtendimento = false;
				
			}
		);

	}

	selecionaMotivo(event) {
		let idMotivo = this.objFormNewAtendimento.controls['IDA002'].value;
		this.arrConfigMotivo = (idMotivo) ? this.listMotivos.filter(mot => mot.IDA002 == idMotivo)[0]['ARCONFIG'] : [];
	}

}
