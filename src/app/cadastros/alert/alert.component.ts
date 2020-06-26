import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  @Input() title: any;
  @Input() thisParent : any;
  @Input() dsconteu: any;
  @Input('nomeBotao') nomeBotao: any;

  closeResult: string;
  modalRef: NgbModalRef;

  ngOnInit() {
   this.iniciarBtn(); 
  }

  iniciarBtn(){
    if(this.nomeBotao == undefined){
      this.nomeBotao = 'Confirmar';
    }
  }

  ngAfterViewInit(){

  }

  open(content) {
    this.modalRef = this.modalService.open(content);
    //console.log("this.modalRef", this.modalRef);
  }

  close() {
    //console.log(this.modalRef, this.thisParent);
    //this.modalRef.close();
    this.thisParent.alert.modalRef.close();
  }

}
