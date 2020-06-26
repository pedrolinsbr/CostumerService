<template>
  <q-page style="height: 100% !important; background-color: #e6e6e6 !important; overflow-x: hidden;">
    <div class="q-pa-md q-gutter-sm">
     <q-dialog v-model="confirmar">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar alteração de dados.</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <p>Deseja realmente confirmar seu comentário e nota?.</p>
          <p>Nome: {{nmavalia}}</p>
          <p>Comentário: {{coment}}</p>
          <p>Nota: {{starsCount}}</p>
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn label="Confirmar" color="green" @click="salvarAvaliacao" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>    
  </div>

  <div class="q-pa-md q-gutter-sm">
     <q-dialog v-model="confirmarDescadastro">
      <q-card>
        <q-card-section>
          <div class="text-h6">Confirmar descadastro de e-mail</div>
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 50vh" class="scroll">
          <p>Deseja realmente confirmar o descadastro de recebimento deste e-mail?.</p>        
        </q-card-section>
        <q-separator />
        <q-card-actions align="right">
          <q-btn label="Cancelar" color="red" v-close-popup />
          <q-btn label="Confirmar" color="green" @click=" unsubMail" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>    
  </div>  

    <div class="row bod2" style="margin-right: 0px !important;" v-if="!validaSyngenta && !validaFmc && !validaAdama">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center">
        <img src="../../assets/images/bravo-logo-01.png" alt="">
      </div>
    </div>

    <div class="row bod2" v-if="validaSyngenta && !validaFmc && !validaAdama">
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      <div class="col-sm-4 col-md-2 col-lg-2 col-xs-4">
        <img src="../../assets/images/1.1.4-Horizontal-Sem_Slongan-Sem_Fundo.png" alt="" style="margin-top: 20%; max-width: 100%;">
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 col-xs-4"></div>
      <div class="col-md-2 col-sm-4 col-lg-2 col-xs-4">
        <img src="../../assets/images/syngenta.png" alt="" style="margin-top: 16%; max-width: 100%; ">
      </div>
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      
    </div>
      

    <div class="row bodFmc" v-if="!validaSyngenta && validaFmc && !validaAdama">
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      <div class="col-sm-4 col-md-2 col-lg-2 col-xs-4">
        <img src="../../assets/images/1.1.4-Horizontal-Sem_Slongan-Sem_Fundo.png" alt="" style="margin-top: 60%; max-width: 100%; ">
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 col-xs-4"></div>
      <div class="col-md-2 col-sm-4 col-lg-2 col-xs-4">
        <img src="../../assets/images/logo_FMC_final_rgb.png" alt="" style="margin-top: 54%; max-width: 100%;">
      </div>
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>

    </div>

    <div class="row bodFmc" v-if="!validaSyngenta && !validaFmc && validaAdama">
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>
      <div class="col-sm-4 col-md-2 col-lg-2 col-xs-4">
        <img src="../../assets/images/1.1.4-Horizontal-Sem_Slongan-Sem_Fundo.png" alt="" style="margin-top: 60%; max-width: 100%; ">
      </div>
      <div class="col-sm-4 col-md-4 col-lg-4 col-xs-4"></div>
      <div class="col-md-2 col-sm-4 col-lg-2 col-xs-4">
        <img src="../../assets/images/Logo_ADAMA.png" alt="" style="margin-top: 54%; max-width: 100%;">
      </div>
      <div class="col-md-2 col-sm-0 col-lg-2 col-xs-0"></div>

    </div>

    <div class="row bod" style="margin-right: 0px !important;">
      <div class="col-md-2 col-sm-2 col-lg-2 col-xs-2"></div>
      <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8 content">
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 content-title">
            
            {{this.txtTitleBar}}
          </div>
        </div>

        <br />
        <div v-if="isLoading" class="alert alert-warning" role="alert">
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <q-spinner
                color="orange"
                size="50px"
              />
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;<strong>Carregando...</strong>
            </div>
          </div>
        </div>

        <div v-if="isAvaliado" class="alert alert-success" role="alert">
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <i class="fa fa-smile fa-5x" style="color: #228B22"></i>
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;<strong>Obrigado!</strong> Essa entrega já foi avaliada.
            </div>
          </div>
        </div>

        <div v-if="isAvaliadoNow" class="alert alert-success" role="alert">
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <i class="fa fa-smile fa-5x" style="color: #228B22"></i>
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;<strong>Obrigado!</strong> Essa entrega foi avaliada com sucesso.
            </div>
          </div>
        </div>

        <div v-if="isUnsubNow" class="alert alert-success" role="alert">
          <div class="row">
            <div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div>
            <div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 text-center">
              Descreva o motivo para o descastramento de seu e-mail
              <div class="form-group" style="margin-top: 15px;">
                <q-input
                  v-model="comentUnsub"
                  filled
                  type="textarea"
                  placeholder="Digite seu comentário..."
                  style="resize:none;"
                  :rules="[ val => val.length <= 255 || 'Use no máximo 255 characters']"
                />
              </div>
            </div>
            <div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div>
          </div>
          <div class="row vertical-align"  style="margin-bottom: 20px;">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center">              
              <br>
              <q-btn label="Confirmar" color="green" @click="confirmarDescadastro = true" v-close-popup />
              <br>
            </div>
          </div>
        </div>

        <div v-if="isUnsubOK" class="alert alert-success" role="alert">        
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <i class="fa fa-smile fa-5x" style="color: #228B22"></i>
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;Seu e-mail foi descadastrado com sucesso.
            </div>
          </div>
        </div>

        <div v-if="isNotFound" class="alert alert-danger" role="alert">
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <i class="fa fa-frown fa-5x" style="color: #cc0000"></i>
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;<strong>Ops!</strong> Não foi possível encontrar uma entrega para esta solicitação.
            </div>
          </div>
        </div>

        <div v-if="errorSave" class="alert alert-danger" role="alert">
          <div class="row vertical-align">
            <div class="col-xs-3 col-sm-3 col-md-1 col-lg-1">
              <i class="fa fa-frown fa-5x" style="color: #cc0000"></i>
            </div>
            <div class="col-xs-9 col-sm-9 col-md-10 col-lg-10">
              &nbsp;<strong>Ops!</strong> Não foi possível avaliar a entrega.
            </div>
          </div>
        </div>

        <div v-if="isAvaliando && !isAvaliado">
          <div class="row" style="padding-top: 30px; ">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center">
              <!-- <small class="fw-300">
                Olá
              </small>
              <small class="fw-300">
                Numa escala de 0 a 5,
              </small> <br>
              <small class="fw-300">
                qual o seu grau de satisfação com nossa entrega?
              </small> -->
              VOCE AVALIOU SUA EXPERIÊNCIA COM {{starsCount}} ESTRELA(S).
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center" style="margin-top: 20px;">
              <q-rating
                v-model="starsCount"
                size="2em"
                color="orange"
                :max="10"
                                
              />
              <br/><br/>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div>
            <div class="col-xs-10 col-sm-10 col-md-6 col-lg-6 text-center">
              O QUE PODERIAMOS FAZER PARA TORNAR SUA EXPERIÊNCIA AINDA MELHOR?
              <div class="form-group" style="margin-top: 15px;">
                <q-input filled v-model="nmavalia" label="Nome" :dense="dense" />
              </div>
              <div class="form-group" style="margin-top: 15px;">
                <q-input
                  v-model="coment"
                  filled
                  type="textarea"
                  placeholder="Digite seu comentário..."
                  style="resize:none;"
                />
              </div>
            </div>
            <div class="col-xs-1 col-sm-1 col-md-3 col-lg-3"></div>
          </div>

          <br />
          
          <div class="row"  style="margin-bottom: 20px;" >
            <div class="col-sm-12 col-md-12 col-lg-12 col-xs-12 text-center">
              <q-btn  @click="confirmar = true"  color="deep-orange" label="Avaliar"/>
            </div>
          </div>

        </div>

      </div>
      <div class="col-md-2 col-sm-2 col-lg-2 col-xs-2"></div>
    </div>
    <footer v-if="validaSyngenta && !validaFmc" class="bod3">
      <small>Em caso de dúvidas ou esclarecimentos entrar em contato com o Centro Avançado Syngenta de Atendimento</small><br>
      <img src="../../assets/images/casa.png" alt="" width="150px"> <br />
        0800 704 4304
    </footer>
  </q-page>
