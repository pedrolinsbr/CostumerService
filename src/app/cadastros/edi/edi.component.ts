import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { EdiService } from './../../services/crud/edi.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DatagridComponent } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { ModalComponent } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
//import { ActivatedRoute, Router } from '@angular/router';

import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { MensagensComponent } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
// SERVICES
import { GlobalsServices } from '../../shared/componentesbravo/src/app/services/globals.services';
import * as $ from 'jquery';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-edi',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './edi.component.html',
  styleUrls: ['./edi.component.scss'],
})


export class EdiComponent implements OnInit {
  token = localStorage.getItem('token');
  apiService: any;

  // ########## FORMS ##########
  objFormFilter: FormGroup; //FORMULÁRIO FILTRO
  objFormGrupoProdutos: FormGroup;
  objFormEdi: FormGroup;
  objFormNewFieldEdi: FormGroup;
  objFormRegs: FormGroup;
  objFormOptOrder: FormGroup;
  objFormFilterCamposEdi: FormGroup;
  objFormFiterFieldEdi: FormGroup;
  log_objFormFilter: FormGroup;
  erros_objFormFilter : FormGroup;
  idConfigEdi: 0;
  idFieldEdi: 0;
  idDataGrid: "dataGridEdi";
  arBreadcrumbsLocal = [];

  // ##### VALIDATORS VIEW
  collappsed = null;
  checkViewDePara = 0;
  checkSaveCliente = true;
  exibir = 1;

  //dados recebidos arquivo LOG
  listArquivos = [];
  listConteudoQM = [];
  public detalheArquivo;
  objArquivoDownload: any;

  currentJustify = 'fill';
  arrayRowsFieldEdiSelec: any[];
  textomodal = 'Certeza?';
  textModalOrder = '';
  selectedDataConsiderar: any;
  selectedCharset: '1';
  selectedTpTransp: any[];
  selectedTpArquivo: any;
  selectedTpEnvio: any;
  selectedSnAtivo: 1;
  selectedSnAtivo_fil: any;
  selectedAliasTabela: any;
  selectedOperacao: any[];
  selectedConsNF: any;
  selectedConsiderarNF: any;
  selectedClientesOper: any[];
  selectedDiasEnvio: any[];
  selectedOptOrderField: any[];
  selectedItemPastaArq: any;
  fieldsEDI: any;
  textVTPTRANP: any;
  textVTPINCLUIR: any;
  textVTEMDTEMISSAO: any;
  textVDTENTREGARANGE: any;
  textVDTEMISSAOINRANGE: any;
  textVSTIUACAO: any;

  //0-Visulizar 0 - Criar , 1-Editar, 2-Visualizar, 3-Criar Campos Edi
  checkViewCampoEdi = 0;
  checkViewEdi = 0;

  objFilterEdi = {};        // OBJETO PARA FILTRAR EDI

  //considerarNf
  considerarNF = [{ id: "0", text: 'Entregue' }, { id: "1", text: 'Não Entregue' }, { id: "2", text: 'Todas' }];
  //dataConsiderar
  dataConsiderar = [{ id: "0", text: 'Entrega' }, { id: "1", text: 'Rastreamento' }];
  //codificacao do arquivo
  charset = [{ id: "0", name: 'ISO-8859-1' }, { id: "1", name: 'UTF-8' }];
  //tipo de transporte
  tipoTransp = [{ id: "0", text: 'Venda' }, { id: "1", text: 'Transferência' }, { id: "2", text: 'Devolução' }, { id: "3", text: 'Industrialização' }, { id: "4", text: 'Outros' }];
  //tipo de operacao
  tipoOper = [{ id: '0', text: 'Remetente' }, { id: '1', text: 'Destinatário' }, { id: '2', text: 'Consignatário' }];
  //considerar NF
  consNF = [{ id: "0", text: 'Entrega' }, { id: "1", text: 'Não Entregue' }, { id: "2", text: 'Todas' }];
  //tipo de arquivo
  tpArquivo = [{ id: "0", text: 'TXT' }, { id: "1", text: 'Excel' }, { id: "2", text: 'XML' }, { id: "3", text: 'Dupont' }];
  //Tipo de envio
  tipoEnvio = [{ id: "0", text: 'E-mail' }, { id: "1", text: 'Ftp' }, { id: "2", text: 'Wsdl' }];
  //Dias de envio
  diasEnvio = [{ id: "0", text: 'Segunda' }, { id: "1", text: 'Terça' }, { id: "2", text: 'Quarta' }, { id: "3", text: 'Quinta' }, { id: "4", text: 'Sexta' }, { id: "5", text: 'Sabado' }, { id: "6", text: 'Domingo' }];
  //SNATIVO
  snativo = [{ id: 1,  name:"Ativo" }, { id: 0, name:"Inativo" }];
  //pastas de arquivos edi
  itensPastaArq = [{ id: 'Backup', text: 'Backup' }, { id: 'logs', text: 'Logs' }];
  //opt para ordenacao
  optionOrderField = [{ id: '0', text: 'Mater igual' }, { id: '1', text: 'Trocar' }, { id: '2', text: 'Inserir no Fim' }];
  
