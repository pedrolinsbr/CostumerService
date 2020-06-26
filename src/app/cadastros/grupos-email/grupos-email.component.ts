//IMPORTS
import { Component, OnInit, ViewChild, TemplateRef       } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService                                   } from 'ngx-toastr';
import * as $ from 'jquery';

//COMPONENTES-BRAVO
import { MensagensComponent    } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent        } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent     } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { SingleEstadoComponent } from '../../shared/componentesbravo/src/app/componentes/filter/single-estado/single-estado.component';

//SERVICES
import { GlobalsServices       } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices    } from '../../services/util.services';
import { GruposEmailService    } from './../../services/crud/grupos-email.service';
import { MotivosService    } from './../../services/crud/motivos.service';




@Component({
  selector   : 'app-grupos-email',
  templateUrl: './grupos-email.component.html',
  styleUrls  : ['./grupos-email.component.scss']
})
export class GruposEmail implements OnInit {
  private global = new GlobalsServices();

  // #####  ANCHORS  #####
  @ViewChild('breadcrumbs')       breadcrumbs;
  @ViewChild('tableMunicipios')   tableMunicipios: any;
  @ViewChild('acc')               acc: any;
  @ViewChild('modalDelete')       private modalDelete;
  @ViewChild('modalDeleteEmail') private modalDeleteEmail;
  @ViewChild('modalConfirm')      private modalConfirm;

  // #####  BOOLEANS  #####
  exibirFormAdd      = false;
  checkViewMunicipio = true;
  viewMsg            : boolean;

  // #####  STRINGS  #####
  apiService    : any;
  url           = this.global.getApiHost();
  strCardMotivo : any;
  dsAcao        : any;
  strButton     : any;

  teste: any;

  // #####  INTS  #####
  exibir      = 1;
  idAcao      : any;
  idMotivo    : any;
  idvalid     : any;
  closeResult : string;

  // ##### FORMS #####
  objForm       : FormGroup;
  objFormMotivo : FormGroup;
  objFormFilter : FormGroup;

  // #####  ARRAYS | OBJECTS  #####
  arBreadcrumbsLocal = [];
  dataSelecionada    = [{year: 2018, month: 2, day: 28}];
  dataMaxima         = [{year: 2018, month: 2, day: 28}];
  dataMinima         = [{year: 2018, month: 2, day: 28}];
  objAcao            : any;

    constructor(
      private mensagens         : MensagensComponent,
      private grupoEmailService : GruposEmailService,
      private motivosService    : MotivosService,
      private util              : UtilServices,
      private formBuilder       : FormBuilder,
      private toastr            : ToastrService,
      private modal             : ModalComponent,
      private grid              : DatagridComponent
    ){
      this.objForm = formBuilder.group({
        IDA008: [],
        DSACAO: ['',Validators.compose([Validators.required,Validators.maxLength(50)])]
      });

      this.objFormMotivo = formBuilder.group({
        IDA002   : [],
        IDA008   : [],
        SNVISCLI : [],
        DSTPMOTI : ['',Validators.compose([Validators.required,Validators.maxLength(75)])],
        DSDETA   : ['',Validators.compose([Validators.maxLength(250)])]
      });


      this.objFormFilter = formBuilder.group({
        IDA008: []
      });


    }

    ngOnInit() {
      this.objForm; //inicia biding com o form
      this.teste = "Texto do parametro"
    }

    openAddAcao(){ //ABRE TELA PARA ADICIONAR NOVA
      this.exibir = 2;
      this.viewMsg = false;
      this.set(1,"Nova Ação", "openAddAcao", null, "fa fa-plus");
      this.checkViewMunicipio = true;
    }

    validaFormularioValido() {
      if (this.objForm.valid) {
        return true;
      } else {
        return false;
      }
    }

    validaFormularioValido2() {
      if (this.objFormMotivo.valid) {
        return true;
      } else {
        return false;
      }
    }

