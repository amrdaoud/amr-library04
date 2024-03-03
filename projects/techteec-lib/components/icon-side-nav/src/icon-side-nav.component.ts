import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, QueryList, SimpleChanges, ViewChild, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawerContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, filter, fromEvent, map, shareReplay, tap } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';


export interface IconNavItem {
  matIcon?: string;
  svgIcon?: string;
  title: string;
  routerLink?: string;
  children?: IconNavItem[];
  expanded?: boolean;
  postition?: 'top' | 'middle' | 'bottom';
  needAttention$?: Observable<boolean>;
}

@Component({
  selector: 'amr-icon-side-nav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatIconModule, MatButtonModule, MatDividerModule, MatMenuModule, MatExpansionModule, RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule],
  templateUrl: './icon-side-nav.component.html',
  styleUrls: ['./icon-side-nav.component.scss']
})
export class IconSideNavComponent implements OnChanges, AfterViewInit {
  
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  private changeDetectorRef = inject(ChangeDetectorRef);
  isHandset$: Observable<boolean> = inject(BreakpointObserver).observe(Breakpoints.HandsetPortrait)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  @Input() isDark = true;
  @Input() items: IconNavItem[] = [];
  @Input() logoSrc: string = 'https://drive.google.com/uc?export=view&id=1aD3qeMaCavmpnHMHVk5SE33RXXlq1HhY';
  @Input() brand: string = 'TECHTEEC';
  @Input() brandColor: string = 'blue';
  @Input() toolbarMode: 'sticky' | 'auto-hide' | 'regular' = 'regular'
  @Input() autoHideStartY = 5;
  @Input() forceFullHeight = true;
  @ViewChild('scrollableContent') drawerContent!: MatDrawerContent;
  topItems: IconNavItem[] = [];
  middleItems: IconNavItem[] = [];
  bottomItems: IconNavItem[] = [];
  testActive = false;
  lastScroll = 0;
  toolbarClasses:string[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    this.buildSvg(this.items);
    this.topItems = this.items.filter(x => !x.postition || x.postition === 'top');
    this.middleItems = this.items.filter(x => x.postition === 'middle');
    this.bottomItems = this.items.filter(x => x.postition === 'bottom');
    
  }
  ngAfterViewInit(): void {
    console.log(this.drawerContent);
    this.drawerContent.elementScrolled()
    .pipe(
      filter(() => this.toolbarMode === 'auto-hide')
    )
    .subscribe(x => {
      const newScroll = this.drawerContent.measureScrollOffset('top');
      if(newScroll > this.lastScroll && newScroll > this.autoHideStartY ) {
        this.toolbarClasses = ['transparent'];
        this.changeDetectorRef.detectChanges();
      }
      else {
        if(newScroll > 20) {
          this.toolbarClasses = ['blur'];
        }
        else {
          this.toolbarClasses = [''];
        }
        this.changeDetectorRef.detectChanges();
      }
      this.lastScroll = newScroll;
    });
  }
  private buildSvg(items: IconNavItem[]) {
    items.forEach(item => {
      if(item.svgIcon) {
        this.iconRegistry.addSvgIconLiteral(item.title, this.sanitizer.bypassSecurityTrustHtml(item.svgIcon));
      }
      if(item.children && item.children.length > 0) {
        this.buildSvg(item.children);
      }
    });
  }
  togglePanel(item: IconNavItem) {
    if(!item.expanded) {
      item.expanded = true;
    }
    else {
      item.expanded = false;
    }
    
  }
}