  aliasTabela = [
    { id: 'G005DE', text: 'Razão Social Destinat.' }, 
    { id: 'G003DE', text: 'Cidade Destinat.' }, 
    { id: 'G002DE', text: 'UF Destinat.' }, 
    { id: 'G005OR', text: 'Razão Social Origem' }, 
    { id: 'G003OR', text: 'Cidade Origem' }, 
    { id: 'G002OR', text: 'UF Origem' }
  ];


  apiUrl = localStorage.getItem('URL_API');
  urlConfigEdiGrid = this.apiUrl + 'tp/edi/getEdiList' //Busca dados para grid de Config de Edi
  urlCamposEdiGrid = this.apiUrl + 'tp/edi/getCamposEdiList'; //Busca dados para grid de campos de Edi
  urlFieldsEdiAll = this.apiUrl + 'tp/edi/getAllFieldsEdi';
  urlListarConfigEdi = this.apiUrl + 'tp/edi/listarConfigEdi';

  @ViewChild('breadcrumbs') breadcrumbs;
  @ViewChild('modalDelete') private modalDelete;
  @ViewChild('modalDisable') private modalDisable;
  @ViewChild('modalRemoveFieldEdi') private modalRemoveFieldEdi;
  @ViewChild('modalUpdateOrderField') private modalUpdateOrderField;
  @ViewChild('modalViewDetalheArquivo') private modalViewDetalheArquivo;
  @ViewChild('downloadZipLink') private downloadZipLink: ElementRef;
  @ViewChild('acc') private acc;
  modalRef: NgbModalRef;

  url = ""

  constructor(
    private mensagens: MensagensComponent,
    private utilServices: UtilServices,
    private modal: ModalComponent,
    public global: GlobalsServices,
    private formBuilder: FormBuilder,
    private grid: DatagridComponent,
    private toastr: ToastrService,
    private EdiService: EdiService
  ) {
    this.url = this.global.getApiHost();

    // form auxiliar para filtrar cliente
    this.objFormOptOrder = formBuilder.group({
      OPT_ORDER: []
    });

    this.objFormFilter = formBuilder.group({
      IDG014: [],
      SNATIVO: []
    });

    this.log_objFormFilter = formBuilder.group({
      DT_PROCESS: [],
      NMCLIENT: [],
      NM_PASTA: []
    });

    this.erros_objFormFilter = formBuilder.group({
      NMCLIENT: [],
      NRNOTA: [],
      DSOBSERV : []
    });


    //--FILTRO DATAGRID CONTATOS--\\
    this.objFormFilterCamposEdi = formBuilder.group({
      IDG094: [],

    });

    this.objFormFiterFieldEdi = formBuilder.group({
      IDS010: [],
      DSCAMPO: []
    });

    this.objFormNewFieldEdi = formBuilder.group({
      IDG095: [],
      IDG094: [],
      NRORDEM: [],
      DSALIATB: [],
      IDG095RE: [],
      IDS010: [],
      NMCOLUNA: []
    });

    this.objFormRegs = formBuilder.group({
      IDG014: [],
      IDG094: [],
      DSCLIENT: [],
      SNATIVO: [],
      NRDIAENT: [],
      NRDIAEMI: [],
      NMARQUIV: [],
      TPARQUIV: [],
      DTCADAST: [],
      TPCONSNF: [],
      DSPADENT: [],
      TPCONSDT: [],
      TPCODIFI: [],
      TPTRANSP: [],
      TPENVIO: [],
      DSCATEGO: [],
      DSARMAZE: [],
      DSENVIO: [],
      HREXECUT: [],
      NMDIAEXE: [],
      HRLIMRPT: [],
      HRREPETE: [],
      TRRECEDI: [],
      SNFILCLI: [],
      DSTOKEN: []
    });
  }


