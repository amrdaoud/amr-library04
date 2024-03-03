import { Component, EventEmitter, Input, OnInit, Output, forwardRef, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ControlContainer, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged,startWith} from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { Unsubscriber } from 'techteec-lib/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'amr-select-with-search',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './select-with-search.component.html',
  styleUrl: './select-with-search.component.scss',
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
export class SelectWithSearchComponent extends Unsubscriber implements OnInit  {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() controlName = '';
  @Input() label = '';
  @Input() placeHolder = '';
  @Input() isSearching: boolean | null = false;
  @Input() isAsync = false;
  @Input() options:Array<any> = [];
  @Input() valueAccessor = '';
  @Input() displayAccessor = '';
  @Input() haveNull = false;
  @Input() isMulty = false;
  @Input() fullWidth = true;
  @Input() matColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() appearance!: 'outline' | 'fill';
  @Input() prefixIcon!: string;
  @Input() searchPlaceHolder: string = '';
  @Output() searchChanges =new EventEmitter<string | null>();
  @Output() valueChanges = new EventEmitter<any>();
  formControl!: FormControl;
  private parentContainer = inject(ControlContainer);
  get formGroup(): FormGroup {
    return this.parentContainer?.control as FormGroup;
  }
  ngOnInit(): void {
    this.formControl = (this.formGroup.get(this.controlName) as FormControl);
    if(this.isMulty && !this.formControl?.value) {
      this.formControl?.setValue([]);
    }
    this._otherSubscription = this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      startWith('')
    ).subscribe(val => this.searchChanges.emit(val));
    console.log(this.formControl.value);
  }
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
  searchControl = new FormControl('');
  selectionTextArray: string[] = [];
  setSelection(event: any) {
    if(this.isMulty) {
      var i = this.formControl.value!.indexOf(this.valueAccessor ? event[this.valueAccessor] : event);
      if(i >= 0) {
       this.formControl.value?.splice(i,1);
       this.formControl.setValue(this.formControl.value);
       this.selectionTextArray.splice(i,1);
      }
      else {
       this.formControl.setValue([...this.formControl.value!, this.valueAccessor ? event[this.valueAccessor] : event]);
       this.selectionTextArray.push(this.displayAccessor ? event[this.displayAccessor] : event);
      }
    }
    else {
      this.formControl.setValue(this.valueAccessor ? event[this.valueAccessor] : event);
      this.selectionTextArray = this.displayAccessor ? event[this.displayAccessor] : event;
    }
    console.log(this.formControl.value)
  }
  getSelectText(): string {
    return (this.formControl.value)?.join(',')!;
  }
  isChecked(value: any) {
    return this.formControl.value?.includes(this.valueAccessor ? value[this.valueAccessor] : value)
  }
  clearSelection() {
    if(this.isMulty) {
      this.formControl?.setValue([]);
    }
    else {
      this.formControl?.setValue('');
    }
    this.selectionTextArray = [];
  }
  clearSearch() {
    this.searchControl.setValue('');
  }
}
