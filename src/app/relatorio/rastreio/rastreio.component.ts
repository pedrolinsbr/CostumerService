//## IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


//## COMPONENTES BRAVO
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';

//## SERVICES
import { GlobalsServices            } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DeliverysNfService } from '../../services/crud/deliverysNf.service';
import { NotaFiscal } from '../../models/nota-fiscal.model';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { AtendimentosService } from '../../services/crud/atendimentos.service';


@Component({
  selector: 'app-rastreio',
  templateUrl: './rastreio.component.html',
  styleUrls: ['./rastreio.component.scss']
})

export class RastreioComponent implements OnInit {
  private global = new GlobalsServices();
  url = this.global.getApiHost();
  
  @ViewChild('modalNF') modalNF;
	@ViewChild('modalStEmailRastre') private modalStEmailRastre;

  // ##### ARRAYS // OBJECTS
	arIdCte = [];
  arIdNfe = [];
  arCDdelivery = [];
  arIdsNrConhec = [];
  arIdsTipoStatus = [];
  objfilter = { value: null };
  
  nfeObj = [];

  controlExibir = 1;
  controlExibirTela = 1;

  idCliente: any;

  showInfo:boolean = true;

	objStyle             = {
		'background' : '#43295b',
		'color'      : '#ffffff',
		'iconColor'  : '#ffffff',
		'iconOpacity': '0.5'
	  };

  //##### FORMS
  objFormFilter    : FormGroup;
  objFormEnvioRastreio   : FormGroup;
  objFormFilterD: FormGroup;

  IDG043_selecionada: any;

  modalNotas:boolean = false;

  listaStEmail = [];

  constructor(
    private formBuilder : FormBuilder,
    private grid        : DatagridComponent,
    private toastr      : ToastrService,
    private utilServices: UtilServices,
    private deliveryNfService: DeliverysNfService,
		private atendimentosService: AtendimentosService,
    private modal : ModalComponent
  ) {
    this.objFormFilter = formBuilder.group({
      G043_NRNOTA  :  [],
      G051_CDCTRC  :  [],
      G078_DTENVIA :  [],
      SNENVIAD     :  [],
      G014_IDG014  :  [],
      G005_IDG005  :  [],
      G003_IDG003  :  [],
      G002_IDG002  :  [],
      G078_SNENVMAN:  []
    });

    //Form data início e fim
    this.objFormFilterD = formBuilder.group({
			DTINICIO     : [],
			DTFIM        : [],
      G005_IDG005  : [],
      G003_IDG003  : [],
      G002_IDG002  : [],
      G078_SNENVMAN: []
		});
  }

  ngOnInit() {
    this.objFormEnvioRastreio;
    this.objFormFilter.controls['G078_DTENVIA'].setValue(
			[
				this.dataC(this.dtInicioDefault[0]),
				this.dataC(this.dtTerminoDefault[0])
			]
    );
  }


