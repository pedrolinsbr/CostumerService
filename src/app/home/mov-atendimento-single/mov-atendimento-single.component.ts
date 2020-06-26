import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MovimentacoesAtendimento } from '../../models/movimentacoes-atendimento.model';
import { AtendimentoMovsComponent } from '../atendimento-movs/atendimento-movs.component';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AtendimentosService } from '../../services/crud/atendimentos.service';
import { appInitializerFactory } from '@angular/platform-browser/src/browser/server-transition';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mov-atendimento-single',
  templateUrl: './mov-atendimento-single.component.html',
  styleUrls: ['./mov-atendimento-single.component.css']
})
export class MovAtendimentoSingleComponent implements OnInit {

	@ViewChild('modalEditaMov')  modalEditaMov;
	@ViewChild('modalConfirmaDel')  modalConfirmaDel;

	objFormEditMov : FormGroup;
	

	// - Input de Valores
	@Input() objMovimentacao: MovimentacoesAtendimento = {
		IDA001:		0,
		ROWNUM:		0,
		DSOBSERV:	'',
		DTMOVIME:	'',
		IDS001RE:	0,
		IDS001DE:	0,
		NMUSUARIRE:	'',
		NMUSUARIDE:	'',
		IDA006:		0,
		DSSITUAC: '',
		TXTINFO: '',
		IDA003: 0,
		ULTIMOID: 0
	};
	@Input() desabilitaBotaoEditar: boolean = true;
	@Input() desabilitaBotaoApagar: boolean = true

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private atendimentosService: AtendimentosService,
		private modal : ModalComponent) { 
		this.objFormEditMov = formBuilder.group({
		IDA003: [],
		IDA001: [],
		DSOBSERVMOD:		[], 
		});

	}

	ngOnInit() {
		if (this.objMovimentacao == undefined) {
			this.init();
		}
		this.validaBotao();
		// console.log(this.objMovimentacao.ULTIMOID);
	}

	init(): void {
		this.objMovimentacao = {
			IDA001:		0,
			ROWNUM:		0,
			DSOBSERV:	'',
			DTMOVIME:	'',
			IDS001RE:	0,
			IDS001DE:	0,
			NMUSUARIRE:	'',
			NMUSUARIDE:	'',
			IDA006:		0,
			DSSITUAC: '',
			TXTINFO: '',
			IDA003: 0,
			ULTIMOID: 0,
		};
	}

	editarMovimentacao(apagar): void{
		if(!apagar){
			this.objFormEditMov.controls['DSOBSERVMOD'].setValue(this.objMovimentacao.DSOBSERV);
			this.modal.open(this.modalEditaMov,{ size: 'lg' });
		}
		else{
			this.modal.open(this.modalConfirmaDel ,{ size: 'lg' });
			
		}
		
		
	}

	salvarEditaMovimentacao(apagar): void{
		if (apagar){
			this.objFormEditMov.controls['DSOBSERVMOD'].setValue('');
		}
		this.objFormEditMov.controls['IDA003'].setValue(this.objMovimentacao.IDA003);
		this.objFormEditMov.controls['IDA001'].setValue(this.objMovimentacao.IDA001);
		console.log(this.objFormEditMov.controls['IDA003'].value);
		console.log(this.objFormEditMov.controls['DSOBSERVMOD'].value);
		//this.atendimentosService
		
		this.atendimentosService.salvarEditaMovimentacao(this.objFormEditMov.value).subscribe(
			data => {
				console.log(data + ' Entrei');
				this.toastr.success('Movimentação alterada com sucesso!','Alterado!',{timeOut: 10000});
			},
			err => {
				console.log(err + ' Ops');
				this.toastr.error('Erro ao alterar movimentação!','Erro!',{timeOut: 10000});
			}
		);
		
		this.objMovimentacao.DSOBSERV = this.objFormEditMov.controls['DSOBSERVMOD'].value;
		if(this.objMovimentacao.DSOBSERV == '' || this.objMovimentacao.DSOBSERV == null || this.objMovimentacao.DSOBSERV == undefined){
			this.desabilitaBotaoApagar = true;
		}else{
			this.desabilitaBotaoApagar = false;
		}
		this.modal.closeModal();
		
	}
	validaBotao(){
		let userAdmin = JSON.parse(localStorage.getItem('user'));
		if (userAdmin.SNADMIN == 1) {
			if(this.objMovimentacao.IDA003 == this.objMovimentacao.ULTIMOID && this.objMovimentacao.DSSITUAC != 'Finalizado'){
				this.desabilitaBotaoEditar = false;

				if(this.objMovimentacao.DSOBSERV == '' || this.objMovimentacao.DSOBSERV == null || this.objMovimentacao.DSOBSERV == undefined){
					this.desabilitaBotaoApagar = true;
				}else{
					this.desabilitaBotaoApagar = false;
				}
				
			}else{
				this.desabilitaBotaoEditar = true;
				this.desabilitaBotaoApagar = true
			}
		}else{
			this.desabilitaBotaoEditar = true;
			this.desabilitaBotaoApagar = true;
		}
		
	}

	closeModalEditaMov(): void {
		this.modal.closeModal();
	}

	
}
