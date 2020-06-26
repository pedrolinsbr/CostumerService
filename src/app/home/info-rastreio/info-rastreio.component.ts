import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { InformacoesRastreio } from '../../models/informacoes-rastreio.model';
import { ModalComponent} from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { ValidaMilestone } from '../../models/valida-milestone.model';

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { GlobalsServices } from '../../shared/componentesbravo/src/app/services/globals.services';
import { ToastrService } from 'ngx-toastr';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { SingleFornecedorSyngentaComponent } from '../../shared/componentesbravo/src/app/componentes/filter/single-fornecedor-syngenta/single-fornecedor-syngenta.component';


@Component({
	selector: 'app-info-rastreio',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './info-rastreio.component.html',
	styleUrls: ['./info-rastreio.component.css']
})
export class InfoRastreioComponent implements OnInit {

	private global = new GlobalsServices();
	//url = this.global.getApiHost();

	token = localStorage.getItem('token');

	@Input('resumido') resumido: boolean;
	@Input() validaMilestone: ValidaMilestone = {
		SNHABCOL:	0
	};
	@Input() objRastreio: InformacoesRastreio = {
		DTEMINOT: 	'',
		DTEMICTR:	'',
		DTENTCON:	'',
		DTCOLETA: 	'',
		DTPREENT:   '',
		DTENTREG:   '',
		DTBLOQUE:	'',
		DTDESBLO:	'',
		TXCANHOT:	'',
		IDG043: '',
		DTSAICAR: '',
		TPDELIVE: 0
	};	

	@Input() validaHome: boolean = false;
	@Input() numNF;
	@Input() syngenta:boolean = false;
	@ViewChild('modalUploadCanhoto') private modalUploadCanhoto;
	@ViewChild('modalConfirmaExclusao') private modalConfirmaExclusao;
	@Input() arCanhoto: number;
	@Input() validaAg: boolean = false;

	UrlEvt = localStorage.getItem('URL_EVT');
	url = this.global.getApiHost();

	UrlBuscarCanhoto = this.UrlEvt + 'xml/canhoto/img/';

	private classOne: 	string = '';
	private classTwo: 	string = '';
	private classThree: string = '';
	private classFour: 	string = '';
	private uploadResult: any = null;

	private labelFour:	string = 'Previsão de Entrega';

	//Lista de canhotos
	private listCanhoto = [];

	private carregando:boolean = true;

	public loadingModal = false;

	auxList: boolean = false;

	public IDS001 = '';

	public objSelected;

	uploader: FileUploader = new FileUploader({
		url: this.url + 'file/monitoria/upload/canhoto?token='+this.token,
		method: 'put', 
		additionalParameter: 
		{
			TPDOCUME: 'CTO',
			NMTABELA: 'G043',
			IDS001: localStorage.getItem('ID_USER')},
		isHTML5: true,
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

	constructor(
			private modal : ModalComponent,
			private toastr: ToastrService,
			private deliveryNfService: DeliverysNfService
		) {		
		this.classOne = '';
		this.classTwo = '';
		this.classThree = '';
		this.classFour = '';

		 this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
			 form.append('PKS007', this.objRastreio.IDG043);
			 this.loadingModal = true;
		}

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
			this.handleUploadComplete();
		  };
	}

	ngOnInit() {
		if (this.objRastreio == undefined || this.validaMilestone == undefined) {
			this.init();
		}
	}

	init() {
		this.validaMilestone = {
			SNHABCOL:	0
		}
		this.objRastreio = {
			DTEMINOT: 	'',
			DTEMICTR:	'',
			DTENTCON:	'',
			DTCOLETA: 	'',
			DTPREENT:   '',
			DTENTREG:   '',
			DTBLOQUE:	'',
			DTDESBLO:	'',
			TXCANHOT:	'',
			IDG043: '',
			DTSAICAR: '',
			TPDELIVE: 0
		};
	}

	openModalUploadCanhoto() : void {
		this.modal.open(this.modalUploadCanhoto,{ size: 'lg', windowClass: 'modal-adaptive' });
		this.getInfoCanhoto(this.objRastreio.IDG043, false);
	}

	openModalConfirmacao(selected) : void {
		this.objSelected = selected;
		this.closeModal();
		this.modal.open(this.modalConfirmaExclusao,{ size: 'lg', windowClass: 'modal-adaptive' });
	}


	closeModal(): void {
		this.modal.closeModal();
	}