  filtrar() {
    try {
      this.grid.findDataTable('dataGridEdi');
    } catch (e) {
      console.log(e);
    }
  }


  ngOnInit() {

  }

  selected(event) {

  }

  close() {
    this.modal.closeModal();
  }
  confirmaDeleteEdi() {
    this.modal.closeModal()
  }


  deleteCampoEdi(ids) {
    this.idConfigEdi = ids;
    this.modal.open(this.modalDelete);
  }


  selectedTpOper(value) {
    var teste = JSON.parse(value);
    alert(teste);
  }

  removedTpOper(value: any) {
    console.log('Removed value is: ', value);
  }

  refreshTpOper(value: any) {
    value = value;
  }


  set(id, name, functionName, parameter, icon) {//FUNÇÃO SETA NOVOS PASSOS (BREADCRUMBS)
    let valid = true;
    let data = {
      id: id,
      name: name,
      function: functionName,
      parameter: parameter,
      icon: icon
    }
    for (let item of this.arBreadcrumbsLocal) {
      if (item.id == data.id || item.name == name) {
        valid = false;
      }
    }
    if (valid) {
      this.arBreadcrumbsLocal.push(data);
    }
  }

  /**
   * @description Busca dados para de configuração de um EDI (G094)
   * @author Pedro Lins
   * @function api/getCamposEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  getCamposEdi(id) {
    var obj = { "IDG094": id };
    this.EdiService.getEdiTrackingCliente(obj).subscribe(
      data => {
        console.log(data);
        this.objFormRegs.controls['DSCLIENT'].setValue(data.DSCLIENT);
        this.objFormFilterCamposEdi.controls['IDG094'].setValue(data.IDG094);
        this.objFormRegs.controls['IDG094'].setValue(data.IDG094);
        this.objFormRegs.controls['NMARQUIV'].setValue(data.NMARQUIV);
        this.objFormRegs.controls['NRDIAENT'].setValue(data.NRDIAENT);
        this.objFormRegs.controls['NRDIAEMI'].setValue(data.NRDIAEMI);
        this.objFormRegs.controls['DSPADENT'].setValue(data.DSPADENT);
        this.objFormRegs.controls['DSENVIO'].setValue(data.DSENVIO);
        this.objFormRegs.controls['HREXECUT'].setValue(data.HREXECUT);
        this.objFormRegs.controls['HRREPETE'].setValue(data.HRREPETE);
        this.objFormRegs.controls['HRLIMRPT'].setValue(data.HRLIMRPT);
        this.objFormRegs.controls['DSTOKEN'].setValue(data.DSTOKEN);
        this.objFormRegs.controls['IDG014'].setValue({'id': data.IDG014, 'text':data.DSCLIENT });
        if (data.SNFILCLI == "" || data.SNFILCLI == 0){
          this.objFormRegs.controls['SNFILCLI'].setValue([]);
        }else{
          this.objFormRegs.controls['SNFILCLI'].setValue(data.SNFILCLI);
        }
        
        
        this.selectedTpArquivo = data.TPARQUIV;
        this.selectedDataConsiderar = data.TPCONSDT; //Considerar data
        this.selectedConsiderarNF = data.TPCONSNF; //Considerar NF
        this.selectedCharset = data.TPCODIFI;
        this.selectedSnAtivo = data.SNATIVO;
        this.selectedTpEnvio = data.TPENVIO;
        this.selectedTpTransp = data.TPTRANSP.split(",");
        this.selectedOperacao = data.TRRECEDI.split(",");
        try {
          this.selectedDiasEnvio = data.NMDIAEXE.split(",");
        } catch{
          this.selectedDiasEnvio = data.NMDIAEXE;
        }
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
      }
    );
  }


  /**
   * @description Abre tela para de criacao de campo para EDI
   * @author Pedro Lins
   * @function api/addFieldEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  addFieldEdi(idLista) {
    var arrayLinha = null;
    var umarray = [];
    $('input[type="hidden"][name^="linhaCampoEdi"]').each(function (obj) {
      arrayLinha = JSON.parse(($(this).val()));
      umarray.push(arrayLinha);
    });
    this.arrayRowsFieldEdiSelec = umarray;
    this.checkViewCampoEdi = 4;
    this.exibir = 4;
    this.set(3, this.utilServices.getStringTranslate('Novo Campo') + " " + this.breadcrumbs.home, "addFieldEdi", null, "fa fa-plus");
  }

  /**
   * @description Abre tela para de criacao de cadastro configuração EDI
   * @author Pedro Lins
   * @function api/addEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  addEdi() {
    console.log("addEdi");
    this.checkViewCampoEdi = 0;
    this.objFormRegs.reset();
    this.exibir = 2;
    
    this.selectedSnAtivo = 1;
    this.selectedCharset = '1';
    this.objFormRegs.controls['HRLIMRPT'].setValue('23:59');
    this.objFormRegs.controls['DSPADENT'].setValue('Nota Fiscal Entregue');

    this.set(4, this.utilServices.getStringTranslate('Novo') + " " + this.breadcrumbs.home, "addEdi", null, "fa fa-plus");
  }

   /**
   * @description Abre tela visualizacao de EDI (cód 2)
   * @author Pedro Lins
   * @function api/viewEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  viewEdi(id) {
    console.log("viewEdi");
    id = JSON.parse(id);
    this.objFormRegs.reset();
    this.checkViewCampoEdi = 2;
    this.exibir = 2;
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.visualizar') + " " + this.breadcrumbs.home, "viewEdi", null, "fas fa-eye");
    this.getCamposEdi(id);
  }

  /**
   * @description Abre tela atualizacao de EDI (cód 1)
   * @author Pedro Lins
   * @function api/updateEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  updateEdi(id) {
    if (id) {
      this.idConfigEdi = id;
    }
    this.exibir = 2;
    this.checkViewCampoEdi = 1;
    this.objFormRegs.reset();
    this.set(1, this.utilServices.getStringTranslate('it.telas.acao.alterar') + " " + this.breadcrumbs.home, "backtoUpdateEdi", null, "fa fas fa-pencil-alt");
    this.getCamposEdi(this.idConfigEdi);
  }

  /**
   * @description Retorna para tela de atualizacao de config EDI, sem atualizar dados (cód 2)
   * @author Pedro Lins
   * @function api/backtoUpdateEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  backtoUpdateEdi() {
    this.exibir = 2;
    this.checkViewCampoEdi = 1;
  }

  /**
   * @description Fucção para desativar uma configuração de EDI
   * @author Pedro Lins
   * @function api/disableEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  disableEdi(id) {
    this.idConfigEdi = id;
    this.textomodal = 'Deseja realmente desativar o Edi?';
    this.modal.open(this.modalDisable);
  }

  /**
   * @description Fucção para remover campo de uma configuração de EDI
   * @author Pedro Lins
   * @function api/removeFieldEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  removeFieldEdi(id) {
    var arrayLinha = null;
    this.idFieldEdi = id;
    this.textomodal = 'Deseja realmente remover esse campo para esse Edi?';
    this.modal.open(this.modalRemoveFieldEdi);
  }

  /**
   * @description Fução para confirmar desativar uma configuração de EDI  (botao do modal)
   * @author Pedro Lins
   * @function api/confirmaDisableEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  confirmaDisableEdi() {
    var obj = { "IDG094": this.idConfigEdi };
    this.EdiService.disableEdi(obj).subscribe(
      data => {
        this.mensagens.MensagemSucesso(data.response, '');
        this.grid.findDataTable('dataGridEdi', '');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
      }
    );
  }

  /**
   * @description Fução para confirmar remover um campo de uma configuração de EDI (botao do modal)
   * @author Pedro Lins
   * @function api/confirmRemoveFieldEdi
   * @throws Em caso de erro, será apresentado no uma mensagem
   */
  confirmRemoveFieldEdi() {
    var ordemRemover = '';
    console.log("ID em removeFieldEdi: " + this.idFieldEdi);
    $('input[type="hidden"][id^="' + this.idFieldEdi + '"]').each(function (obj) {
      var arrayLinha = JSON.parse(($(this).val()));
      ordemRemover = arrayLinha.NRORDEM;
    });

    var obj = { "IDG095": this.idFieldEdi, "IDG094": this.idConfigEdi, "NRORDEM": ordemRemover };
    console.log(this);
    this.EdiService.removeFieldEdi(obj).subscribe(
      data => {
        this.grid.findDataTable('dataGridCamposEdi', 'objFormFilterCamposEdi');
        this.mensagens.MensagemSucesso(data.response, '');
        this.close();
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
      }
    );
  }


