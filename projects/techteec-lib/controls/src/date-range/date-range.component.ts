import { Component, Input, OnInit, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'amr-date-range',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatIconModule],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
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
export class DateRangeComponent implements OnInit {
  private parentContainer = inject(ControlContainer);
  get formGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // @Input() formGroup!: AbstractControl;
  @Input() fromControlName = '';
  @Input() toControlName = '';
  @Input() fromFormControl!: FormControl;
  @Input() toFormControl!: FormControl;

  @Input() label = '';
  @Input() fromPlaceHolder = 'Start Date';
  @Input() toPlaceHolder = 'End Date';
  @Input() fullWidth = true;
  @Input() matColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() appearance!: 'outline' | 'fill';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('calendar-icon', sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 2V5"  stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 2V5" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3.5 9.08997H20.5"  stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"  stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.6947 13.7H15.7037"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.6947 16.7H15.7037" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.9955 13.7H12.0045"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11.9955 16.7H12.0045"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8.29431 13.7H8.30329"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M8.29431 16.7H8.30329"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
    ));
    
  }
  ngOnInit(): void {
    this.fromFormControl = this.fromFormControl ?? (this.formGroup.get(this.fromControlName) as FormControl)
    this.toFormControl = this.toFormControl ?? (this.formGroup.get(this.toControlName) as FormControl)
  }
  getFromErrors() {
    if (!this.fromFormControl) return '';
    const controlErrors = this.fromFormControl.errors;
    if (!controlErrors) return '';
    let errorMessage = '';
    Object.keys(controlErrors).forEach(keyError => {
      if (keyError === 'isTaken') errorMessage += `${this.fromFormControl.value} is taken!`;
      if (keyError === 'minlength') errorMessage += `Minimum length is: ${controlErrors[keyError].requiredLength}`;
      if (keyError === 'maxlength') errorMessage += `Maximum length is: ${controlErrors[keyError].requiredLength}`;
      if (keyError === 'required') errorMessage += `${this.label} is required!`;
      if (keyError === 'email') errorMessage += `Not matching Email address pattern!`;
      if (keyError === 'pattern') errorMessage += `Not matching pattern!`;
      if (keyError === 'notMatched') errorMessage += `Not matched with Password!`;
      if (keyError === 'connection') errorMessage += `Connection Problem!`;
      if (keyError === 'password') errorMessage += `At least 6 characters, at least one digit, one upper & one lower case!`;
      if (keyError === 'matDatepickerParse') errorMessage += 'Start Date not valid'
    })
    return errorMessage;
  }
  getToErrors() {
    if (!this.toFormControl) return '';
    const controlErrors = this.toFormControl.errors;
    if (!controlErrors) return '';
    let errorMessage = '';
    Object.keys(controlErrors).forEach(keyError => {
      if (keyError === 'isTaken') errorMessage += `${this.toFormControl.value} is taken!`;
      if (keyError === 'minlength') errorMessage += `Minimum length is: ${controlErrors[keyError].requiredLength}`;
      if (keyError === 'maxlength') errorMessage += `Maximum length is: ${controlErrors[keyError].requiredLength}`;
      if (keyError === 'required') errorMessage += `${this.label} is required!`;
      if (keyError === 'email') errorMessage += `Not matching Email address pattern!`;
      if (keyError === 'pattern') errorMessage += `Not matching pattern!`;
      if (keyError === 'notMatched') errorMessage += `Not matched with Password!`;
      if (keyError === 'connection') errorMessage += `Connection Problem!`;
      if (keyError === 'password') errorMessage += `At least 6 characters, at least one digit, one upper & one lower case!`;
      if (keyError === 'matDatepickerParse') errorMessage += 'End Date not valid'
    })
    return errorMessage;
  }
}