	private handleUploadComplete() {
	    let arObj = [];
	    //console.log(this.uploader.queue)
	    for(let item of this.uploader.queue){
	      if(!item.isSuccess){
	        arObj.push(item);
	      }
	    }
	    this.uploader.queue = arObj;
	    if (this.uploadResult.success) {
				//this.loadingModal = false;
				this.toastr.success('Canhoto(s) importado(s) com sucesso.');
				this.getInfoCanhoto(this.objRastreio.IDG043, true);
	      //this.router.navigate(['cte/importar']);
	      // this.accordionIndex = '1';
	    } else {
				this.loadingModal = false;
				console.log(this.uploadResult);
	      this.toastr.error(this.uploadResult.response);
		}
		
	}

	downloadCanhoto(selected){
		let objParam = {
			NMTABELA: selected.NMTABELA,
			PKS007: selected.PKS007,
			STDOCUME: selected.STDOCUME,
			TPDOCUME: selected.TPDOCUME,
			IDG082: selected.IDG082
		}
		debugger;
		if(objParam.IDG082 != undefined && objParam.IDG082 != '') {
			this.deliveryNfService.downloadCanhoto(objParam).subscribe(
				data => {
	
					console.log('receipt data');
					console.log(data);
					
					let url = window.URL.createObjectURL(data);
					var link = document.createElement('a');
					link.href = url;
					link.download = 'Canhoto';
					link.dispatchEvent(new MouseEvent('click'));
				}, err => {
					this.toastr.error('Não foi possível realizar a operação');
				}
			)
		} else {
			this.deliveryNfService.downloadCanhotoCTE(objParam.PKS007).subscribe(
				data => {
	
					console.log('receipt data');
					console.log(data);
					
					let url = window.URL.createObjectURL(data);
					var link = document.createElement('a');
					link.href = url;
					link.download = 'Canhoto';
					link.dispatchEvent(new MouseEvent('click'));
				}, err => {
					this.toastr.error('Não foi possível realizar a operação');
				}
			)
		}

	}

	removerCanhoto(selected){

		this.loadingModal = true;
		this.auxList = false;

		let objParam = {
			NMTABELA: selected.NMTABELA,
			PKS007: selected.PKS007,
			STDOCUME: selected.STDOCUME,
			TPDOCUME: selected.TPDOCUME,
			IDG082: selected.IDG082
		}

		this.deliveryNfService.removerCanhoto(objParam).subscribe(
			data => {
				console.log(data);
				this.loadingModal = false;
				this.auxList = true;
				this.toastr.success('Arquivo removido com sucesso');
				if(this.auxList){
					this.arCanhoto -= 1;
					// this.getInfoCanhoto(selected.PKS007);
					this.closeModal();
				}
				
				
			}, err => {
				this.loadingModal = false;
				this.auxList = false;
				this.closeModal();
				this.toastr.error('Não foi possível realizar a operação');
			}
		)
	}

	getInfoCanhoto(IDG043, auxGeraXML){
		this.listCanhoto = new Array();

		let objParam = {
			NMTABELA: 'G043',
			PKS007: IDG043,
			TPDOCUME: 'CTO'
		}

		this.carregando = true;
		this.deliveryNfService.visualizarCanhoto(objParam).subscribe(
			data => {
				this.listCanhoto = data;
				this.arCanhoto = this.listCanhoto.length;
				if (this.listCanhoto.length > 0 && auxGeraXML == true && this.syngenta && this.objRastreio.TPDELIVE != 5) {
					
					this.gerarXML(this.listCanhoto);
					
				} else {
					this.loadingModal = false;
				}

				this.carregando = false;

			}, err => {
				this.toastr.error('Não foi possível realizar a listagem de canhotos');
			}
		);
	}

	gerarXML(listCanhoto){

		//this.loadingModal = true;
		console.log(listCanhoto);

		for (let i = 0; i < listCanhoto.length; i++) {
			let objParam = {
				IDG043: listCanhoto[i].PKS007
			}
	
			this.deliveryNfService.gerarXML(objParam).subscribe(
				data => {
					console.log(data);

					if ((i == (listCanhoto.length - 1)) && this.loadingModal) {
						this.loadingModal = false;
						this.toastr.success('XML(s) gerado(s) com sucesso!');
					}
					
				}, err => {
					this.loadingModal = false;
					console.log('entrei aki');
					this.removerCanhoto(listCanhoto[i]);
					this.toastr.error('Não foi possível gerar o XML');
				}
			)

			if (!this.loadingModal) {
				break;
			}
		}

	}

	validaUsuario(){
		this.IDS001 = localStorage.getItem('ID_USER');
		console.log(this.IDS001);

		if(this.IDS001 != '' && this.IDS001 != null && this.IDS001 != undefined){
			this.uploader.uploadAll();
		}else{
			this.toastr.error('Erro ao buscar o atual usuário');
		}
	}
	
}
