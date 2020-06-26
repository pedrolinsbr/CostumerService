import { Component, OnInit,Input, Output, EventEmitter} from '@angular/core';
import { SacService } from '../../../app/services/crud/sac.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-atendentes-list',
  templateUrl: './atendentes-list.component.html',
  styleUrls: ['./atendentes-list.component.css']
})

export class AtendentesListComponent implements OnInit {
	@Output() data = new EventEmitter<any>();
	@Output() getStFiltrando = new EventEmitter<any>();
	@Input() dataSelect = [];

	constructor(
		private sacService : SacService,
		private toastr:		ToastrService
	) { }

	nmFilter = 0;
	ttRegistros = 0;
	arrayDNada = [];

	ngOnInit() {
		this.getAtendentes(null);
	}

	getAtendentes(obj){
		this.sacService.getAtendentesConfig(obj).subscribe(
			data=>{
				for(let i of data) {
					i['img'] = 'assets/images/userAvatar.png';
					i['status'] =  0;
					i['selected'] = true;
				}
				this.arrayDNada = data;
				this.setInicial();
				//this.selecionados();
			},
			err=>{

			}
		);
	}

	setInicial(){
		let arrayTop = []
		let cont = 0;
		for(let i of this.arrayDNada){
			if (this.dataSelect.length != 0) {
				for (let j of this.dataSelect) {
					if(i.IDS001 == j){
						i.selected = true;
						arrayTop[cont] = {IDG014: i.IDG014};
						cont++;
						this.nmFilter = cont;
						break;
					}else{
						i.selected = false;
					}
				}
			}
		}
	}

	stFiltrando =false;
	selecionados(){
		let arrayTop = []
		let cont = 0;
		this.stFiltrando = false;
		for (let i of this.arrayDNada) {
			if(i.selected){
				arrayTop[cont] = {IDG014: i.IDG014};
				cont++;
				this.nmFilter = cont;				
			}

			if (!i.selected && this.arrayDNada.length == 1) {
				i.selected = true;
				arrayTop[cont] = {IDG014: i.IDG014};
				this.toastr.error('É necessário pelo menos um atendente selecionado.')
			}
		}

		// if (cont == 0 && this.arrayDNada.length > 0) {
		// 	arrayTop.push(0);
		// }

		if(this.nmFilter < this.arrayDNada.length){
			this.stFiltrando = true;
		}
		this.data.emit(arrayTop);
		this.getStFiltrando.emit(this.stFiltrando);
	}

	uncheckAll(): void {
		for (let i of this.arrayDNada) {
			i.selected = false;
		}
		this.nmFilter = 0;
		this.selecionados();
	}

	checkAll(): void {
		for (let i of this.arrayDNada) {
			i.selected = true;
		}
		this.selecionados();
	}
}
