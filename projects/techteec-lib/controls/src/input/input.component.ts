import { Component, Input, OnInit, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbstractControl, ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'amr-input',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
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
export class InputComponent implements OnInit {
  private parentContainer = inject(ControlContainer);
  get formGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  @Input() type: 'text' | 'number' | 'date' | 'text-area' | 'password' = 'text';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // @Input() formGroup!: AbstractControl;
  @Input() controlName = '';
  @Input() formControl!: FormControl;

  @Input() label = '';
  @Input() isAsync = false;
  @Input() placeHolder = '';
  @Input() lines = 2;
  @Input() matchLabel = '';
  @Input() resize = false;
  @Input() fullWidth = true;
  @Input() matColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() appearance!: 'outline' | 'fill';
  @Input() prefixIcon!: string;
  ngOnInit(): void {
    this.formControl = this.formControl ?? (this.formGroup.get(this.controlName) as FormControl)
  }

  getErrors() {
    if (!this.formControl) return '';
    const controlErrors = this.formControl.errors;
    if (!controlErrors) return '';
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
      if (keyError === 'notGreater') errorMessage += `Must be greater than  ${this.matchLabel}`;
      if (keyError === 'notLess') errorMessage += `Must be less than  ${this.matchLabel}`;
      if (keyError === 'password') errorMessage += `At least 6 characters, at least one digit, one upper & one lower case!`;
    })
    return errorMessage;
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('calendar-icon', sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 2V5"  stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 2V5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3.5 9.08997H20.5"  stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"  stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.6947 13.7H15.7037"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.6947 16.7H15.7037" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.9955 13.7H12.0045"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.9955 16.7H12.0045"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8.29431 13.7H8.30329"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8.29431 16.7H8.30329"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    ));
    
  }
}