  data = new Date();
	dataMinima = [{ year: '', month: '', day: '' }];
	dataMaxima = [{ year: '', month: '', day: '' }];
	dtInicioDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: 1 }];
	dtTerminoDefault = [{ year: this.data.getFullYear(), month: this.data.getMonth() + 1, day: this.data.getDate() }]
	dataInicio: any;
	horas = [];
	busca = '';
	mesSelecionado = '';
	anoSelecionado = '';
	diaDaSemana: any;
	dataClicou = [];
	diaSelecionado;


  dataC(event) {
		let thiscontext = '';
		if (event.day < 10) {
			thiscontext = "0" + event.day;
		} else {
			thiscontext = event.day;
		}
		if (event.month < 10) {
			thiscontext += "/0" + event.month;
		} else {
			thiscontext += "/" + event.month;
		}
		thiscontext += "/" + event.year;
		return thiscontext;
  }
  
  dataFormat(event) {

		const objStringMonth = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	
		let thiscontext = '';
		if(event.day < 10){
		  thiscontext = "0"+event.day;
		}else{
		  thiscontext = event.day;
		}
		thiscontext += "/"+objStringMonth[event.month-1];
	
		thiscontext += "/"+event.year;
		return thiscontext;
  }
    
  dataClick(event) {
    if (event != null) {
      let dia = event.year + '-' + event.month + '-' + event.day;
      this.diaSelecionado = new Date(dia);
      this.dataClicou = event;
      this.anoSelecionado = event.year;
    }
  }
    


  idNfe = [];
  idCte = [];

  filtrar() {
    this.idNfe = [];
    this.idCte = [];

    let objfilterAux = Object.assign({}, this.objFormFilter.value);

		// ID NOTA FISCAL
		if(this.arIdNfe.length > 0 ){
			for(let i of this.arIdNfe){
			  this.idNfe.push(i.name)
			}
			objfilterAux.G043_NRNOTA = {in: this.idNfe};
		}else{
			objfilterAux.G043_NRNOTA = null;
		}

		// ID CONHECIMENTO
		if(this.arIdCte.length > 0 ){
			for(let i of this.arIdCte){
			  this.idCte.push(i.name)
			}
			objfilterAux.G051_CDCTRC = {in: this.idCte};
		}else{
			objfilterAux.G051_CDCTRC = null;
		}

    //Filtro datas
    if((this.objFormFilterD.controls['DTFIM'].value != null) && (this.objFormFilterD.controls['DTINICIO'].value !=null)){
			objfilterAux.G078_DTENVIA = 
				[
					this.dataC(this.objFormFilterD.controls['DTINICIO'].value),
					this.dataC(this.objFormFilterD.controls['DTFIM'].value)
				]
      ;
		}else{
      objfilterAux.G078_DTENVIA = null;
    }
    
    if (this.objFormFilterD.controls['G005_IDG005'].value) {
      objfilterAux.G005_IDG005 = { in: this.objFormFilterD.controls['G005_IDG005'].value };
    } else {
      objfilterAux.G005_IDG005 = null;
    }

    if (this.objFormFilterD.controls['G003_IDG003'].value) {
      objfilterAux.G003_IDG003 = { in: this.objFormFilterD.controls['G003_IDG003'].value };
    } else {
      objfilterAux.G003_IDG003 = null;
    }

    if (this.objFormFilterD.controls['G002_IDG002'].value) {
      objfilterAux.G002_IDG002 = { in: this.objFormFilterD.controls['G002_IDG002'].value };
    } else {
      objfilterAux.G002_IDG002 = null;
    }

    if (this.objFormFilterD.controls['G078_SNENVMAN'].value == 2) {
      objfilterAux.G078_SNENVMAN = { 'null': true };
    } else if (this.objFormFilterD.controls['G078_SNENVMAN'].value == 1) {
      objfilterAux.G078_SNENVMAN = { 'null': false };
    } else {
      objfilterAux.G078_SNENVMAN = '';
    }

    //Fim Filtro datas
    this.objfilter.value = objfilterAux;
    this.grid.findDataTable('envioRastreio', 'objfilter');
    this.grid.findDataTable('envioRastreioCliente', 'objfilter');

  }

  limparHome(){
    this.objFormFilter.reset();
    this.objFormFilterD.reset();
  }

  visualizarRast(objRast) {
    let objNotas = JSON.parse(objRast);

    let arIdNfe = objNotas.G043LIST.split(",");
    let idNfe = { in: [] };

    if (arIdNfe.length > 0) {
      for (let i of arIdNfe) {
        idNfe.in.push(i)
      }
      this.IDG043_selecionada = idNfe;
    } else {
      this.IDG043_selecionada = null;
    }

    let controllerView =
		{
			'IDG043': this.IDG043_selecionada,
			'NFE': true,
			'IT_NFE': true
    }
    
    this.loadInformacoesNotaFiscal(controllerView);
  }

  // - Função para carregar informações da Nota Fiscal
	loadInformacoesNotaFiscal(objReq): void {
    this.utilServices.loadGridShow();
    this.nfeObj = [];
		this.deliveryNfService.getInformacoesNotaFiscal(objReq).subscribe(
      data => {
        this.utilServices.loadGridHide();
        console.log(data);
        if (Array.isArray(data.NFE) && data.NFE.length > 0) { 
          this.nfeObj = data.NFE;
        } else {
          this.nfeObj.push(data.NFE);
        }
        document.querySelector('.main-content').scrollTop = 0;
        this.modalNotas = true;
			},
      err => {
        this.utilServices.loadGridHide();
				this.toastr.error('Erro ao buscar informações.');
			}
		);

  }

  closeModalNotas() {
		this.modalNotas = false;
  }

	visualizarStEmailSatisf(cliente) {
		cliente = JSON.parse(cliente);
		this.utilServices.loadGridShow();

		this.atendimentosService.listaStEmail({ IDG005: cliente.IDG005 }).subscribe(
			data => {
				this.toastr.success('Lista de status de E-mail carregada com sucesso!', 'SUCESSO:');
				this.utilServices.loadGridHide();
				this.listaStEmail = data;

				this.modal.open(this.modalStEmailRastre, { size: 'lg' });
			},
			err => {
				this.toastr.error('Falha ao buscar lista de status de E-mail!', 'ERRO:');
				this.utilServices.loadGridHide();
				console.error(err);
			}
		)
  }

	visualizarContatos(cliente) {
		cliente = JSON.parse(cliente);
		this.idCliente = cliente.IDG005;
		this.controlExibir = 2;
	}

	voltarTela(event) {
		if (event) this.controlExibir = 1;
	}

	changeOption(opc) {
		this.controlExibirTela = opc;
  }

}
