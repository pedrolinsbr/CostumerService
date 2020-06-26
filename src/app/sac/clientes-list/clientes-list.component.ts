import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { SacService } from '../../../app/services/crud/sac.service';

@Component({
	selector: 'app-clientes-list',
	templateUrl: './clientes-list.component.html',
	styleUrls: ['./clientes-list.component.css']
})
export class ClientesListComponent implements OnInit {
	@Output() data = new EventEmitter<any>();
	@Output() getStFiltrando = new EventEmitter<any>();
	@Input() dataSelect : any;


	nmFilter = 0;
	ttRegistros = 0;

	arrayDNada = [];

	constructor(private sacService : SacService) { }

	ngOnInit() {
		this.getClientes(null);
	}

	getClientes(obj){
		this.sacService.getClientes(obj).subscribe(
			data=>{
				for(let i of data){
					i['img'] = "assets/images/avatar.jpg";
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
			if(this.dataSelect.length != 0){
				for(let j of this.dataSelect){
					if(i.IDG014 == j){
						i.selected = true;
						arrayTop[cont] = i.IDG014;
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
		for(let i of this.arrayDNada){
			if(i.selected){
				arrayTop[cont] = i.IDG014;
				cont++;
				this.nmFilter = cont;
			}
		}
		if(this.nmFilter < this.arrayDNada.length){
			this.stFiltrando = true;
		}
		// if (cont == 0  && this.arrayDNada.length > 0) {
		// 	arrayTop.push(0);
		// }
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