import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';

import { CustomerCreateDto } from '../../../core/models/customer.model';


@Component({
  selector: 'app-customer-form-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule
  ],
  templateUrl: './customer-form-modal.html',
  styleUrl: './customer-form-modal.scss',
})
export class CustomerFormModal {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onSubmit = new EventEmitter<CustomerCreateDto>();
  @Output() onCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  customerForm!: FormGroup;
  loading: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      whatsapp: ['']
    });
  }

  get nameInvalid(): boolean {
    const control = this.customerForm.get('name');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get phoneInvalid(): boolean {
    const control = this.customerForm.get('phone');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onHide(): void {
    this.customerForm.reset();
    this.visibleChange.emit(false);
    this.onCancel.emit();
  }

  onSave(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.value;
    const customerData: CustomerCreateDto = {
      name: formValue.name.trim(),
      phone: this.cleanPhone(formValue.phone),
      whatsapp: formValue.whatsapp ? this.cleanPhone(formValue.whatsapp) : undefined
    };

    this.onSubmit.emit(customerData);
  }

  private cleanPhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
