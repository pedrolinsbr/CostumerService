import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UtilServices } from '../../../shared/componentesbravo/src/app/services/util.services';
import { DeliverysNfService } from '../../../services/crud/deliverysNf.service';

declare let JsBarcode: any;

@Component({
  selector: 'app-dacte',
  templateUrl: './dacte.component.html',
  styleUrls: ['./dacte.component.css']
})
export class DacteComponent implements OnInit {
	
	@Input() IDG051: number;
	carregando: boolean = true;
	
	objDacte = null;
	qrcodeUrl = 'HTTPS://WWW.SEFAZ.GOV.BR';

	arrayGeral = [];

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private deliveryService: DeliverysNfService,
		public utilServices: UtilServices) { 
	}

	ngOnInit() {
		this.utilServices.loadGridShow();
		this.carregando = true;
		this.deliveryService.getDacte({ IDG051: this.IDG051 }).subscribe(
			data => {
				if (data) {
					data = JSON.parse(data);
					this.objDacte = data.cteProc;
					this.qrcodeUrl = this.objDacte.CTe.infCTeSupl.qrCodCTe;
					console.log(this.objDacte);

					let arrays = [];

					if (Array.isArray(this.objDacte.CTe.infCte.infCTeNorm.infDoc.infNFe) && this.objDacte.CTe.infCte.infCTeNorm.infDoc.infNFe.length > 0) { 
						arrays = this.objDacte.CTe.infCte.infCTeNorm.infDoc.infNFe;
					} else {
						arrays.push(this.objDacte.CTe.infCte.infCTeNorm.infDoc.infNFe);
					}

					
					let arrayInterno = []
					let arrayGrupo = []
					this.arrayGeral = []
					let aux = 0
					
					arrays.forEach((item, index) => {
						aux ++;
						arrayInterno.push(item)					
						if(arrayGrupo.length == 2) {
							this.arrayGeral.push(arrayGrupo)	
							if(arrayInterno.length == 5) {
								arrayInterno = [];
							}					
							arrayGrupo = [];
						} else {
							if(aux == 5) {
								arrayGrupo.push(arrayInterno)
								arrayInterno = [];
								aux = 0;
								if(index + 1 == arrays.length) {
									arrayGrupo.push(arrayInterno)
									this.arrayGeral.push(arrayGrupo)
									arrayInterno = [];
									arrayGrupo = [];
								}
							} else {
								if(index + 1 == arrays.length) {
									arrayGrupo.push(arrayInterno)
									this.arrayGeral.push(arrayGrupo)
									arrayInterno = [];
									arrayGrupo = [];
									aux = 0;
								}
							}
						}
					});
					console.log(this.arrayGeral);
					setTimeout(() => {
						JsBarcode("#barcode", (this.objDacte.CTe.infCte.Id.substring(3)), { width: 2, height: 50 });
					});
				}
				
				this.carregando = false;
				this.utilServices.loadGridHide();
			},
			err => {
				this.utilServices.loadGridHide();
				this.carregando = false;
				this.toastr.error('Erro ao carregar o documento');
				console.log(err);
			}
		)
	}

	imprimir() {
		let printContents, popupWin;
		printContents = document.getElementById('print-section').innerHTML;
		//popupWin = window.open('aaaaaaa', '_blank');
		popupWin = window.open('Danfe', '_blank', 'top=0,left=0,height=auto,width=100%');
		popupWin.document.open();
		
		popupWin.document.write(`
			<html>
					<head>

					<style type="text/css" media="print">
						@page {
								size: portrait;
								scale: 0.9;
						}
						.container-page {
							display: flex;
							background-color: white;
							/* padding: 1.0em; */
							width: 793px;
							height: 1122px;
							}
							
							.container {
							background-color: white;
							/* margin: 11px; */
							}
							
							#container-canhoto {    
							display: flex;
							flex-direction: column;
							}
							
							#container-canhoto-1 {
							display: flex;
							padding: 2px;
							border-top: 1px solid black;
							border-left: 1px solid black;
							border-right: 1px solid black;
							}
							
							#container-1 {
							display: flex;
							flex-direction: row;
							border: 1px solid black;
							}
							
							#container-1-1 {
							display: flex;
							flex-direction: column;
							justify-content: center;
							width: 33%;
							border-right: 1px solid black;
							}
							
							#container-1-2 {
							display: flex;
							flex: 1;
							flex-direction: column;
							padding-bottom: 10px;
							}
							
							#container-1-3 {
							display: flex;
							flex: 1;
							flex-direction: row;
							border-top: 1px solid black;
							}
							
							#container-1-3-1 {
							display: flex;
							width: 70%;
							padding-bottom: 10px;
							}
							
							#container-1-3-2 {
							display: flex;
							width: 44%;
							border-left: 1px solid black;
							padding-bottom: 10px;
							}
							
							#container-1-4 {
							display: flex;
							flex-direction: column;
							width: 28%;
							justify-content: flex-end;
							border-right: 1px solid black;
							}
							
							#container-1-5 {
							display: flex;
							flex-direction: column;
							width: 24%;
							border-right: 1px solid black;
							}
							
							#container-1-6 {
							display: flex;
							flex: 1;
							flex-direction: column;
							padding-bottom: 10px;
							}
							
							#container-1-7 {
							display: flex;
							flex-direction: column;
							flex: 1;
							border-top: 1px solid black;
							padding-bottom: 10px;
							}
							
							#container-1-8 {
							display: flex;
							flex: 1;
							flex-direction: column;
							justify-content: space-between;
							}
							
							#container-1-9 {
							display: flex;
							flex-direction: column;
							}
							
							
							#container-2 {
									display: flex;
									flex-direction: row;
									margin-top: 2px;
									border: 1px solid black;
							}
							
							#container-2-1 {
									display: flex;
									width: 50%;
							}
							
							#container-2-2 {
									display: flex;
									flex-direction: column;
									width: 100%;
							}
							
							#container-2-13 {
									display: flex;
									width: 50%;
							}
							
							#container-2-3 {
									display: flex;
									flex-direction: row;
									border-bottom: 1px solid black;
									border-right: 1px solid black;
							}
							
							#container-2-4 {
									display: flex;
									width: 36%;
							}
							
							#container-2-5 {
									display: flex;
									flex-direction: column;
									width: 80%;
									padding: 5px;
							}
							
							#container-2-7 {
									display: flex;
									flex-direction: row;
									justify-content: space-between;
							}
							
							#container-2-8 {
									display: flex;
									flex-direction: column;
									width: 25%;
									height: 28px;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-9 {
									display: flex;
									flex-direction: column;
									width: 25%;
									height: 28px;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-10 {
									display: flex;
									flex-direction: column;
									width: 25%;
									height: 28px;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-11 {
									display: flex;
									flex-direction: column;
									width: 25%;
									height: 28px;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-12 {
									display: flex;
									flex: 1;
									flex-direction: column;
									border-right: 1px solid black;
							}
							
							#container-2-13 {
									display: flex;
									width: 50%;
							}
							
							#container-2-13-1 {
									display: flex;
									flex-direction: column;
									width: 100%;
							}
							
							#container-2-14 {
									display: flex;
									flex-direction: row;
							}
							
							#container-2-15 {
									display: flex;
									flex-direction: column;
									width: 50%;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-16 {
									display: flex;
									flex-direction: column;
									justify-content: space-between;
									width: 50%;
									border-bottom: 1px solid black;
							}
							
							#container-2-17 {
									display: flex;
									flex-direction: row;
									height: 25px;
							}
							
							#container-2-18 {
									display: flex;
									flex-direction: column;
									width: 19%;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-19 {
									display: flex;
									flex-direction: column;
									width: 10%;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-20 {
									display: flex;
									flex-direction: column;
									width: 27%;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-21 {
									display: flex;
									flex-direction: column;
									width: 9%;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-2-22 {
									display: flex;
									flex-direction: column;
									width: 39%;
									border-bottom: 1px solid black;
							}
							
							#container-2-23 {
									display: flex;
									flex-direction: row;
									height: 61px;
									border-bottom: 1px solid black;
							}
							
							#container-2-24 {
									display: flex;
									width: 90%;
									flex-direction: column;
							}
							
							#container-2-25 {
									display: flex;
									width: 17%;
							}
							
							#container-2-26 {
									display: flex;
									flex-direction: row;
									border-bottom: 1px solid black;
							}
							
							#container-2-27 {
									display: flex;
									width: 50%;
									border-right: 1px solid black;
							}
							
							#container-2-28 {
									display: flex;
									width: 50%;
							}
							
							#container-2-29 {
									display: flex;
									flex: 1;
									flex-direction: row;
							}
							
							#container-2-30 {
									display: flex;
									width: 50%;
									border-right: 1px solid black;
							}
							
							#container-2-31 {
									display: flex;
									width: 50%;
							}
							
							#container-3 {
									display: flex;
									flex: 1;
									flex-direction: column;
									border-left: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-3-1 {
									display: flex;
									flex-direction: row;    
									border-bottom: 1px solid black;
							}
							
							#container-3-2 {
									display: flex;
									flex-direction: column;    
									width: 50%;
									height: 28px;
									border-right: 1px solid black;
							}
							
							#container-3-3 {
									display: flex;
									flex-direction: column;    
									border-right: 1px solid black;
									width: 50%;
							}
							
							#container-3-4 {
									display: flex;
									flex-direction: row;
									border-bottom: 1px solid black;
							}
							
							#container-3-5 {
									display: flex;
									flex-direction: column;
									width: 50%;
									border-right: 1px solid black;
							}
							
							#container-3-6 {
									display: flex;
									flex-direction: row;
									justify-content: space-between;
									margin-top: -7px;
							}
							
							#container-3-8 {
									padding-right: 34px;
							}
							
							#container-3-9 {
									display: flex;
									flex-direction: row;
									align-items: center;
									margin-top: -7px;
							}
							
							#container-3-11 {
									padding-left: 37px;
							}
							
							#container-3-12 {
									display: flex;
									flex-direction: row;
									margin-top: -7px;
							}
							
							#container-3-14 {
									padding-left: 12px;
							}
							
							#container-3-15 {
									padding-left: 153px;
							}
							
							#container-3-16 {
									display: flex;
									flex-direction: row;
							}
							
							#container-4 {
									display: flex;
									flex-direction: column;
									border-left: 1px solid black;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-4-1 {
									display: flex;
									flex-direction: row;
							}
							
							#container-4-2 {
									display: flex;
									flex-direction: row;
									width: 50%;
							}
							
							#container-4-3 {
									display: flex;
									flex-direction: row;
									width: 37%;
							}
							
							#container-4-4 {
									display: flex;
									flex-direction: row;
							}
							
							#container-4-5 {
									display: flex;
									flex-direction: row;
							}
							
							#container-4-6 {
									display: flex;
									flex-direction: row;
									width: 68%;
							}
							
							#container-4-7 {
									display: flex;
									flex-direction: row;
									width: 6%;
							}
							
							#container-4-8 {
									display: flex;
									flex-direction: row;
							}
							
							#container-4-9 {
									display: flex;
									flex-direction: row;
							}
							
							#container-4-10 {
									display: flex;
									flex-direction: row;
									width: 22%;
							}
							
							#container-4-11 {
									display: flex;
									flex-direction: row;
									width: 28%;
							}
							
							#container-4-12 {
									display: flex;
									flex-direction: row;
							}
							
							#container-5 {
									display: flex;
									flex-direction: row;
									border-left: 1px solid black;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-5-1 {
									display: flex;
									flex-direction: column;
									width: 33%;
									border-right: 1px solid black;
							}
							
							#container-5-2 {
									display: flex;
									flex-direction: column;
									width: 33%;
									border-right: 1px solid black;
							}
							
							#container-5-3 {
									display: flex;
									width: 33%;
									flex-direction: column;
							}
							
							#container-6 {
									display: flex;
									flex-direction: row;
									border: 1px solid black;
							}
							
							#container-6-1 {
									display: flex;
									flex-direction: column;
									width: 14%;
									border-right: 1px solid black;
							}
							
							#container-6-2 {
									display: flex;
									border-bottom: 1px solid black;
							}
							
							#container-6-3-1 {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
							}
							
							#container-6-4 {
									display: flex;
									flex-direction: column;
									width: 14%;
									border-right: 1px solid black;
							}
							
							#container-6-5 {
									display: flex;
									border-bottom: 1px solid black;
							}
							
							#container-6-7 {
									display: flex;
									flex-direction: column;
									justify-content: center;
									align-items: center;
							}
							
							#container-6-8 {
									display: flex;
									flex-direction: column;
									width: 14%;
									border-right: 1px solid black;
							}
							
							#container-6-9 {
									display: flex;
									border-bottom: 1px solid black;
							}
							
							#container-6-12 {
									display: flex;
									flex-direction: column;
									width: 14%;
									border-right: 1px solid black;
							}
							
							#container-6-13 {
									display: flex;
									border-bottom: 1px solid black;
							}
							
							#container-6-16 {
									display: flex;
									flex-direction: column;
									width: 44%;
							}
							
							#container-6-17 {
									display: flex;
									border-bottom: 1px solid black;
							}
							
							#container-6-18 {
									display: flex;
									flex-direction: row;
							}
							
							#container-6-19 {
									display: flex;
									width: 25%;
									border-right: 1px solid black;
							}
							
							#container-6-20 {
									display: flex;
									flex-direction: column;
							}
							
							#container-6-21 {
									display: flex;
									width: 25%;
									border-right: 1px solid black;
							}
							
							#container-6-22 {
									display: flex;
									flex-direction: column;
									width: 100%;
									word-wrap: break-word;
							}
							
							#container-6-23 {
									display: flex;
									width: 25%;
									border-right: 1px solid black;
							}
							
							#container-6-24 {
									display: flex;
									flex-direction: column;
							}
							
							#container-6-25 {
									display: flex;
									width: 25%;
							}
							
							#container-6-26 {
									display: flex;
									flex-direction: column;
							}
							
							#container-7 {
									display: flex;
									justify-content: center;
									align-items: center;
									border-bottom: 1px solid black;
									border-left: 1px solid black;
									border-right: 1px solid black;
							}
							
							#container-8 {
									display: flex;
									flex-direction: row;
									border-bottom: 1px solid black;
									border-left: 1px solid black;
									border-right: 1px solid black;
							}
							
							#container-8-1 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 21%;
							}
							
							#container-8-1-2 {
									display: flex;
									flex-direction: column;
							}
							
							#container-8-3 {
									display: flex;
									flex-direction: row;
									justify-content: space-between;
									align-items: center;
							}
							
							#container-8-4 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 21%;
							}
							
							#container-8-7 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 21%;
							}
							
							#container-8-10 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 21%;
							}
							#container-8-13 {
									display: flex;
									flex-direction: column;
									width: 16%;
							}
							
							#container-8-2 {
									display: flex;
									flex-direction: row;
							}
							
							#container-8-14 {
									display: flex;
									flex-direction: column;
									border-bottom: 1px solid black;
									height: 30px;
							}
							
							#container-8-15 {
									display: flex;
									flex-direction: column;
									align-items: flex-end;
							}
							
							#container-8-16 {
									display: flex;
									flex-direction: column;
									height: 30px;
							}
							
							#container-9 {
									display: flex;
									flex-direction: row;
									border-left: 1px solid black;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-8-9-1 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 50%;
							}
							
							#container-8-9-2 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 12%;
							}
							
							#container-8-9-3 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 5%;
							}
							
							#container-8-9-4 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 10%;
							}
							
							#container-8-9-5 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 11%;
							}
							
							#container-8-9-6 {
									display: flex;
									flex-direction: column;
									width: 12%;
							}
							
							#container-10 {
									display: flex;
									flex-direction: row;
									border-left: 1px solid black;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
									height: 20%;
							}
							
							#container-10-1 {
									display: flex;
									flex-direction: column;
									width: 50%;
							}
							
							#container-10-2 {
									display: flex;
									flex-direction: row;
									margin-bottom: 2px;
							}
							
							#container-10-3 {
								display: flex;
								flex-direction: row;
								border-bottom: 1px dashed gray;
								padding-bottom: 5px;
								padding-top: 5px;
							}
							
							#container-10-4 {
									display: flex;
									flex-direction: column;
							}
							
							#container-11 {
									display: flex;
									flex-direction: column;
									border-left: 1px solid black;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
									height: 10%;
							}
							
							#container-12 {
									display: flex;
									flex-direction: row;
									border-left: 1px solid black;
									border-right: 1px solid black;
									border-bottom: 1px solid black;
							}
							
							#container-12-1 {
									display: flex;
									flex-direction: row;
									width: 50%;
							}
							
							#container-12-2 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 26%;
							}
							#container-12-3 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 33%;
							}
							#container-12-4 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 20%;
							}
							
							#container-12-5 {
									display: flex;
									flex-direction: column;
									border-right: 1px solid black;
									width: 21%;
							}
							
							#container-12-6 {
									display: flex;
									flex-direction: column;
									width: 50%;
							}
							
							#container-12-7 {
									display: flex;
									flex-direction: column;
							}
					</style>
				</head>
				<body onload="window.print();window.close();" style="width: 100%; margin: 0 auto;">${printContents}</body>
			</html>`
		);
		popupWin.document.close();
	}

	download() {
		let nrChadocAndTpxml = `${this.objDacte.CTe.infCte.Id.substr(3)}${2}`
		this.deliveryService.downloadDocs(nrChadocAndTpxml).subscribe(
			data => {
				let url = window.URL.createObjectURL(data);
				var link = document.createElement('a');
				link.href = url;
				link.download = 'dacte';
				link.dispatchEvent(new MouseEvent('click'));
			},
			err => {
				console.log(err)
			}
		)
	}
	
}
