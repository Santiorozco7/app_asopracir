import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AgricultorService } from '../../agricultor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-eliminar-lote',
  templateUrl: './editar-eliminar-lote.component.html',
  styleUrls: ['./editar-eliminar-lote.component.css']
})
export class EditarEliminarLoteComponent implements OnChanges {
  @Input() batches: any[] = [];
  @Input() batchID: string = "";
  @Input() tapes: any[] = [];
  @Input() tapeID: string = "";
  @Input() action: string = ""; 
  @Input() manageBatch: boolean = false;

  @Output() batchEdited = new EventEmitter<void>();
  @Output() batchDeleted = new EventEmitter<void>();
  @Output() closeManageBatch = new EventEmitter<void>();

  isValidForm = false;
  showDialog = false;
  positiveNotification = true;
  message = '';
  originData: any;
  originDataTape: any;

  batchForm = this.formBuilder.group({
    batchName: ['', [Validators.required]],
    responsible: ['', [Validators.required]],
    mainVariety: ['', [Validators.required]]
  });

  tapeForm = this.formBuilder.group({
    numBunches: [0, [Validators.required, Validators.pattern(/^\d+$/)]],
    variety: ['', [Validators.required]],
    color: ['', [Validators.required]]
  });
  
  deleteBatch = this.formBuilder.group({
    confirmationText: [
      '',
      [Validators.required, (control: AbstractControl) => {
        const userInput = control.value && control.value.toLowerCase();
        const isValid = userInput === 'eliminar' || userInput === 'eliminar ';
        return isValid ? null : { incorrectConfirmation: true };
      }],
    ],
    confirmationIsValid: [false],
  });

  constructor(
    private formBuilder: FormBuilder, 
    private service: AgricultorService, 
    private router: Router, 
    private renderer: Renderer2, 
    private el: ElementRef) {
    this.batchForm.valueChanges.subscribe(() => this.updateBatchFormValidity());
    this.tapeForm.valueChanges.subscribe(() => this.updateTapeFormValidity());
  }

  private updateBatchFormValidity(): void {
    const currentFormValues = this.batchForm.value;

    this.isValidForm = (
      currentFormValues.batchName !== this.originData.batchName ||
      currentFormValues.responsible !== this.originData.responsible ||
      currentFormValues.mainVariety !== this.originData.mainVariety
    ) && this.batchForm.valid;
  }

  private updateTapeFormValidity(): void {
    const currentFormValues = this.tapeForm.value;
    const currentNumBunches = currentFormValues.numBunches != null ? +currentFormValues.numBunches : 0;
    const originNumBunches = this.originDataTape.numBunches != null ? +this.originDataTape.numBunches : 0;

    this.isValidForm = (
      currentNumBunches !== originNumBunches ||
      currentFormValues.variety !== this.originDataTape.variety ||
      currentFormValues.color !== this.originDataTape.color
    ) && this.tapeForm.valid;
  }

  closeNotification(): void {
    this.showDialog = false;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Detecta cambios en batchID y actualiza el formulario cuando coincida con itemLote.
    const itemLote = this.batches.find(item => item['batchID'] === this.batchID);
    const itemTape = this.tapes.find(item => item['tapeID'] === this.tapeID);
    if (itemLote) {
      this.originData = {...itemLote};
      this.batchForm.patchValue({
        batchName: itemLote.batchName,
        responsible: itemLote.responsible,
        mainVariety: itemLote.mainVariety
      });
    }
    if (itemTape) {
      this.originDataTape = {...itemTape};
      this.tapeForm.patchValue({
        numBunches: itemTape.numBunches,
        variety: itemTape.variety,
        color: itemTape.color
      });
    }
  }

