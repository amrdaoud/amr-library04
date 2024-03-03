import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { ColumnDef, DataTableButtonObject, DataTableFilter, GeneralFilterModel, MenuClickEvent, SelectClickEvent } from './data-table.model';
import { DynamicPipe } from 'techteec-lib/pipes';
import { HighlighterDirective } from 'techteec-lib/directives';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, merge, of, switchMap } from 'rxjs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { CALENDAR_ICON, Unsubscriber } from 'techteec-lib/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSliderModule} from '@angular/material/slider';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DeviceService } from 'techteec-lib/services';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { DomSanitizer } from '@angular/platform-browser';
import { ACTION_ICON, FILTER_ICON, SEARCH_ICON } from 'techteec-lib/common';

@Component({
  selector: 'amr-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [CommonModule, MatCardModule, MatMenuModule, ReactiveFormsModule, MatGridListModule,
    MatProgressBarModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule,
    MatDatepickerModule,MatNativeDateModule, MatCheckboxModule,MatSliderModule,
    MatIconModule, MatTableModule, MatPaginatorModule, MatSortModule, DynamicPipe, HighlighterDirective, MatProgressSpinnerModule, MatTooltipModule],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class DataTableComponent extends Unsubscriber implements OnInit, AfterViewInit, OnChanges {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private device = inject(DeviceService);
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  handset$ = this.device.isHandset$;
  @Input() highlightProperty = '';
  @Input() highlightValue = '';
  @Input() highlightForeColor = 'rgb(255,166,97)';
  @Input() highlightBackColor = 'rgba(255,166,97,0.3)';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input({ required: true }) columnDefs: ColumnDef[] = [];
  @Input() data: any[] = [];
  @Input() dataSize: number = 1000;
  @Input() pageSize!: number;
  @Input() pageIndex!: number;
  @Input() filters!: DataTableFilter[];
  @Input() haveSearch = false;
  @Input() isAsync = false;
  @Input() sortActive: string = 'Id';
  @Input() sortDirection: SortDirection = 'asc';
  @Input() isLoading!: boolean | null;
  @Input() menuLoadingRows!: number[] | null;
  @Input() clickable: boolean = false;
  @Input() returnFilterAsForm: boolean = false;
  @Input() btns!: DataTableButtonObject[];
  @Input() preserveQueryParams = false;
  @Input() preserveSearchQuery = false;
  @Input() menuBtns!: DataTableButtonObject[];
  @Input() selectBtns!: DataTableButtonObject[];
  @Input() showSubmit = false;
  @Input() isReport = false;
  @Input() searchQueryPlaceHolder = 'Search';
  @Input() haveSelect = false;
  @Input() autoRefresh = false;
  @Input() timeIntervalMinutes = 5;
  @Input() menuIconColor = '#000'
  allSelected = false;
  uselected: any[] = [];
  columns: string[] = [];
  haveFooter = false;
  dataSource = new MatTableDataSource();
  @Input() footers = new Map<string,number|string>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('sbmtBtn') sbmtBtn!: ElementRef;
  filterForm = new FormGroup({});
  searchControl = new FormControl('');
  takeUntil = new BehaviorSubject<string>('stop');
  @Input() haveDownload = false;
  @Input() isDownloading: boolean | null = false;
  @Output() changed = new EventEmitter<GeneralFilterModel>();
  @Output() rowClicked = new EventEmitter<any>();
  @Output() btnClicked = new EventEmitter<number>();
  @Output() menuBtnClicked = new EventEmitter<MenuClickEvent>();
  @Output() selectBtnClicked = new EventEmitter<SelectClickEvent>();
  @Output() downloadClicked = new EventEmitter<GeneralFilterModel>();
  selection = new SelectionModel<any>(true, []);

  constructor(){
    super();
    ///Implement used icons
    this.iconRegistry.addSvgIconLiteral('filter-icon', this.sanitizer.bypassSecurityTrustHtml(FILTER_ICON));
    this.iconRegistry.addSvgIconLiteral('search-icon', this.sanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    this.iconRegistry.addSvgIconLiteral('action-icon', this.sanitizer.bypassSecurityTrustHtml(ACTION_ICON));
    this.iconRegistry.addSvgIconLiteral('calendar-icon', this.sanitizer.bypassSecurityTrustHtml(CALENDAR_ICON));
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['data']) {
      this.dataSource.data = this.data;
      this.selection.clear();
    }
    if (changes['columnDefs']) {
      this.haveFooter = this.columnDefs.findIndex(x => x.HaveFooter) != -1;
      this.columns = this.columnDefs.map(x => x.Property);
      if(this.menuBtns && this.menuBtns.length > 0) {
        this.columns.push('actions');
      }
      if(this.haveSelect) {
        this.columns = ['select', ...this.columns]
      }
    }
  }
  ngOnInit(): void {
    if(this.haveSearch && this.preserveSearchQuery) {
      this.searchControl.setValue(this.route.snapshot.queryParamMap.get('searchQuery'));
    }
    if (this.filters) {
      if(this.preserveQueryParams) {
        this.filterForm = this.createfilterFormWithValue(this.route.snapshot.queryParamMap);
      }
      else {
        this.filterForm = this.createfilterForm();
      }
    }
  }
  ngAfterViewInit(): void {
    if(!this.isAsync) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this._otherSubscription = this.searchControl.valueChanges.subscribe(val => {
        this.dataSource.filter = val!.trim().toLowerCase();
      })
      return;
    }
    this._otherSubscription =this.searchControl.valueChanges.subscribe(x => this.paginator.pageIndex = 0);
    this._otherSubscription =this.sort.sortChange.subscribe(x => this.paginator.pageIndex = 0);
    this._otherSubscription =this.filterForm.valueChanges.subscribe(x => this.paginator.pageIndex = 0);
    const mergedObservables = merge(this.paginator.page,
      this.sort.sortChange,
      this.filterForm.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      ),
      this.searchControl.valueChanges.pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
    )
    this._otherSubscription = mergedObservables
    .pipe(
      switchMap(() => of([])),
      map(() => this.createOutputObject())
    ).subscribe(x => {
      if(this.filterForm.valid) {
        this.changed.emit(x)
      }
    });
    // if(this.preserveQueryParams) {
    //   this.filterForm.updateValueAndValidity();
    // }
    // if(this.preserveSearchQuery) {
    //   this.searchControl.updateValueAndValidity();
    // }
    this.filterForm.updateValueAndValidity();
  }
  createfilterForm(): FormGroup {
    const frm = new FormGroup({});
    this.filters.forEach(element => {
      if(element.Type === 'twoDates') {
        frm.addControl(element.ControlName, new FormControl('', { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
        frm.addControl(element.ControlName2!, new FormControl('', { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
      else if(element.Type === 'date') {
        frm.addControl(element.ControlName, new FormControl('', { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
      else if(element.Type ==='slider') {
        frm.addControl(element.ControlName, new FormControl('', { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
        frm.addControl(element.ControlName2!, new FormControl('', { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
      else {
        frm.addControl(element.ControlName, new FormControl('', { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
    });
    return frm;
  }
  createfilterFormWithValue(p: ParamMap): FormGroup {
    const frm = new FormGroup({});
    this.filters.forEach(element => {
      if(element.Type === 'twoDates') {
        frm.addControl(element.ControlName, new FormControl(p.get(element.ControlName) ? new Date(p.get(element.ControlName) ?? 0) : null, { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
        frm.addControl(element.ControlName2!, new FormControl(p.get(element.ControlName2!) ? new Date(p.get(element.ControlName2!) ?? 0) : null, { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
      else if(element.Type === 'date') {
        frm.addControl(element.ControlName, new FormControl(p.get(element.ControlName) ? new Date(p.get(element.ControlName) ?? 0) : null, { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
      else if(element.Type ==='slider') {
        frm.addControl(element.ControlName, new FormControl(p.get(element.ControlName), { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
        frm.addControl(element.ControlName2!, new FormControl(p.get(element.ControlName2!), { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
      else {
        frm.addControl(element.ControlName, new FormControl(element.IsMulti ? p.getAll(element.ControlName).map(s => isNaN(+s) ? s : +s) : ((p.get(element.ControlName) == 'true' ? true : p.get(element.ControlName) == 'false' ? false : p.get(element.ControlName))), { updateOn: element.UpdateOn , validators: element.IsMandatory ? Validators.required : []}));
      }
    });
    return frm;
  }
  createOutputObject(): GeneralFilterModel {
    const result: GeneralFilterModel = {
      PageIndex: this.paginator.pageIndex,
      PageSize: this.paginator.pageSize,
      SearchQuery: this.searchControl.value,
      SortActive: this.sort.active,
      SortDirection: this.sort.direction,
      // Filters:  Object.keys(this.filterForm.value).filter(key => (
      //   (this.filterForm.value as any)[key] instanceof Array ? (this.filterForm.value as any)[key].length > 0 : (this.filterForm.value as any)[key]
      // )).map((key) => {
      //   return { Key: key, Value: (this.filterForm.value as any)[key] instanceof Array ? (this.filterForm.value as any)[key] : [(this.filterForm.value as any)[key]] }
      // }),
      ...this.filterForm.value
    }
    if(this.preserveQueryParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.filterForm.value
      })
    }
    return result;
  }
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return `${value}`;
  }
  downloadData() {
    this.downloadClicked.emit(this.createOutputObject());
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  selectBtnClick(index: number) {
    this.selectBtnClicked.emit({index, targets:this.selection.selected});
  }
}