    save(){
      if (this.validaFormularioValido()) {
        if (this.objForm.controls['IDA008'].value != '' &&
          this.objForm.controls['IDA008'].value != undefined &&
          this.objForm.controls['IDA008'].value != null) {
          this.grupoEmailService.updateAcao(this.objForm.value).subscribe(
            data => {
                this.objForm.reset();
                this.toastr.success('Ação alterada com sucesso.');
                this.exibir = 1;
            },
            err => {
              this.toastr.error("Não foi possível alterar a ação.");
            }
          );
        } else {
          this.grupoEmailService.addAcao(this.objForm.value).subscribe(
            data => {
              if (typeof data.id !== undefined) {
                this.objForm.reset();
                this.toastr.success('Ação criada com sucesso.')
              }
              this.objForm.reset();
            },
            err => {
              this.toastr.error("Não foi possível criar a ação.");
            }
          );
        }
      } else {
        this.toastr.error("Há campos incompletos.");
      }
    }

  saveMotivo(){

    if (this.validaFormularioValido2()) {
      if (this.objFormMotivo.controls['IDA002'].value != '' &&
        this.objFormMotivo.controls  ['IDA002'].value != undefined &&
        this.objFormMotivo.controls  ['IDA002'].value != null) {

          if(this.objFormMotivo.controls  ['SNVISCLI'].value == null){
            this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);
          }
        this.motivosService.updateMotivo(this.objFormMotivo.value).subscribe(
          data => {
              this.idAcao = this.objFormMotivo.controls['IDA008'].value;
              this.objFormMotivo.reset();
              this.objFormMotivo.controls['IDA008'].setValue(this.objFormFilter.controls['IDA008'].value);
              this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);
              this.toastr.success('Motivo alterado com sucesso.');
              //this.exibir = 1;
              this.find('gridMotivos');
          },
          err => {
            this.toastr.error("Não foi possível alterar o motivo.");
          }
        );
      } else {
        if(this.objFormMotivo.controls  ['SNVISCLI'].value == null){
          this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);
        }