  goHome(){ //IR PARA TELA INICIAL
    this.objFormRegs.reset()
    this.arBreadcrumbsLocal = [];
    this.exibir = 1;
  }

  clearNext(item) { //LIMPAR PROXIMOS PASSOS
    let ar = [];
    for (let itemFor of this.arBreadcrumbsLocal) {
      ar.push(itemFor);
      if (item.id == itemFor.id) {
        break;
      }
    }
    this.arBreadcrumbsLocal = ar;
  }

  limparFiltroErro() {
    this.textVTPTRANP = '';
    this.textVTPINCLUIR = '';
    this.textVTEMDTEMISSAO = '';
    this.textVDTENTREGARANGE = '';
    this.textVDTEMISSAOINRANGE = '';
    this.textVSTIUACAO = '';
    this.erros_objFormFilter.reset();
  }

  limparFiltroLog() {
    this.listArquivos = [];
    this.log_objFormFilter.reset();
  }

  limparFiltro() {
    this.objFormFilter.reset();
    this.grid.findDataTable('dataGridEdi', '');
  }

  // CARREGA DADOS NO DATAGRID
  getDataGridCamposEdi() {
    this.grid.findDataTable('dataGridCamposEdi', 'objFormFilterCamposEdi');
  }


  saveEdi() {

    console.log('saveEdi');
    console.log(this.objFormRegs.controls['IDG014'].value);
    var result = null;
    var copyObjFormRegs = null;
    copyObjFormRegs = Object.assign({}, this.objFormRegs.value);

    if (this.validaFormCreateEdi(this.objFormRegs)) {
      var objSaveDePara = this.objFormRegs.value;
      //# update
      if (this.checkViewCampoEdi == 1) {
        this.EdiService.updateEdi(copyObjFormRegs).subscribe(
          data => {
            this.objFormRegs.reset();
            this.mensagens.MensagemSucesso(data.response, '');
            this.exibir = 1;
            this.goHome();
            this.find(this.idDataGrid);
            this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.MensagemErro('Erro ao atualizar o cadastro', '');
            this.utilServices.loadGridHide();
          }
        );

        //# save
      } else {
        this.EdiService.addConfigEdi(copyObjFormRegs).subscribe(
          data => {

            this.objFormRegs.reset();
            this.mensagens.MensagemSucesso(data.response, '');
            this.exibir = 1;
            this.goHome();
            this.find(this.idDataGrid);
            this.utilServices.loadGridHide();
          },
          err => {
            this.mensagens.MensagemErro('Erro ao criar cadastro', '');
            this.utilServices.loadGridHide();
          }
        );

      }

    } else {
      this.mensagens.MensagemErro('Verifique o preenchimento do(s) campo(s) marcado(s) em vermelho.', '');
    }

  }

