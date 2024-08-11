import { Component, Input, Renderer2, ElementRef, HostListener } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-lotes',
  templateUrl: './lotes.component.html',
  styleUrls: ['./lotes.component.css']
})

export class LotesComponent {
  batches: any[] = [];
  tapes: any[] = [];
  firstTapeByBatch: any[] = [];
  
  showMenu: boolean = false;
  verificacionInfo: boolean = false;
  showModal = false;
  batchID?: any;
  showCreateBatch = false;
  showCreateTape = false;

  constructor(private service: AgricultorService, private router: Router, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void{
    this.View();
  }

  // Se cambio el View
  View() {
    this.service.getBatches().pipe(
      tap(batches => {
        if (batches['state'] === 'Fail') {
          this.verificacionInfo = true;
          // this.router.navigate(['/']);
        }
        if (batches['state'] === 'Ok') {
          this.verificacionInfo = false;
          this.batches = batches.data;
        }
      }),
      switchMap(() => this.service.getTapes()) // Utilizando switchMap para cambiar a la llamada de getTapes
    ).subscribe(tapes => {
      if (tapes['state'] === 'Fail') {
      }
      if (tapes['state'] === 'Ok') {
        this.tapes = tapes.data;

        // Al cargar los datos de las cintas, encontraremos la primera cinta de cada lote
        this.batches.forEach(bacthItem => {
          const primeraCintaLote = this.tapes.find(cintaItem => cintaItem.batchID === bacthItem.batchID);
          if (primeraCintaLote) {
            this.firstTapeByBatch.push(primeraCintaLote);
          }
        });
      }
    });
  }
  
  getFirstTapeByBatch(batchID: string): any {
    return this.firstTapeByBatch.find(tape => tape.batchID === batchID) || {};
  }
  
  // Modal -----------------------------------------------------------
  modal(batchID:string) {
    this.batchID = batchID;
    this.showModal = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
  closeModal() {
    this.showModal = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }

  // Crear Lote -------------------------------------------------------
  createBatch(){
    this.showCreateBatch = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
  closeCreateBatch() {
    this.showCreateBatch = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }

  // Crear Cinta -------------------------------------------------------  
  createTape(){
    this.showCreateTape = true;
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }
  closeCreateTape() {
    this.showCreateTape = false;
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }

  closeButton(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget && this.showMenu) {
      this.showMenu = false;
      this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
    }
  }

  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  onScroll(event: Event): void {
    // Verifica si el modal está visible y se está haciendo scroll
    if (this.showMenu) {
      setTimeout(() => {
        this.showMenu = false;
        this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'modal--open');
      }, 100);
    }
  } 
}