        this.motivosService.addMotivo(this.objFormMotivo.value).subscribe(
          data => {
            if (typeof data.id !== undefined) {
              this.objForm.reset();
              this.toastr.success('Motivo criado com sucesso.')
            }
            this.find('gridMotivos');
            this.idAcao = this.objFormMotivo.controls['IDA008'].value;
            this.objFormMotivo.reset();
            this.objFormMotivo.controls['IDA008'].setValue(this.objFormFilter.controls['IDA008'].value);
            this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);

          },
          err => {
            this.toastr.error("Não foi possível criar o motivo.");
          }
        );
      }
    } else {
      this.toastr.error("Há campos incompletos.");
    }
  }

  set(id, name, functionName,parameter, icon){//FUNÇÃO SETA NOVOS PASSOS (BREADCRUMBS)
    let valid = true;
    let data = {
      id: id,
      name: name,
      function: functionName,
      parameter: parameter,
      icon: icon
    }
    for(let item of this.arBreadcrumbsLocal){
      if(item.id == data.id || item.name == name){
        valid = false;
      }
    }
    if(valid){
      this.arBreadcrumbsLocal.push(data);
    }
  }
  goHome(event){ //IR PARA TELA INICIAL
    this.objFormFilter.reset();
    this.find('gridAcoes')
    if (this.objForm.touched) {
      this.modal.open(this.modalConfirm);
    } else {
      this.cancelarCadastro();
    }
  }

  checaValoresFormulario(event) {
    this.objFormFilter.reset();
    this.find('gridAcoes')
    if (this.objForm.touched) {
      this.modal.open(this.modalConfirm);
    } else {
      this.cancelarCadastro();
    }
  }

  cancelarCadastro() {
    this.strButton= "Adicionar"
    this.objForm.reset()
    this.arBreadcrumbsLocal = [];
    this.exibir = 1;
  }

  leaveCadastro() {
    this.objForm.reset()
    this.arBreadcrumbsLocal = [];
    this.exibir = 1;
    this.close();
  }

  clearNext(item){ //LIMPAR PROXIMOS PASSOS
      let ar = [];
      for(let itemFor of this.arBreadcrumbsLocal){
        ar.push(itemFor);
        if(item.id == itemFor.id){
          break;
        }
      }
    this.arBreadcrumbsLocal = ar;
  }

  getAcao(idAcao){
    this.viewMsg = false;
    var obj = {'IDA008': idAcao};
    this.grupoEmailService.getAcao(obj).subscribe(
      data=>{
         this.objForm.controls['IDA008'].setValue(data.IDA008);
         this.objForm.controls['DSACAO'].setValue(data.DSACAO);
         if(data.SNPADRAO == 1){
           this.checkViewMunicipio = false;
           this.viewMsg = true;
         }
         this.exibir = 2;
      }
    );
    this.set(1,"Detalhes Ação", "getAcao", idAcao, "fa fa-map");
  }

  viewAcao(id) {
      this.checkViewMunicipio = false;
      this.getAcao(id);
  }

  openUpdateAcao(id) {
      this.checkViewMunicipio = true;
      this.getAcao(id);
  }

  openDelete(id){ //ABRE MODAL DE CONFIRMAÇÃO
    this.idAcao = id;
    this.modal.open(this.modalDelete);
  }

  deleteAcao(){
    var objAcao = {'IDA008':this.idAcao};
    this.grupoEmailService.deleteAcao(objAcao).subscribe(
      data => {
        this.find('gridAcoes');
        this.objForm.reset();
        this.toastr.success('Ação deletada com sucesso.')
        this.close();
      },
      err => {
        this.mensagens.MensagemErro('Algo deu errado.','Ops!');
       }
    );
  }

  find(id){
    this.grid.findDataTable(id);
  }

  close(){
    this.modal.closeModal();
  }

  filtrar(){
    this.find('gridAcoes');
  }
  limparFiltro(){
    this.objFormFilter.reset();
    this.find('gridAcoes');

  }

  openNewMotivo(id){
    this.exibir = 3;
    this.idAcao = id;
    this.objAcao = JSON.parse($( 'input[type="hidden"][name="obj_checkbox_gridAcoes_'+id+'"]')[0].value);
  //  console.log("Deu certo isso aqui ou não?? :: ", this.objAcao);
    this.strCardMotivo = "Adicionar Motivo";
    this.strButton = "Adicionar"
    this.objFormFilter.controls['IDA008'].setValue(id);
    this.checkViewMunicipio = true;
    this.set(1,"Novo Motivo - " + this.objAcao.DSACAO, "openNewMotivo", id, "fa fa-plus");
  }

  openUpdateMotivo(id) {
    this.grid.loadGridShow();
    let data = {'IDA002': id};
      this.motivosService.getMotivo(data).subscribe(
        data => {
          this.strCardMotivo = 'Editar Motivo ' + data.IDA002;
          this.strButton = "Salvar"
          this.objFormMotivo.controls['SNVISCLI'].setValue(data.SNVISCLI)
          this.objFormMotivo.controls['DSTPMOTI'].setValue(data.DSTPMOTI)
          this.objFormMotivo.controls['DSDETA'].setValue(data.DSDETA)
          this.objFormMotivo.controls['IDA002'].setValue(data.IDA002)
          this.grid.loadGridHide();

        //console.log("Olá :: ", data)
        }
      );
  }

  openDeleteMotivo(id){ //ABRE MODAL DE CONFIRMAÇÃO
    this.idMotivo = id;
    this.modal.open(this.modalDeleteEmail);
  }

  deleteMotivo(){
    var objMotivo= {'IDA002':this.idMotivo};
    this.motivosService.deleteMotivo(objMotivo).subscribe(
      data => {
        this.find('gridMotivos');
        this.objFormMotivo.reset();
        this.objFormMotivo.controls['IDA008'].setValue(this.objFormFilter.controls['IDA008'].value);
        this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);
        this.toastr.success('Motivo deletado com sucesso.')
        this.close();
      },
      err => {
        this.mensagens.MensagemErro('Algo deu errado.','Ops!');
       }
    );
  }

}