  saveFieldEdi() {
    console.log("saveFieldEdi");

    var i = 0;
    var ordemRepetida = 0;
    var colunaRepetida = '';
    for (i = 0; i < this.arrayRowsFieldEdiSelec.length; i++) {
      //var proxiam_ordem = this.arrayRowsFieldEdiSelec[this.arrayRowsFieldEdiSelec.length].NRORDEM;
      console.log("Ordem: " + this.arrayRowsFieldEdiSelec[i].NRORDEM + " Nome: " + this.arrayRowsFieldEdiSelec[i].NMCOLUNA);
      if (this.arrayRowsFieldEdiSelec[i].NRORDEM == this.objFormNewFieldEdi.controls['NRORDEM'].value) {
        ordemRepetida = 1;
        colunaRepetida = this.arrayRowsFieldEdiSelec[i].NMCOLUNA;
      }
    }
    if (ordemRepetida) {
      this.textModalOrder = 'Esta ordem para já está sendo usada para outro campo (' + colunaRepetida + ') \n deseja manter esta e alterarando a ordem geral?'
      this.modal.open(this.modalUpdateOrderField);
    } else {
      this.confirmAddFieldEdi();
    }
  }

  confirmAddFieldEdi() {
    var copyObjFormNewFieldEdi = null;
    this.objFormNewFieldEdi.controls['IDG094'].setValue(this.idConfigEdi);
    copyObjFormNewFieldEdi = Object.assign({}, this.objFormNewFieldEdi.value);

    if (this.validaFormCreateFieldEdi(this.objFormNewFieldEdi)) {
      //# NOVO
      this.EdiService.addFieldEdi(copyObjFormNewFieldEdi).subscribe(
        data => {
          this.objFormNewFieldEdi.reset();
          this.mensagens.MensagemSucesso(data.response, '');
          this.backtoUpdateEdi(); //Volta para tela de cadastro mostra a datagrid
          this.grid.findDataTable('dataGridCamposEdi', 'objFormFilterCamposEdi');
        },
        err => {
          this.mensagens.mensagemErroPadrao(err);
        }
      );
    } else {
      this.mensagens.MensagemErro('Verifique o preenchimento do(s) campo(s) marcado(s) em vermelho.', '');
    }


  }

