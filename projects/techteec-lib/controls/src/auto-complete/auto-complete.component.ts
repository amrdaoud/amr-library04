import { Component, Input, OnInit, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AbstractControl,ControlContainer,FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { Observable, debounceTime, distinctUntilChanged, finalize, map, of, startWith, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
export interface AutoCompleteColumnModel {
  Id: string,
  Text: string,
  Width?: number;
}
@Component({
  selector: 'amr-auto-complete',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
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
export class AutoCompleteComponent implements OnInit {
  private parentContainer = inject(ControlContainer);
  get formGroup(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  ngOnInit(): void {
    this.formControl = this.formControl ?? (this.formGroup.get(this.controlName) as FormControl);
    if(this.optionsFn) {
      this.filteredOptions$ = this.formControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((val: string) => {
          this.isLoading = true;
          return this.optionsFn(val.toString()).pipe(finalize(() => this.isLoading = false))
        }
        )
      )
    } else {
      this.filteredOptions$ = this.formControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        switchMap((val: string) => {
          this.isLoading = true;
          return this.options$.pipe(
            map(x => {
                if(this.searchFor) {
                return x.filter(z => z[this.searchFor].toLowerCase().startsWith(val.toString().toLocaleLowerCase()))
                }
                return x
              }
            ),
            finalize(() => this.isLoading = false)
          )
        }
        )
      )
    }
  }
  isLoading = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  // @Input() formGroup!: AbstractControl;
  @Input() controlName = '';
  @Input() formControl!: FormControl;

  @Input() label = '';
  @Input() isAsync = true;
  @Input() placeHolder = '';
  @Input() matchLabel = '';
  @Input() fullWidth = true;
  @Input() matColor: 'primary' | 'accent' | 'warn' = 'primary';
  
  @Input() valueAccessor = '';
  @Input() displayAccessor = '';
  @Input() searchFor = '';
  @Input() prefixIcon!: string;
  @Input() optionsFn!: (searchQuery: string) => Observable<any[]>;
  @Input() optionColumns!: AutoCompleteColumnModel[];

  @Input() options$: Observable<any[]> = of([]);
  @Input() appearance!: 'outline' | 'fill';
  filteredOptions$: Observable<any[]> = of([]);
  
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
      if (keyError === 'notIncluded') errorMessage += `Wrong ${this.label}`;
    })
    return errorMessage;
  }
  displayFn(data: any): string {
    console.log(this.displayAccessor);
    return data && data[this.displayAccessor] ? data[this.displayAccessor] : '';
  }
}
