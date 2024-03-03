import { Component, EventEmitter, Input, OnInit, Output, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
import { AbstractControl, ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'amr-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent),
    }
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class SelectComponent implements OnInit {
  private parentContainer = inject(ControlContainer);
  get formGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  ngOnInit(): void {
    this.formControl = this.formControl ?? (this.formGroup.get(this.controlName) as FormControl)
  }
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  // @Input() formGroup!: AbstractControl;
  @Input() controlName = '';
  @Input() formControl!: FormControl;

  @Input() label = '';
  @Input() placeHolder = '';
  @Input() isLoading = false;
  @Input() isAsync = false;
  @Input() options:Array<any> = [];
  @Input() valueAccessor = '';
  @Input() displayAccessor = '';
  @Input() haveNull = false;
  @Input() isMulty = false;
  @Input() fullWidth = true;
  @Input() matColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() appearance!: 'outline' | 'fill';
  @Output() valueChanges = new EventEmitter<any>();
  @Input() prefixIcon!: string;
  getErrors(): string {
    if(!this.formControl) return '';
    const controlErrors = this.formControl.errors;
    if(!controlErrors) return '';
    let errorMessage = '';
    Object.keys(controlErrors).forEach(keyError => {
      if (keyError === 'isTaken') errorMessage += `${this.formControl.value} is taken!`;
      if (keyError === 'minlength') errorMessage += `Minimum length is: ${controlErrors[keyError].requiredLength}`;
      if (keyError === 'maxlength') errorMessage += `Maximum length is: ${controlErrors[keyError].requiredLength}`;
      if (keyError === 'required') errorMessage += `${this.label} is required!`;
      if (keyError === 'email') errorMessage += `Not matching Email address pattern!`;
      if (keyError === 'pattern') errorMessage += `Not matching pattern!`;
      if (keyError === 'notMatched') errorMessage += `Not matched with Password!`;
      if (keyError === 'connection') errorMessage += `Connection Problem!`;
      if (keyError === 'password') errorMessage += `At least 6 characters, at least one digit, one upper & one lower case!`;
    })
    return errorMessage;
  }
  onValueChange(val: any) {
    this.valueChanges.emit(val);
  }
  
}