  //Alterar ordem dos campos para o EDI
  confirmUpdateOrderFields() {
    this.objFormNewFieldEdi.controls['IDG094'].setValue(this.idConfigEdi);
    this.objFormNewFieldEdi.controls['IDG095'].setValue(this.idFieldEdi);
    var copyObjFormNewFieldEdi = null;
    copyObjFormNewFieldEdi = Object.assign({}, this.objFormNewFieldEdi.value);
    if (this.validaFormularioValido(this.objFormNewFieldEdi)) {
      this.EdiService.updateOrderField(copyObjFormNewFieldEdi).subscribe(
        data => {
          this.objFormNewFieldEdi.reset();
          this.mensagens.MensagemSucesso(data.response, '');
          this.close();
          this.backtoUpdateEdi();
        },
        err => {
          this.mensagens.mensagemErroPadrao(err);
        }
      );
    }
  }

  validaFormularioValido(objForm) {
    if (objForm.valid) {
      return true;
    } else {
      return false;
    }
  }


  validaFormCreateEdi(objForm) {
    var valid = true;
    console.log(objForm);
    if (!this.utilServices.validaField(objForm.controls['IDG014'].value)) {
      valid = false;
      $("ng-select[ng-reflect-name='IDG014'] ").addClass('invalid');
    } else {
      $('ng-select[ng-reflect-name="IDG014"]').removeClass('invalid');
    }
    if (!this.utilServices.validaField(objForm.controls['DSCLIENT'].value)) {
      valid = false;
      $('#objFormRegs input[id="DSCLIENT"]').addClass('cmpRequired');
    } else {
      $('input[id="DSCLIENT"]').removeClass('cmpRequired');
    }
    if (!this.utilServices.validaField(objForm.controls['NMARQUIV'].value)) {
      valid = false;
      $('input[id="NMARQUIV"]').addClass('cmpRequired');
    } else {
      $('input[id="NMARQUIV"]').removeClass('cmpRequired');
    }
    if (!this.utilServices.validaField(objForm.controls['NRDIAENT'].value)) {
      valid = false;
      $('input[id="NRDIAENT"]').addClass('cmpRequired');
    } else {
      $('input[id="NRDIAENT"]').removeClass('cmpRequired');
    }
    if (!this.utilServices.validaField(objForm.controls['NRDIAEMI'].value)) {
      valid = false;
      $('input[id="NRDIAEMI"]').addClass('cmpRequired');
    } else {
      $('input[id="NRDIAEMI"]').removeClass('cmpRequired');
    }
    if (!this.utilServices.validaField(objForm.controls['TPARQUIV'].value)) {
      valid = false;
      $('ng-select[formcontrolname="TPARQUIV"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="TPARQUIV"]').removeClass('invalid');
    }
    if (!this.utilServices.validaField(objForm.controls['TPCONSDT'].value)) {
      valid = false;
      $('ng-select[formcontrolname="TPCONSDT"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="TPCONSDT"]').removeClass('invalid');
    }
    //caso nao padrao
    if (!this.utilServices.validaField(objForm.controls['DSPADENT'].value)) {
      valid = false;
      $('input[id="DSPADENT"]').addClass('cmpRequired');
    } else {
      $('input[id="DSPADENT"]').removeClass('cmpRequired');
    }
    //select
    if (!this.utilServices.validaField(objForm.controls['TPTRANSP'].value)) {
      valid = false;
      $('ng-select[formcontrolname="TPTRANSP"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="TPTRANSP"]').removeClass('invalid');
    }
    //select
    if (!this.utilServices.validaField(objForm.controls['TRRECEDI'].value)) {
      valid = false;
      $('ng-select[formcontrolname="TRRECEDI"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="TRRECEDI"]').removeClass('invalid');
    }
    //select
    if (!this.utilServices.validaField(objForm.controls['TPCONSNF'].value)) {
      valid = false;
      $('ng-select[formcontrolname="TPCONSNF"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="TPCONSNF"]').removeClass('invalid');
    }
    //select
    if (!this.utilServices.validaField(objForm.controls['TPENVIO'].value)) {
      valid = false;
      $('ng-select[formcontrolname="TPENVIO"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="TPENVIO"]').removeClass('invalid');
    }
    if (!this.utilServices.validaField(objForm.controls['DSENVIO'].value)) {
      valid = false;
      $('input[id="DSENVIO"]').addClass('cmpRequired');
    } else {
      $('input[id="DSENVIO"]').removeClass('cmpRequired');
    }
    if (!this.utilServices.validaField(objForm.controls['HREXECUT'].value)) {
      valid = false;
      $('input[id="HREXECUT"]').addClass('cmpRequired');
    } else {
      $('input[id="HREXECUT"]').removeClass('cmpRequired');
    }
    if (!this.utilServices.validaField(objForm.controls['HRREPETE'].value)) {
      valid = false;
      $('input[id="HRREPETE"]').addClass('cmpRequired');
    } else {
      $('input[id="HRREPETE"]').removeClass('cmpRequired');
    }
    //seelct
    if (!this.utilServices.validaField(objForm.controls['NMDIAEXE'].value)) {
      valid = false;
      $('ng-select[formcontrolname="NMDIAEXE"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="NMDIAEXE"]').removeClass('invalid');
    }
    if (!this.utilServices.validaField(objForm.controls['HRLIMRPT'].value)) {
      valid = false;
      $('input[id="HRLIMRPT"]').addClass('cmpRequired');
    } else {
      $('input[id="HRLIMRPT"]').removeClass('cmpRequired');
    }
    return valid;
  }

