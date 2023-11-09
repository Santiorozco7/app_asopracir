import { Component, Input } from '@angular/core';
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
  

  constructor(private service: AgricultorService, private router: Router) {
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
      console.log(LT.data);

      this.primeraCintaPorLote = [];
  
      // Después de cargar los datos de los lotes, realizamos la suscripción a los datos de las cintas
      this.service.cinta().subscribe(cintas => {
        this.cinta = cintas.data;
        console.log(this.cinta);
  
        // Al cargar los datos de las cintas, encontraremos la primera cinta de cada lote
        this.lote.forEach(loteItem => {
          const primeraCintaLote = this.cinta.find(cintaItem => cintaItem.batchID === loteItem.batchID);
          if (primeraCintaLote) {
            this.primeraCintaPorLote.push(primeraCintaLote); // Agregar la primera cinta completa al array
          }
        });
  
        console.log('datos del array:', this.primeraCintaPorLote);
      });
    });
  }
  

  // Modal -----------------------------------------------------------
  modalVisible = false;
  batchID?: any;
  primerCumplimiento: boolean = false;

  mostrarModal(batchID:string) {
    this.batchID = batchID;
    this.modalVisible = true;
    console.log(this.batchID);
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  // Crear Lote -------------------------------------------------------
  crearLoteVisible = false;
  
  mostrarCrearlote(){
    this.crearLoteVisible = true;
    console.log('crearLoteVisible actualizado:', this.crearLoteVisible);
  }
  cerrarCrearlote() {
    this.crearLoteVisible = false;
    console.log('crearLoteVisible actualizado:', this.crearLoteVisible);

  }

  // Crear Cinta -------------------------------------------------------
  crearCintaVisible = false;
  
  mostrarCrearcinta(){
    this.crearCintaVisible = true;
    console.log('crearLoteVisible actualizado:', this.crearCintaVisible);
  }
  cerrarCrearcinta() {
    this.crearCintaVisible = false;
    console.log('crearLoteVisible actualizado:', this.crearCintaVisible);

  }

  //Editar lote ---------------------------------------------------------
  // editarlote = false;
  editarloteVisible=false;
  // @Input() batchIDSeleccionado:string = "";
  // cambiearEditarLote(){
  //   this.editarlote = !this.editarlote;
  // }

  // cerrar() {
  //   this.editarlote = false;
  // }

  mostrarEditarlote(batchID:string){
    console.log(batchID);
    this.batchID=batchID;
    this.editarloteVisible=true;
    // console.log('crearLoteVisible actualizado:', this.editarlote);
  }

  cerrarEditarlote(){
    this.editarloteVisible=false;
    // console.log('crearLoteVisible actualizado:', this.editarlote);
  }
}
