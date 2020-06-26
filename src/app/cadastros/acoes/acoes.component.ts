//IMPORTS
import { Component, OnInit, ViewChild, TemplateRef, DoCheck       } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ToastrService                                   } from 'ngx-toastr';
import * as $ from 'jquery';

//COMPONENTES-BRAVO
import { MensagensComponent    } from '../../shared/componentesbravo/src/app/componentes/mensagens/mensagens.component';
import { ModalComponent        } from '../../shared/componentesbravo/src/app/componentes/modal/modal.component';
import { DatagridComponent     } from '../../shared/componentesbravo/src/app/componentes/datagrid/datagrid.component';
import { SingleEstadoComponent } from '../../shared/componentesbravo/src/app/componentes/filter/single-estado/single-estado.component';

//SERVICES
import { GlobalsServices       } from '../../shared/componentesbravo/src/app/services/globals.services';
import { UtilServices } from '../../shared/componentesbravo/src/app/services/util.services';
import { AcoesService    } from './../../services/crud/acoes.service';
import { MotivosService    } from './../../services/crud/motivos.service';
import { AdminLayoutService } from '../../services/admin-layout.service';




@Component({
  selector   : 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls  : ['./acoes.component.scss']
})
export class AcoesComponent implements OnInit, DoCheck {
  private global = new GlobalsServices();

  // #####  ANCHORS  #####
  @ViewChild('breadcrumbs')       breadcrumbs;
  @ViewChild('tableMunicipios')   tableMunicipios: any;
  @ViewChild('acc')               acc: any;
  @ViewChild('modalDelete')       private modalDelete;
  @ViewChild('modalDeleteMotivo') private modalDeleteMotivo;
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

  public objFormConfigMotivo: FormGroup;


    constructor(
      private mensagens     : MensagensComponent,
      private acoessService : AcoesService,
      private motivosService: MotivosService,
      private util          : UtilServices,
      private formBuilder   : FormBuilder,
      private toastr        : ToastrService,
      private modal         : ModalComponent,
      private grid          : DatagridComponent,
      private adminLayoutService: AdminLayoutService
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
      this.teste = "Texto do parametro";

      this.iniciaFormConfig();
    }

    ngDoCheck(){
      if(this.adminLayoutService.exibir == true){
        this.exibir = 1;
        this.arBreadcrumbsLocal = [];
        this.adminLayoutService.exibir = false;
      }
    }

    iniciaFormConfig() {
      this.objFormConfigMotivo = this.formBuilder.group({
        A002_IDA002: [],
        formConfigMotivo: this.formBuilder.array([])
      });
    }

    private getItemContato() {
      return this.formBuilder.group({
        IDG075  : [''], // Preenche apenas em edição
        TPINPUT : ['' , Validators.required],
        TMCAMPO : ['' , Validators.required],
        SNOBRIGA: ['1', Validators.required],
        TPLOGIST: ['' , Validators.required],
        SNCAMPO : ['1', Validators.required],
        NMLABEL : ['' , Validators.required],
      });
    }

    // add new row
    private addFormConfigMotivo() {
      const control = <FormArray>this.objFormConfigMotivo.controls['formConfigMotivo'];
      control.push(this.getItemContato());
    }

    // remove row
    private removeFormConfigMotivo(i: number) {
      const control = <FormArray>this.objFormConfigMotivo.controls['formConfigMotivo'];
      control.removeAt(i);
    }

    openAddAcao(){ //ABRE TELA PARA ADICIONAR NOVA
      this.exibir = 2;
      this.viewMsg = false;
      this.set(1,"Nova Ação", "openAddAcao", null, "fa fa-plus");
      this.checkViewMunicipio = true;
    }