  validaFormCreateFieldEdi(objForm) {
    var valid = true;                                               

    if (!this.utilServices.validaField(objForm.controls['IDS010'].value)) {
      valid = false;
      $('ng-select[formcontrolname="IDS010"]').addClass('invalid');
    } else {
      $('ng-select[formcontrolname="IDS010"]').removeClass('invalid');
    }

    return valid;
  }

  filtrarLog() {
    this.utilServices.loadGridShow();
    this.listArquivos = [];
    if(this.validaFormFiltroFileEdi(this.log_objFormFilter)){
      let objParams = {
        DT_PROCESS: this.log_objFormFilter.controls['DT_PROCESS'].value,
        NM_PASTA: this.log_objFormFilter.controls['NM_PASTA'].value,
        NMCLIENT: this.log_objFormFilter.controls['NMCLIENT'].value
      }
      this.EdiService.listarArquivos(objParams).subscribe(
        data => {
          this.listArquivos = data;
          this.utilServices.loadGridHide();
        },
        err => {
          this.toastr.error('Erro ao buscar as informações: '+err);
          this.utilServices.loadGridHide();
        }
      );
    }else{
      this.mensagens.MensagemErro('Verifique o preenchimento do(s) campo(s) marcado(s) em vermelho.', '');
      this.utilServices.loadGridHide();
    }
  }

