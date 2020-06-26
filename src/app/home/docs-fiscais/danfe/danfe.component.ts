import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeliverysNfService } from '../../../services/crud/deliverysNf.service';
import { UtilServices } from '../../../shared/componentesbravo/src/app/services/util.services';


declare let JsBarcode: any;

@Component({
	selector: 'app-danfe',
	templateUrl: './danfe.component.html',
	styleUrls: ['./danfe.component.css']
})
export class DanfeComponent implements OnInit {

	@Input() IDG083: any = '';

	objDanfe = null;
	arItens = [];

	carregando: boolean = true;

	constructor(
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private deliveryService: DeliverysNfService,
		public utilServices: UtilServices) {
	}

	ngOnInit() {
		this.utilServices.loadGridShow();
		this.carregando = true;
		this.deliveryService.getDanfe({ IDG083: this.IDG083 }).subscribe(
			data => {
				if (data) {
					data = JSON.parse(data);
					if (data.nfeProc) {
						this.objDanfe = data.nfeProc;
					} else {
						this.objDanfe = data['n0:nfeProc'];
					}

					if (!this.objDanfe.NFe.infNFe.det) {
						this.arItens = [];
					} else {
						if (Array.isArray(this.objDanfe.NFe.infNFe.det) && this.objDanfe.NFe.infNFe.det.length > 0) {
							let contador = 5;
							let arItensAux = this.objDanfe.NFe.infNFe.det;
							let arItensAux2 = [];

							if (arItensAux.length <= contador) {
								this.arItens.push(this.objDanfe.NFe.infNFe.det);
							} else {
								for (let i = 0; i < arItensAux.length; i++) {
									arItensAux2.push(arItensAux[i]);
									if (i >= (contador - 1) || ((i + 1) == arItensAux.length)) {
										this.arItens.push(arItensAux2);
										contador = contador + 5;
										arItensAux2 = [];
									}
								}
							}

						} else {
							this.arItens.push([this.objDanfe.NFe.infNFe.det]);
						}
					}
					console.log(this.objDanfe);
					console.log(this.arItens);
					setTimeout(() => {
						JsBarcode("#barcode", (this.objDanfe.NFe.infNFe.Id.substring(3)), { width: 2, height: 50, displayValue: false });
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
		let popupWin;
		//popupWin = window.open('aaaaaaa', '_blank');
		popupWin = window.open('Danfe', '_blank', 'top=0,left=0,height=auto,width=100%');
		popupWin.document.open();

		let documentWrite = '';

		for (let i = 0; i < this.arItens.length; i++) {
			documentWrite += `<html>
					<head>

					<meta charset="UTF-8">

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
							height: 100%;
							/* margin: 11px; */
						}
						
						#container-canhoto {
							display: flex;
							flex-direction: row;
						}
						
						#content-canhoto-1 {
							width: 80%;
						}
						
						#content-canhoto-2 {
							display: flex;
							width: 100%;
							height: 13px;
							border: 1px solid black;
						}
						
						#content-canhoto-3 {
							display: flex;
							flex-direction: row;
							width: 100%;
							height: 35px;
							border-bottom: 1px solid black;
							border-left: 1px solid black;
							border-right: 1px solid black;
						}
						
						#content-canhoto-4 {
							display: flex;
							width: 20%;
							border-right: 1px solid black;
						}
						
						#content-canhoto-5 {
							display: flex;
							width: 80%;
						}
						
						#content-canhoto-6 {
							display: flex;
							flex-direction: column;
							width: 20%;  
							height: 48px;
							border: 1px solid black;
						}
						
						#container-header {
							display: flex;
							flex-direction: row;
							height: 129px;
							margin-top: 5px;
							border: 1px solid black;
						}
						
						#content-header-0 {
							display: flex;
							width: 40%;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
						}
						
						#content-header-1 {
							width: 50%;
						}
						
						#content-header-2 {
							display: flex;
							flex-direction: column;  
							width: 78%;
						}
						
						#content-header-3 {
							display: flex;
							flex-direction: column;  
							width: 20%;
							border-left: 1px solid black;
							border-right: 1px solid black;
						}
						
						#content-header-4 {
							display: flex;
							flex-direction: column;  
							width: 40%;
						}
						
						#content-header-5 {
							display: flex;
							flex-direction: column;  
							height: 43px;
							border-top: 1px solid black;
							padding: 3px;
						}
						
						#container-body-1 {
							display: flex;
							flex-direction: row;
							border: 1px solid black;
							margin-top: 2px;
						}
						
						#content-body-1 {
							display: flex;
							flex-direction: column;
							width: 60%;
							padding: 2px;
						}
						
						#content-body-2 {
							display: flex;
							flex-direction: column;
							width: 40%;
							padding: 2px;
							border-left: 1px solid black;
						}
						
						
						#container-body-2 {
							display: flex;
							flex-direction: row;
							margin-top: 2px;
							border: 1px solid black;
						}
						
						#content-body-2-1 {
							display: flex;
							flex-direction: column;
							width: 33%;
							padding: 2px;
						}
						
						#content-body-2-2 {
							display: flex;
							flex-direction: column;
							border-left: 1px solid black;
							border-right: 1px solid black;
							width: 33%;
							padding: 2px;
						}
						
						#content-body-2-3 {
							display: flex;
							flex-direction: column;
							width: 33%;
							padding: 2px;
						}
						
						#container-body-3 {
							display: flex;
							flex-direction: row;
						}
						
						#content-body-3-1 {
							display: flex;
							flex-direction: column;
							width: 82%;
							border-top: 1px solid black;
							border-left: 1px solid black;
							border-right: 1px solid black;
						}
						
						#content-body-3-2 {
							display: flex;
							flex-direction: column;
							width: 18%;
							margin-left: 2px;
							border: 1px solid black;
						}
						
						#content-body-3-1-1 {
							display: flex;
							flex-direction: row;
							border-bottom: 1px solid black;
						}
						
						#content-body-3-1-2 {
							display: flex;
							flex-direction: column;
							width: 57%;
							padding-left: 2px;
						}
						
						#content-body-3-1-3 {
							display: flex;
							flex-direction: column;
							width: 43%;
							padding-left: 2px;
							border-left: 1px solid black;
						}
						
						#content-body-3-2-1 {
							display: flex;
							flex-direction: row;
							border-bottom: 1px solid black;
						}
						
						#content-body-3-2-2 {
							display: flex;
							flex-direction: column;
							width: 47%;
							padding-left: 2px;
						}
						
						#content-body-3-2-3 {
							display: flex;
							flex-direction: column;
							width: 33%;
							border-left: 1px solid black;
							padding-left: 2px;
						}
						
						#content-body-3-2-4 {
							display: flex;
							flex-direction: column;
							width: 20%;
							border-left: 1px solid black;
							padding-left: 2px;
						}
						
						#content-body-3-3-1 {
							display: flex;
							flex-direction: row;
							border-bottom: 1px solid black;
						}
						
						#content-body-3-3-2 {
							display: flex;
							flex-direction: column;
							width: 30%;
							padding-left: 2px;
						}
						
						#content-body-3-3-3 {
							display: flex;
							flex-direction: column;
							width: 21%;
							padding-left: 2px;
							border-left: 1px solid black;
						}
						
						#content-body-3-3-4 {
							display: flex;
							flex-direction: column;
							width: 19%;
							border-left: 1px solid black;
							padding-left: 2px;
						}
						
						#content-body-3-3-5 {
							display: flex;
							flex-direction: column;
							width: 30%;
							border-left: 1px solid black;
							padding-left: 2px;
						}
						
						#content-body-3-4-1 {
							display: flex;
							flex-direction: column;
							width: 18%;
							margin-left: 1px;
							border: 1px solid black;
						}
						
						#content-body-3-4-2 {
							display: flex;
							flex-direction: column;
							padding-left: 2px;
						}
						
						#content-body-3-4-3 {
							display: flex;
							flex-direction: column;
							border-top: 1px solid black;
							padding-left: 2px;
						}
						
						#content-body-3-4-4 {
							display: flex;
							flex-direction: column;
							border-top: 1px solid black;
							padding-left: 2px;
						}
						
						#container-body-4 {
							display: flex;
							flex-direction: row;
							border-left: 1px solid black;
							border-bottom: 1px solid black;
							border-top: 1px solid black;
						}
						#content-body-4-1 {
							display: flex;
							flex-direction: column;
							width: 11.1%;
							height: 35px;
							border-right: 1px solid black;
						}
						
						#container-body-5 {
							display: flex;
							flex-direction: column;
							border: 1px solid black;
						}
						#content-body-5-1 {
							display: flex;
							flex-direction: row;
						}
						
						#content-body-5-1-1 {
							display: flex;
							flex-direction: column;
							width: 26%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						
						#content-body-5-1-2 {
							display: flex;
							flex-direction: column;
							width: 14%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-5-1-3 {
							display: flex;
							flex-direction: column;
							width: 43%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-5-1-4 {
							display: flex;
							flex-direction: column;
							width: 31%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-5-1-5 {
							display: flex;
							flex-direction: column;
							width: 28%;
							padding-left: 2px;
						}
						
						#content-body-5-2 {
							display: flex;
							flex-direction: row;
							border-top: 1px solid black;
						}
						
						#content-body-5-2-1 {
							display: flex;
							flex-direction: column;
							width: 32%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						
						#content-body-5-2-2 {
							display: flex;
							flex-direction: column;
							width: 31%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-5-2-3 {
							display: flex;
							flex-direction: column;
							width: 47%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-5-2-4 {
							display: flex;
							flex-direction: column;
							width: 54%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-5-2-5 {
							display: flex;
							flex-direction: column;
							width: 35%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						
						#content-body-5-2-6 {
							display: flex;
							flex-direction: column;
							width: 41%;
							padding-left: 2px;
						}
						#container-body-6 {
							display: flex;
							flex-direction: column;
							border: 1px solid black;
						}
						#content-body-6-1 {
							display: flex;
							flex-direction: row;
						}
						
						#content-body-6-1-1 {
							display: flex;
							flex-direction: column;
							width: 86%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						
						#content-body-6-1-2 {
							display: flex;
							flex-direction: column;
							width: 31%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-1-3 {
							display: flex;
							flex-direction: column;
							width: 22%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-1-4 {
							display: flex;
							flex-direction: column;
							width: 31%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-1-5 {
							display: flex;
							flex-direction: column;
							width: 25%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-1-6 {
							display: flex;
							flex-direction: column;
							width: 34%;
							padding-left: 2px;
						}
						
						#content-body-6-2 {
							display: flex;
							flex-direction: row;
							border-top: 1px solid black;
						}
						
						#content-body-6-2-1 {
							display: flex;
							flex-direction: column;
							width: 72%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						
						#content-body-6-2-2 {
							display: flex;
							flex-direction: column;
							width: 37%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-2-3 {
							display: flex;
							flex-direction: column;
							width: 34%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-2-4 {
							display: flex;
							flex-direction: column;
							width: 54%;
							padding-left: 2px;
						}
						#content-body-6-3 {
							display: flex;
							flex-direction: row;
							border-top: 1px solid black;
						}
						
						#content-body-6-3-1 {
							display: flex;
							flex-direction: column;
							width: 27%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						
						#content-body-6-3-2 {
							display: flex;
							flex-direction: column;
							width: 27%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-3-3 {
							display: flex;
							flex-direction: column;
							width: 24%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-3-4 {
							display: flex;
							flex-direction: column;
							width: 34%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-3-5 {
							display: flex;
							flex-direction: column;
							width: 28%;
							padding-left: 2px;
							border-right: 1px solid black;
						}
						#content-body-6-3-6 {
							display: flex;
							flex-direction: column;
							width: 28%;
							padding-left: 2px;
						}
						
						#container-7 {
							display: flex;
							flex-direction: column;
						}
						
						#container-7-0 {
							display: flex;
							flex-direction: row;
							border: 1px solid black;
						}
						
						#container-7-1 {
							display: flex;
							flex-direction: column;
							width: 25%;
						}
						
						#container-8 {
							display: flex;
							flex-direction: column;
						}
						
						#container-8-1 {
							display: flex;
							flex-direction: row;
							border: 1px solid black;
							height: 150px;
						}
						
						#container-8-2 {
							display: flex;
							flex-direction: column;
							width: 55%;
							border-right: 1px solid black;
						}
						
						#container-8-3 {
							display: flex;
							flex-direction: column;
							width: 45%;
						}
						
						#container-8-2-1 {
							display: flex;
							flex-direction: row;
							padding-left: 2px;
						}
						
						#container-9 {
							display: flex;
							flex-direction: column;
						}
						
						#container-9-1 {
							display: flex;
							flex-direction: row;
							border-left: 1px solid black;
							border-right: 1px solid black;
							border-bottom: 1px solid black;
							height: 270px;
						}
						
						#container-9-1-0 {
							display: flex;
							flex-direction: row;
							border: 1px solid black;
							height: 270px;
						}
						
						#container-9-1-1 {
							display: flex;
							flex-direction: row;
							width: 100%;
						}
						
						#container-9-2 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 10%;
						}
						
						#container-9-2-88 {
							display: flex;
							flex-direction: row;
							width: 10%;
						}

						#container-9-2-1 {
							height: 25%;
							width: 100%;
							border-bottom: 1px dashed gray;
						}

						#container-produtos {
							position: absolute;
							margin-top: 20px;
							width: 100%;
						}
						
						#container-9-3 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 34%;
						}
						
						#container-9-3-88 {
							display: flex;
							flex-direction: row;
							width: 34%;
						}
						
						#container-9-4 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 8%;
						}
						
						#container-9-4-88 {
							display: flex;
							flex-direction: row;
							width: 8%;
						}
						
						#container-9-5 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 3.5%;
						}
						
						#container-9-5-88 {
							display: flex;
							flex-direction: row;
							width: 3.5%;
						}
						
						#container-9-6 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 5%;
						}
						
						#container-9-6-88 {
							display: flex;
							flex-direction: row;
							width: 5%;
						}
						
						#container-9-7 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 3%;
						}
						
						#container-9-7-88 {
							display: flex;
							flex-direction: row;
							width: 3%;
						}
						
						#container-9-8 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 8%;
						}
						
						#container-9-8-88 {
							display: flex;
							flex-direction: row;
							width: 8%;
						}
						
						#container-9-9 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 9%;
						}
						
						#container-9-9-88 {
							display: flex;
							flex-direction: row;
							width: 9%;
						}
						
						#container-9-10 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 7.5%;
						}
						
						#container-9-10-88 {
							display: flex;
							flex-direction: row;
							width: 7.5%;
						}
						
						#container-9-11 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 7%;
						}
						
						#container-9-11-88 {
							display: flex;
							flex-direction: row;
							width: 7%;
						}
						
						#container-9-12 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 6%;
						}
						
						#container-9-12-88 {
							display: flex;
							flex-direction: row;
							width: 6%;
						}
						
						#container-9-13 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 4%;
						}
						
						#container-9-13-88 {
							display: flex;
							flex-direction: row;
							width: 4%;
						}
						
						#container-9-14 {
							display: flex;
							flex-direction: row;
							border-right: 1px solid black;
							width: 6%;
						}
						
						#container-9-14-88 {
							display: flex;
							flex-direction: row;
							width: 6%;
						}
						
						#container-9-15 {
							display: flex;
							flex-direction: row;
							width: 5%;
						}
						
						#container-9-15-88 {
							display: flex;
							flex-direction: row;
							width: 5%;
						}
						
						#container-9-2-1 {
							display: flex;
							flex-direction: column;
						}
						#barcode{
							height: 47px !important; 
							width: 306px !important;
						}
						
						#container-9-2-1-1 {
							display: flex;
						}
						
						#container-9-2-1-0 {
							display: flex;
								flex-direction: row;
								width: 100%;
								word-break: break-word;
						}
						#container-9-2-87 {
							display: flex; 
							flex-direction: row; 
							margin-bottom: 43px; 
							padding-top: 2px; 
							border-bottom: 1px dashed gray;
						}
					</style>
				</head>
				<body onload="window.print();window.close();" style="width: 100%; margin: 0 auto;">${document.getElementById(i.toString()).innerHTML}</body>
			</html>`;
		}


		popupWin.document.write(`${documentWrite}`);

		popupWin.document.close();
	}

	download() {
		let nrChadocAndTpxml = `${this.objDanfe.NFe.infNFe.Id.substr(3)}${1}`
		this.deliveryService.downloadDocs(nrChadocAndTpxml).subscribe(
			data => {
				let url = window.URL.createObjectURL(data);
				var link = document.createElement('a');
				link.href = url;
				link.download = 'danfe';
				link.dispatchEvent(new MouseEvent('click'));
			},
			err => {
				console.log(err)
			}
		)
	}
}