  onSubmit(): void {
    if (this.batchForm.valid && this.action === 'updateBatch') {
      const formData = this.batchForm.value;
      const batchName: string = formData.batchName ?? "";
      const responsible: string = formData.responsible ?? "";
      const mainVariety: string = formData.mainVariety ?? "";
      this.service.updateBatch(this.batchID, batchName, responsible, mainVariety).subscribe(batchEdited => {
        if (batchEdited['state'] === 'Ok') {
          this.batchEdited.emit();
          this.showDialog = true;
          this.positiveNotification = true;
          this.message = `Se editó el lote correctamente`;
        } else {
          this.batchEdited.emit();
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = '¡Ha ocurrido un error!';
        }
      });
    }
    if (this.tapeForm.valid && this.action === 'updateTape') {
      const formDataTapes = this.tapeForm.value;
      const numBunches: number = formDataTapes.numBunches != null ? +formDataTapes.numBunches : 0;
      const variety: string = formDataTapes.variety ?? "";
      const colorValue: any = formDataTapes.color ?? "";
      const colorWithoutHash: string = colorValue.startsWith('#') ? colorValue.substring(1) : colorValue;
      this.service.updateTape(this.tapeID, numBunches, variety, colorWithoutHash).subscribe(tapeUpdated => {
        if (tapeUpdated['state'] === 'Ok') {
          this.batchEdited.emit();
          this.showDialog = true;
          this.positiveNotification = true;
          this.message = `Se ha actualizado la cinta`;
        } else {
          this.batchEdited.emit();
          this.showDialog = true;
          this.positiveNotification = false;
          this.message = '¡Ha ocurrido un error!';
        }
      });
    }
    this.closeManageBatch.emit();
  }

  removeBatch() {
    this.deleteBatch.reset();
    this.service.removeBatch(this.batchID).subscribe(batchDeleted => {
      if (batchDeleted['state'] === 'Ok') {
        this.batchDeleted.emit();
        this.showDialog = true;
        this.positiveNotification = true;
        this.message = `Se ha eliminado el lote "${this.getSelectedBatchName()}"`;
      } else {
        this.batchDeleted.emit();
        this.showDialog = true;
        this.positiveNotification = false;
        this.message = '¡Ha ocurrido un error!';
      }
    });    
    this.closeManageBatch.emit();
  }

  onConfirmationTextChange(): void {
    const confirmationTextControl = this.deleteBatch.get('confirmationText');
    if (confirmationTextControl) {
      this.deleteBatch.patchValue({
        confirmationIsValid: confirmationTextControl.valid,
      });
    }
  }
  
  getModalTitle(): string {
    switch (this.action) {
      case 'updateBatch':
        return 'Editar Lote';
      case 'deleteBatch':
        return 'Eliminar Lote';
      case 'updateTape':
        return 'Actualizar Cinta';
      default:
        return ''; 
    }
  }

  getDeleteButtonMessage(): string {
    return this.deleteBatch.get('confirmationIsValid')?.value ? 'Eliminar lote permanentemente' : 'Bloqueado';
  }
  getDeleteBatchIcon(): { path: string, viewBox: string } {
    const path = this.deleteBatch.get('confirmationIsValid')?.value
    ? "M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144V144z" 
    : "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z";
    
    const viewBox = this.deleteBatch.get('confirmationIsValid')?.value
    ? '0 0 448 512'
    : '0 0 448 512';
    return { path, viewBox };
  }

  getEditButtonMessage(): string {
    return this.isValidForm ? 'Editar este lote' : 'Bloqueado';
  }
  getEditBatchIcon(): { path: string, viewBox: string } {
    const path = this.isValidForm
    ? "M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144V144z" 
    : "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z";
    
    const viewBox = this.isValidForm
    ? '0 0 448 512'
    : '0 0 448 512';
    return { path, viewBox };
  }

  getUpdateTapeButtonMessage(): string {
    return this.isValidForm ? 'Actualizar esta cinta' : 'Bloqueado';
  }
  getUpdateBatchIcon(): { path: string, viewBox: string } {
    const path = this.isValidForm
    ? "M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144V144z" 
    : "M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z";
    
    const viewBox = this.isValidForm
    ? '0 0 448 512'
    : '0 0 448 512';
    return { path, viewBox };
  }
  
  getSelectedBatchName(): string {
    const selectedBatch = this.batches.find(item => item.batchID === this.batchID);
    return selectedBatch ? selectedBatch.batchName : '';
  }

  closeDialog(event: Event): void {
    // Verifica si el clic se realizó fuera del contenido del modal
    if (event.target === event.currentTarget) {
      this.closeManageBatch.emit();
    }
  }
}