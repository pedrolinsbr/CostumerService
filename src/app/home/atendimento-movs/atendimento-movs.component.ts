import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators, PatternValidator } from '@angular/forms';
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';

// - Services da Aplicação
import { AtendimentosService } from '../../services/crud/atendimentos.service';
import { ToastrService } from 'ngx-toastr';

// - Models da Aplicação
import { MovimentacoesAtendimento } from '../../models/movimentacoes-atendimento.model';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';

import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-atendimento-movs',
  templateUrl: './atendimento-movs.component.html',
  styleUrls: ['./atendimento-movs.component.css']
})
export class AtendimentoMovsComponent implements OnInit {

	token = localStorage.getItem('token');

	 global = new GlobalsServices();
	url = this.global.getApiHost();

	// - Controladores do Loading do Componente
	public loadingMovAtendimento = false;

	// - Boolean responsável por saber se o atendimento está fechado ou não
	 finalizado: boolean = false;

	// - Input de váriaveis no componente
	@Input() IDA001: any;

	 auxIDA003;

	 loading = false;

	// - Array de Movimentacoes
	 movimentacaoList: MovimentacoesAtendimento[] = [];

	@Output() callListAtendimentos = new EventEmitter<any>();

	 flagMovimentado: boolean = false;


	// - FormGroup para criação de movimentação
	objFormNewMovimentacao: FormGroup;

	@ViewChild('modalAnexoOcorrencia')  modalAnexoOcorrencia;

	 uploadResult: any = null;



	uploader: FileUploader = new FileUploader({
		url: this.global.getApiHost() + 'mo/atendimentos/uploadFileOC?token='+this.token,
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
		private formBuilder: FormBuilder,
		private atendimentosService: AtendimentosService,
		private toastr: ToastrService,
		private modal : ModalComponent) {

		// - Formulário de cadastro de atendimento
		this.objFormNewMovimentacao = formBuilder.group({
			IDA001:		[], // - Código de Atendimento
			IDS001DE: 	[], // - Usuário que está sendo recebendo a movimentação
			IDS001RE: 	[], // - Usuário que está realizando a movimentação
			IDA002: 	[], // - Motivo da Ação
			DSOBSERV:	[], // - Descrição da Movimentação
			IDA006: [],	// - ID da Movimentação
			NMGRUPOC:	[],
			SNUPLOAD: [],
			SNFINALIZA: [],
		});

		this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
			//form.append('dir', "CTE");


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

			    form.append('IDA003', this.auxIDA003);
				form.append('IDA001', this.objFormNewMovimentacao.controls['IDA001'].value);
				form.append('IDG043', null);
		  		//Stringfy converte objetos em string, pois o append envia apenas no formato de string
				form.append('NMGRUPOC', JSON.stringify(this.objFormNewMovimentacao.controls['NMGRUPOC'].value));
				form.append('SNFINALIZA', this.objFormNewMovimentacao.controls['SNFINALIZA'].value);



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
			this.handleUploadComplete();
		  };
	}

	ngOnInit() {
		// - Carrega as movimentações do atendimento
		this.listMovimentacoes();		
	}

	//Essa função verifica se o atendimento foi finalizado e se há arquivos para upload
	simNaoUpload(finaliza){
		if(finaliza){
			this.objFormNewMovimentacao.controls['SNFINALIZA'].setValue('Finalizado');
		}else{
			this.objFormNewMovimentacao.controls['SNFINALIZA'].setValue('Aberto');
		}

		if(this.uploader.queue.length != 0){
			this.objFormNewMovimentacao.controls['SNUPLOAD'].setValue(true);
		}else{
			this.objFormNewMovimentacao.controls['SNUPLOAD'].setValue(false);
		}

	}

