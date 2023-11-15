import { Component, Input, Renderer2, ElementRef } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

// formulario reactivo lote
import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})

export class LotesComponent {
  lote: any[] = [];
  cinta: any[] = [];
  primeraCintaPorLote: any[] = [];
  
  constructor(private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.lotes().subscribe(LT => {
      if (LT['state'] === 'Fail') {
        this.router.navigate(['/']);
      }
      this.lote = LT.data;
      this.primeraCintaPorLote = [];
  
      // Después de cargar los datos de los lotes, realizamos la suscripción a los datos de las cintas
      this.service.cinta().subscribe(cintas => {
        this.cinta = cintas.data;
  
        // Al cargar los datos de las cintas, encontraremos la primera cinta de cada lote
        this.lote.forEach(loteItem => {
          const primeraCintaLote = this.cinta.find(cintaItem => cintaItem.batchID === loteItem.batchID);
          if (primeraCintaLote) {
            this.primeraCintaPorLote.push(primeraCintaLote); // Agregar la primera cinta completa al array
          }
        });  
      });
    });
  }
  
  getPrimeraCintaPorLote(batchID: string): any {
    return this.primeraCintaPorLote.find(cinta => cinta.batchID === batchID) || {};
  }
  
  // Modal -----------------------------------------------------------
  modalVisible = false;
  batchID?: any;
  primerCumplimiento: boolean = false;

  mostrarModal(batchID:string) {
    this.batchID = batchID;
    this.modalVisible = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }

  cerrarModal() {
    this.modalVisible = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Elimina la clase al cerrar
  }

  // Crear Lote -------------------------------------------------------
  crearLoteVisible = false;
  
  mostrarCrearlote(){
    this.crearLoteVisible = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Agrega la clase al body
  }
  cerrarCrearlote() {
    this.crearLoteVisible = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal-open'); // Elimina la clase al cerrar
  }

  // Crear Cinta -------------------------------------------------------
  crearCintaVisible = false;
  
  mostrarCrearcinta(){
    this.crearCintaVisible = true;
  }
  cerrarCrearcinta() {
    this.crearCintaVisible = false;
  }

  //Editar lote ---------------------------------------------------------
  editarloteVisible=false;

  mostrarEditarlote(batchID:string){
    this.batchID=batchID;
    this.editarloteVisible=true;
  }
  cerrarEditarlote(){
    this.editarloteVisible=false;
  }
}