</template>

<style>

  .content-title{
    background: #f06724;
    color: #fff;
    text-align: center;
    padding-top: 7px;
    padding-bottom: 7px;
    font-size: 18px;
  }

  .bod2{
    /*padding-top: 40px !important;*/
    /*padding-bottom: 20px !important;*/
    background: #e6e6e6 !important;
    /* width: 100% !important; */
    overflow-x: hidden !important;
  }

  .bodFmc{
    /*padding-top: 40px !important;
    padding-bottom: 10px !important;*/
    background: #e6e6e6 !important;
    /* width: 100% !important; */
    overflow-x: hidden !important;
  }

  .content{
    background-color: #f5f5f5;
    /* height: 440px !important; */
    height: 100% !important;
  }

  .string{
    color: red !important;
  }

  .btnPersonal{
    background: #f06724;
    color: #fff;
    font-size: 21px;
  }

  .alert .alert-icon-col {
    min-width: 25px;
    max-width: 25px;
  }

  .vertical-align {
    display: flex;
    align-items: center;
  }

  .configuration {
    width: 240px;
    position: fixed;
    right: 0;
    top: 150px;
    margin-left: 0;
    z-index: 99999999;
    transition: transform .3s ease-in-out;
    transform: translate(100%, 0);
  }

  .configuration > .card{
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    margin: 0;
    border-radius: 0;
  }

  .configuration.active {
    transform: translate(0, 0);
  }
  .configuration-cog {
    width: 50px;
    height: 50px;
    position: absolute;
    left: -50px;
    line-height: 50px;
    font-size: 24px;
    text-align: center;
    background: #fff;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    cursor: pointer;

  }

  .configuration-cog > i:before {
    line-height: 50px;
  }

  a.navigation-link:hover {
    background: #0091ea;
      background: -moz-linear-gradient(-45deg, #0091ea 0%, #0091ea 100%);
      background: -webkit-linear-gradient(-45deg, #0091ea 0%, #0091ea 100%);
      background: linear-gradient(135deg, #0091ea 0%, #0091ea 100%);
      /*filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=$qp-color-1, endColorstr=$qp-color-2,GradientType=1 );*/
      -webkit-transition: opacity 0.2s ease-out;
      -moz-transition: opacity 0.2s ease-out;
      -o-transition: opacity 0.2s ease-out;
      transition: opacity 0.2s ease-out;
      -webkit-transition: width 0.3s ease-in-out;
      -moz-transition: width 0.3s ease-in-out;
      -o-transition: width 0.3s ease-in-out;
      transition: width 0.3s ease-in-out;
  }

  a.navigation-link.relative {
    border-left: 2px solid #0091ea;
  }

  .bod3{
    background: #e6e6e6 !important;
    /* width: 100% !important;
    height: 75% !important; */
    overflow-x: hidden !important;
    text-align: center;
    margin-top: 30px;
  } 


</style>

<script>

import axios from 'axios'

export default {
  data () {
    return {

      dense: false,
      confirmar: false,
      confirmarDescadastro: false,
      param: '',
      nota: 0,
      starsCount: 0,
      unsub: '',
      objFormSalvarSatisfacao: {
        NRNOTA: ['10'],
        DSCOMENT: '',
        IDG051: '',
        IDG061: '',
        NMAVALIA: ''
      },
      isAvaliado: false,
      isUnsubNow: false,
      isUnsubOK: false,
      validaSyngenta: false,
      validaFmc: false,
      validaAdama: false,
      isNotFound: false,
      isLoading: true,
      isAvaliadoNow: false,
      isAvaliando: false,
      coment: '',
      nmavalia: '',
      comentUnsub: '',
      errorSave: false,
      txtTitleBar : 'AVALIE SUA ENTREGA',
    }
  },
  methods: {



    buscarConhecimento: function () {
      let codigoSatisfacao = { CDSATISF: '', NRNOTA: '', UNSUB: '' }

      if (this.param !== null && this.param !== '') {

        codigoSatisfacao = { CDSATISF: this.param.trim(), NRNOTA: this.nota, UNSUB: this.unsub }

        axios.post('http://monitoria.evolog.com.br/api/mo/deliverynf/validaSatisfacao', codigoSatisfacao).then(response => {
        //axios.post('http://monitoria.bravo2020.com.br/api/mo/deliverynf/validaSatisfacao', codigoSatisfacao).then(response => {

        
          this.resetAllAlerts();
          console.log(response)
          if (response.data.NRNOTA == null){
            this.isAvaliado = false;
          }else{
            this.isAvaliado = true;
          }
          

          if (response.data.IDG051 !== 0 && response.data.IDG061 !== 0) {
						if ((response.data.NRNOTA !== null || response.data.DTAVALIA !== null) && this.unsub !== 1) {							
							this.isAvaliando = true;
							this.objFormSalvarSatisfacao.IDG051 = response.data.IDG051;
              this.objFormSalvarSatisfacao.IDG061 = response.data.IDG061;
              this.starsCount = response.data.NRNOTA;
              this.coment  = response.data.DSCOMENT;
              this.objFormSalvarSatisfacao.DSCOMENT = response.data.DSCOMENT;

						} else {
							if (this.unsub == 1) {
                this.resetAllAlerts();
                this.txtTitleBar = "DESCADASTRO DE RECEBIMENTO DE E-MAIL";
								this.isUnsubNow = true;
							} else {
								this.isAvaliando = true;
								this.objFormSalvarSatisfacao.IDG051 = response.data.IDG051;
								this.objFormSalvarSatisfacao.IDG061 = response.data.IDG061;
							}
						}
						
						if(response.data.IDG014 == 5){
              this.validaSyngenta = true;
              this.validaFmc = false;
              this.validaAdama = false;
						}else if (response.data.IDG014 == 93) {
              this.validaSyngenta = false;
              this.validaFmc = true;
              this.validaAdama = false;
            }else if (response.data.IDG014 == 71) {
              this.validaSyngenta = false;
              this.validaFmc = false;
              this.validaAdama = true;
						}else{
              this.validaSyngenta = false;
              this.validaFmc = false;
              this.validaAdama = false;
            }
					} else {
						this.isNotFound = true;
					}
        }).catch( error =>{
          this.resetAllAlerts();
          this.isNotFound = true;
        })

      }else{
        this.resetAllAlerts();
        this.isNotFound = true;
      }
    },

    prepareFilter: function () {
      if (this.starsCount !== 0 && this.starsCount !== null) {
        this.objFormSalvarSatisfacao.NRNOTA = this.starsCount;
      }
      if (this.coment !== '' && this.coment !== null) {
        this.objFormSalvarSatisfacao.DSCOMENT = this.coment;
      }
      if (this.nmavalia !== '' && this.nmavalia !== null) {
        this.objFormSalvarSatisfacao.NMAVALIA = this.nmavalia;
      }
    },
    //Fazer o descadastramento do e-mail com comentario e confirmacao
    unsubMail: function () {
      
      if(this.comentUnsub == '' || this.comentUnsub.length  > 255 ){
        this.$q.notify({
              message: 'Preencha o campo motivo (Até 255 caracteres).',
              color: 'negative',
              position: 'top-right'
            })
      }else{
        if (this.param !== null && this.param !== '') {
          let codigoSatisfacao = { CDSATISF: this.param.trim(), UNSUB: this.unsub, COMMENT: this.comentUnsub }          
          //axios.post('http://monitoria.bravo2020.com.br/api/mo/deliverynf/unsubSatisfacao', codigoSatisfacao).then(response => {
          axios.post('http://monitoria.evolog.com.br/api/mo/deliverynf/unsubSatisfacao', codigoSatisfacao).then(response => {
            this.resetAllAlerts();
            console.log(response)
  
            this.resetAllAlerts();
            this.isUnsubOK = true;
          }).catch( error =>{
            this.resetAllAlerts();
            this.isNotFound = true;
          })
        }         
      }
      
    },

    resetAllAlerts: function () {
      this.isLoading 		= false;
      this.isAvaliado 	= false;
      this.isAvaliadoNow 	= false;
      this.isNotFound 	= false;
      this.isAvaliando 	= false;
      this.errorSave = false;
      this.isUnsubNow = false;
    },

    salvarAvaliacao: function () {
      console.log(this.objFormSalvarSatisfacao)
      this.prepareFilter();

      if (this.objFormSalvarSatisfacao.IDG051 !== '' && this.objFormSalvarSatisfacao.IDG061 !== '') {

        this.isLoading = true;

        axios.post('http://monitoria.evolog.com.br/api/mo/deliverynf/salvarSatisfacao', this.objFormSalvarSatisfacao)
          .then(response => {

            this.resetAllAlerts();
            this.isAvaliadoNow = true;
            console.log('sucesso');

        }).catch(error => {
            console.log('error');
            this.isLoading = false;
            this.errorSave = true;
        })

      } else {
        console.log('error');
        this.errorSave = true;
      }
    }
  },
  created () {
    this.param = this.$route.query.param;
    this.nota  = parseInt(this.$route.query.n);
    this.starsCount = parseInt(this.$route.query.n);
    this.unsub = this.$route.query.unsub;

    var url_atual = window.location.href;
    if(url_atual.indexOf("bravo2020") != -1) {
      url_atual = url_atual.replace("bravo2020","evolog");
      location.replace(url_atual);
    }

    if(this.param && (this.nota || this.unsub)){
      this.buscarConhecimento();
    } else {
			this.resetAllAlerts();
			this.isNotFound = true;
		}
  },

  unsubEmail: function() {
    console.log("Descadastrar email ");
    this.resetAllAlerts();
    this.isUnsubOK = true;

  },

}
</script>