	// - Salvar nova movimentação
	salvarMovimentacao() {
		// - Seto o flag pra true para saber que o usuário realizou a movimentação e assim que fazer a listagem
		// - Voltar a tela
		this.loading = true;

		this.simNaoUpload(false);
		

		let IDSOLIDO = localStorage.getItem('ID_USER');
		this.objFormNewMovimentacao.controls['IDA001'].setValue(this.IDA001);
		this.objFormNewMovimentacao.controls['IDS001RE'].setValue(IDSOLIDO);
		this.objFormNewMovimentacao.controls['IDA006'].setValue(5);

		this.atendimentosService.salvarMovimentacao(this.objFormNewMovimentacao.value).subscribe(
			data => {
				this.auxIDA003 = data;
				if(this.uploader.queue.length != 0){
					//Essa função serve para que seja feito o upload de apenas um item, no caso o primeiro da fila
					//Os restantes são "embutidos" na função BuildItemForm que acontece antes da chamada do upload.
					this.uploader.uploadItem(this.uploader.queue[0]);
				}else{
					// - Carrega as movimentações do atendimento
					this.listMovimentacoes();
					this.toastr.success('Movimentação salva com sucesso!','Salvo!',{timeOut: 10000});
					// - Limpa o Formulário de movimentação
					this.objFormNewMovimentacao.reset();
					this.loading = false;
				}
				
			},
			err => {
				this.toastr.error('Não foi possível salvar a movimentação.', 'Erro!', { timeOut: 10000 });
				this.loading = false;
			}
		);
	}

	// - Finalizar atendimento
	finalizarAtendimento() {
		// - Seto o flag pra true para saber que o usuário realizou a movimentação e assim que fazer a listagem
		// - Voltar a tela

		this.simNaoUpload(true);

		this.flagMovimentado = true;
		this.loading = true;

		let IDSOLIDO = localStorage.getItem('ID_USER');
		this.objFormNewMovimentacao.controls['IDA001'].setValue(this.IDA001);
		this.objFormNewMovimentacao.controls['IDS001RE'].setValue(IDSOLIDO);
		this.objFormNewMovimentacao.controls['IDA006'].setValue(4);

		this.atendimentosService.salvarMovimentacao(this.objFormNewMovimentacao.value).subscribe(
			data => {
				this.auxIDA003 = data;
				if(this.uploader.queue.length != 0){
					//Essa função serve para que seja feito o upload de apenas um item, no caso o primeiro da fila
					//Os restantes são "embutidos" na função BuildItemForm que acontece antes da chamada do upload.
					this.uploader.uploadItem(this.uploader.queue[0]);
				}else{
					// - Carrega as movimentações do atendimento
					this.listMovimentacoes();
					this.toastr.success('Atendimento finalizado com sucesso!','Salvo!',{timeOut: 10000});
					// - Limpa o Formulário de movimentação
					this.objFormNewMovimentacao.reset();
					this.flagMovimentado = false;
					this.loading = false;
				}
				
			},
			err => {
				this.toastr.error('Não foi possível salvar a movimentação.', 'Erro!', { timeOut: 10000 });
				this.flagMovimentado = false;
				this.loading = false;
			}
		);
	}

	voltarListagem() {
		this.callListAtendimentos.emit();
		return false;
	}

	listMovimentacoes(): void {
		// - Carrega as movimentações do atendimento
		this.atendimentosService.getMovimentacoesAtendimento({IDA001: this.IDA001}).subscribe(
			data => {
				this.movimentacaoList = data;
				let isFinalizado = this.movimentacaoList.find(o => o.IDA006 == 4);
				if (isFinalizado != undefined) {
					this.finalizado = true;

					if (this.flagMovimentado) {
						this.callListAtendimentos.emit();	
					}			
				}
			},
			err => {
				this.toastr.error('Não foi possível carregar as movimentações.','Erro!',{timeOut: 10000});
			}
		);
	}

	openModalAnexoOcorrencia() : void {
		this.modal.open(this.modalAnexoOcorrencia,{ size: 'lg' });
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
			//this.loadingAtendimento = false;
			// - Carrega as movimentações do atendimento
			this.listMovimentacoes();
			this.loading = false;
			this.toastr.success('Movimentação salva com sucesso!','Salvo!',{timeOut: 10000});
			// - Limpa o Formulário de movimentação
			this.objFormNewMovimentacao.reset();
			//this.router.navigate(['cte/importar']);
			// this.accordionIndex = '1';
	    } else {
			//this.loadingAtendimento = false;
			this.loading = false;
			this.toastr.error('Não foi possível realizar o upload.','Erro!',{timeOut: 10000});
	    }
	}

	closeAnexoOcorrencia(): void {
		this.modal.closeModal();
	}

}
