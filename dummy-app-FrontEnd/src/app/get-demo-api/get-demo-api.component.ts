import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DemoService } from '../demo.service';

@Component({
  selector: 'app-get-demo-api',
  templateUrl: './get-demo-api.component.html',
  styleUrls: ['./get-demo-api.component.css']
})
export class GetDemoAPIComponent implements AfterViewInit {

  constructor(private demoService: DemoService) { }

  // Table configuration
  displayedColumns: string[] = ['demo-id', 'demo-title', 'demo-description', 'demo-price', 'demo-category'];
  dataSource = new MatTableDataSource<any>([]);

  // View references
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('paginatorContainer', { read: ElementRef }) paginatorContainer!: ElementRef;

  // State
  totalItems = 0;
  loadedPages = new Set<number>();
  isOnLastVisiblePage = false;
  lastButtonClickCount = 0;

  ngOnInit(): void {
    this.demoService.getTotalCount().subscribe(count => {
      this.totalItems = count;
      this.loadProducts(1);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.updateLastButtonState();
  }

  // Data appended
  loadProducts(page: number): void {
    if (this.loadedPages.has(page)) return;

    this.demoService.getProducts(page).subscribe(data => {
      this.dataSource.data = [...this.dataSource.data, ...data];
      this.loadedPages.add(page);
    });
  }

  // Tracks every page change
  onPageChange(event: PageEvent): void {
    const pageSize = event.pageSize;
    const pageIndex = event.pageIndex;
    const loadedItems = this.dataSource.data.length;

    const lastLoadedPageIndex = Math.floor((loadedItems - 1) / pageSize);
    this.isOnLastVisiblePage = pageIndex === lastLoadedPageIndex;

    this.updateNextButtonState();
    this.updateLastButtonState();
    this.handleFirstAndPrevButton();
  }

  // NEXT BUTTON 
  updateNextButtonState(): void {
    requestAnimationFrame(() => {
      const nextButton: HTMLButtonElement = this.paginatorContainer?.nativeElement
        ?.querySelector('.mat-mdc-paginator-navigation-next');

      if (!nextButton) return;

      const pageSize = this.paginator.pageSize;
      const pageIndex = this.paginator.pageIndex;
      const loadedItems = this.dataSource.data.length;
      const lastLoadedPageIndex = Math.floor((loadedItems - 1) / pageSize);
      const moreDataExists = loadedItems < this.totalItems;

      const isLastPage = pageIndex === lastLoadedPageIndex;
      nextButton.disabled = !moreDataExists && isLastPage;

      nextButton.onclick = () => {
        if (isLastPage && moreDataExists) {
          this.handleNextButtonClick();
        }
      };
    });
  }

  handleNextButtonClick(): void {
    const pageSize = this.paginator.pageSize;
    const pageIndex = this.paginator.pageIndex;
    const loadedItems = this.dataSource.data.length;

    const lastLoadedPageIndex = Math.floor((loadedItems - 1) / pageSize);
    const moreDataExists = loadedItems < this.totalItems;

    if (pageIndex === lastLoadedPageIndex && moreDataExists) {
      const nextPageToLoad = Math.floor(loadedItems / 1000) + 1;
      this.loadProducts(nextPageToLoad);

      // To see the first page of newly loaded datac
      setTimeout(() => {
        this.paginator.pageIndex = this.paginator.pageIndex + 1;
        this.paginator._changePageSize(pageSize);
      }, 100);
    }
  }

  // LAST BUTTON
  updateLastButtonState(): void {
    requestAnimationFrame(() => {
      const lastButton: HTMLButtonElement = this.paginatorContainer?.nativeElement
        ?.querySelector('.mat-mdc-paginator-navigation-last');
      
      this.lastButtonClickCount++;

      if (!lastButton) return;

      const pageSize = this.paginator.pageSize;
      const pageIndex = this.paginator.pageIndex;
      const loadedItems = this.dataSource.data.length;
      const lastLoadedPageIndex = Math.floor((loadedItems - 1) / pageSize);
      const moreDataExists = loadedItems < this.totalItems;

      const isLastPage = pageIndex === lastLoadedPageIndex;
      lastButton.disabled = !moreDataExists && isLastPage;

      lastButton.onclick = () => {
        if (isLastPage && moreDataExists) {
          this.handleLastButtonClick();
        }
      };
    });
  }

  handleLastButtonClick(): void {
    const pageSize = this.paginator.pageSize;
    const pageIndex = this.paginator.pageIndex;
    const loadedItems = this.dataSource.data.length;

    const lastLoadedPageIndex = Math.floor((loadedItems - 1) / pageSize);
    const moreDataExists = loadedItems < this.totalItems;

    if (pageIndex === lastLoadedPageIndex && moreDataExists && this.lastButtonClickCount % 2 == 0) {
      const nextPageToLoad = Math.floor(loadedItems / 1000) + 1;
      this.loadProducts(nextPageToLoad);

      // To see the first page of newly loaded data
      setTimeout(() => {
        this.paginator.pageIndex = this.paginator.pageIndex + 1;
        this.paginator._changePageSize(pageSize);
      }, 100);
    }
  }

  handleFirstAndPrevButton(): void {
    setTimeout(() => {
      const firstButton: HTMLButtonElement = this.paginatorContainer?.nativeElement
        ?.querySelector('.mat-mdc-paginator-navigation-first');
      const prevButton: HTMLButtonElement = this.paginatorContainer?.nativeElement
        ?.querySelector('.mat-mdc-paginator-navigation-previous');

      // On clicking first or previous button it resets last button
      if (firstButton) {
        firstButton.onclick = () => {
          this.lastButtonClickCount = 0;
        }
      }
      if (prevButton) {
        prevButton.onclick = () => {
          this.lastButtonClickCount = 0;
        }
      }
    });
  }
}