  save(){
    if (this.objForm.valid) {
      if (this.objForm.controls['IDA008'].value != '' &&
        this.objForm.controls['IDA008'].value != undefined &&
        this.objForm.controls['IDA008'].value != null) {
        this.acoessService.updateAcao(this.objForm.value).subscribe(
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
        this.acoessService.addAcao(this.objForm.value).subscribe(
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

  saveMotivo() {

    let configMotivo = this.objFormConfigMotivo.controls['formConfigMotivo'];

    if (this.objFormMotivo.valid && configMotivo.valid) {
      this.util.loadGridShow();
      this.toastr.info('Salvando motivo...', 'AGUARDE:');

      let objMotivo = this.objFormMotivo.value;

      objMotivo['ARCONFIG'] = configMotivo.value; // Add array de configurações

      if (this.objFormMotivo.controls['IDA002'].value != '' &&
          this.objFormMotivo.controls['IDA002'].value != undefined &&
          this.objFormMotivo.controls['IDA002'].value != null) {

          if(this.objFormMotivo.controls  ['SNVISCLI'].value == null){
            this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);
          }

          this.motivosService.updateMotivo(objMotivo).subscribe(
            data => {
                this.toastr.success('Motivo alterado com sucesso.', 'SUCESSO:');
                this.util.loadGridHide();

                this.find('gridMotivos');
                this.idAcao = this.objFormMotivo.controls['IDA008'].value;
                this.objFormMotivo.reset();
                this.objFormMotivo.controls['IDA008'].setValue(this.objFormFilter.controls['IDA008'].value);
                this.objFormMotivo.controls['SNVISCLI'].setValue(0);
                this.iniciaFormConfig();
            },
            err => {
              this.toastr.error("Não foi possível alterar o motivo.", "ERRO:");
              this.util.loadGridHide();
              console.error(err);
            }
          );

      } else {

        if (this.objFormMotivo.controls['SNVISCLI'].value == null) {
          this.objFormMotivo.controls['SNVISCLI'].setValue(0);
        }

        this.motivosService.addMotivo(objMotivo).subscribe(
          data => {
            this.toastr.success('Motivo criado com sucesso.', 'SUCESSO:');
            this.util.loadGridHide();

            this.find('gridMotivos');
            this.idAcao = this.objFormMotivo.controls['IDA008'].value;
            this.objFormMotivo.reset();
            this.objFormMotivo.controls['IDA008'].setValue(this.objFormFilter.controls['IDA008'].value);
            this.objFormMotivo.controls  ['SNVISCLI'].setValue(0);
            this.iniciaFormConfig();
          },
          err => {
            this.toastr.error("Não foi possível criar o motivo.", "ERRO:");
            this.util.loadGridHide();
            console.error(err);
          }
        );
      }
    } else {
      this.toastr.error("Há campos incompletos.", "ERRO:");
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
    this.acoessService.getAcao(obj).subscribe(
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
    this.acoessService.deleteAcao(objAcao).subscribe(
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

  }

  openNewMotivo(id){
    this.exibir = 3;
    this.idAcao = id;
    this.objAcao = JSON.parse($( 'input[type="hidden"][name="obj_checkbox_gridAcoes_'+id+'"]')[0].value);
    this.strCardMotivo = "Adicionar Motivo";
    this.strButton = "Adicionar"
    this.objFormFilter.controls['IDA008'].setValue(id);
    this.checkViewMunicipio = true;
    this.iniciaFormConfig();
    this.set(1,"Novo Motivo - " + this.objAcao.DSACAO, "openNewMotivo", id, "fa fa-plus");
  }

  openUpdateMotivo(id) {
    this.util.loadGridShow();
    let data = {'IDA002': id};
      this.motivosService.getMotivo(data).subscribe(
        data => {
          this.toastr.success('Motivo carregado com sucesso.', 'SUCESSO:');

          this.strCardMotivo = 'Editar Motivo ' + data.IDA002;
          this.strButton     = "Salvar";

          console.log(data.SNVISCLI);
          this.objFormMotivo.controls['SNVISCLI'].setValue(data.SNVISCLI);
          this.objFormMotivo.controls['DSTPMOTI'].setValue(data.DSTPMOTI);
          this.objFormMotivo.controls['DSDETA'  ].setValue(data.DSDETA);
          this.objFormMotivo.controls['IDA002'].setValue(data.IDA002);
          
          this.iniciaFormConfig();

          let control = <FormArray>this.objFormConfigMotivo.controls['formConfigMotivo'];

          if (data['ARCONFIG'] && data['ARCONFIG'].length > 0) {
            for (let config of data['ARCONFIG']) {
              let objForm = this.formBuilder.group({
                IDG075  : [config.IDG075  ],
                TPINPUT : [config.TPINPUT ],
                TMCAMPO : [config.TMCAMPO ],
                SNOBRIGA: [config.SNOBRIGA],
                TPLOGIST: [config.TPLOGIST],
                SNCAMPO : [config.SNCAMPO ],
                NMLABEL : [config.NMLABEL ],
              });
              control.push(objForm);
            }
          }

          this.util.loadGridHide();
        },
        err => {
          this.toastr.error("Não foi possível buscar dados do motivo.", "ERRO:");
          this.util.loadGridHide();
          console.error(err);
        }
      );
  }

  openDeleteMotivo(id){ //ABRE MODAL DE CONFIRMAÇÃO
    this.idMotivo = id;
    this.modal.open(this.modalDeleteMotivo);
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