  filtrarErro(){
    this.utilServices.loadGridShow();
    let objParams = {
        NRNOTA: this.erros_objFormFilter.controls['NRNOTA'].value,
        NMCLIENT: this.erros_objFormFilter.controls['NMCLIENT'].value
      }
    this.EdiService.verificarErro(objParams).subscribe(
        data => {
          this.textVTPTRANP = 'Tipo de Transporte: '+ this.formatNull(data.VTPTRANP);
          this.textVTPINCLUIR = 'Tipo de Operação: '+ this.formatNull(data.VTPINCLUIR);
          this.textVTEMDTEMISSAO = 'Data de Emissão preenchida: '+ this.formatNull(data.VTEMDTEMISSAO);
          this.textVDTENTREGARANGE = 'Data de Entrega dentro do período configurado: '+this.formatNull(data.VDTENTREGARANGE);
          this.textVDTEMISSAOINRANGE = 'Data de Emissão dentro do período configurado: '+this.formatNull(data.VDTEMISSAOINRANGE);
          this.textVSTIUACAO = 'Situação: '+this.formatNull(data.VSTIUACAO);
          this.utilServices.loadGridHide();
        },
        err => {
          this.toastr.error('Erro ao buscar as informações: '+err);
          this.utilServices.loadGridHide();
        }
      );
    this.utilServices.loadGridHide();
  }

  formatNull(text) {
    if (text == 'null' || text == undefined) {
      return text = "N/A";
    }else{
      return text;
    }
  }

  validaFormFiltroFileEdi(objForm) {
    var valid = true;
    if (!this.utilServices.validaField(objForm.controls['NMCLIENT'].value)) {
      valid = false;
      $('ng-select[ng-reflect-name="NMCLIENT"]').addClass('invalid');
    } else {
      $('ng-select[ng-reflect-name="NMCLIENT"]').removeClass('invalid');
    }
    if (!this.utilServices.validaField(objForm.controls['NM_PASTA'].value)) {
      valid = false;
      $('ng-select[ng-reflect-name="NM_PASTA"]').addClass('invalid');
    } else {
      $('ng-select[ng-reflect-name="NM_PASTA"]').removeClass('invalid');
    }
    return valid;
  }
  //# DataGRID
  find(id) {
    this.grid.findDataTable(id);
  }

  converteData(dates) {
    var datas = [];
    var otraData = [];
    for (var i = 0; i < dates.length; i++) {
      otraData[i] = {};
      for (var ii in dates[i]) {
        if (dates[i][ii] < 10) {
          otraData[i][ii] = "0" + dates[i][ii];
        } else {
          otraData[i][ii] = dates[i][ii];
        }
      }
      datas[i] = otraData[i].day + "/" + otraData[i].month + "/" + otraData[i].year;
    }
    return datas;
  }

  processarEdi(id){
    var obj = { "IDG094": id };
    this.EdiService.processarEdi(obj).subscribe(
      data => {
        console.log(data)
        if(data){
          this.mensagens.MensagemSucesso('Requisição enviada com sucesso.', '');
        }else{
          this.mensagens.MensagemErro('Processamento desativado para este cliente.', '');
        }
      },
      err => {
        this.mensagens.mensagemErroPadrao(err);
      }
    );
  }

  visualizarArquivo(obj) {
    this.objArquivoDownload = obj;
    this.utilServices.loadGridShow();
    this.EdiService.visualizarArquivo(obj).subscribe(
      data => {
        this.detalheArquivo = data.split('\n');
        for (let i = 0; i < (this.detalheArquivo.length - 1); i++) {
          this.detalheArquivo[i] = this.detalheArquivo[i];
        }
        this.modal.open(this.modalViewDetalheArquivo, { size: 'xl' as 'lg', windowClass: 'modal-adaptive' });
        this.utilServices.loadGridHide();
      },
      err => {
        console.log(err);
        this.toastr.error('Erro ao buscar as informações: ', err);
        this.utilServices.loadGridHide();
      }
    )
  }

  downloadArquivoEdi() {
    let objeto = this.objArquivoDownload;
    return this.EdiService.downloadAnexo({ objeto }).subscribe(data => {
      let url = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = url;
      link.download = objeto.ARQUIVO;
      link.dispatchEvent(new MouseEvent('click'));
    });
  }
}


