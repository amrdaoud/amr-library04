# TechteecLib

## techteec-lib/components
### /data-table
**Inputs**  
_title:_ (string) Title of your data table  
_subtitle:_ (string) Subtitle of your data table  
_columnDefs:_ (ColumnDef[]) List of data table columns  
_data:_ (any[]) Current data  
_dataSize:_ (number) All data size  
_pageSize:_ (number) Initial page size  
_pageIndex:_ (number) Initial page index  
_filters:_ (DataTableFilter[]) request filters will be added to GeneralFilter model as key:value  
_haveSearch:_ (boolean) add SearchQuery to requests  
_isAsync:_ (boolean) Whether data will be refetched on each change or fetched once  
_sortActive:_ (string default: 'Id') Initial active sort column -user ColumnDef property-  
_sortDirection:_ ('asc' | 'desc' default: 'asc') Initial sort direction  
_isLoading:_ (boolean | null) Show data progress bar  
_menuLoadingRows:_ (number[]) Disable in action row  
_clickable:_ (boolean) Whether rows are clickable or not  
_btns_: (DataTableButtonObject[]) Add buttons to the data table in order to give actions based on button index  
_preserveQueryParams:_ (boolean) Wether to preserve filter form values in url to go back to pr not  
_preserveSearchQuery:_ (boolean) Same as _preserveQueryParams_ for SearchQuery  
_menuBtns:_ (DataTableButtonObject[]) add menu to each row  
_selectBtns:_ (DataTableButtonObject[]) add menu to selected rows  
_showSubmit:_ (boolean default: false) Whether to show submit button on filter form or not  
_isReport:_ (boolean default: false) Make the data table less density  
_searchQueryPlaceHolder:_ (string) Search control placeholder  
_haveSelect:_ (boolean) Whether data have select on rows or not  
_haveDownload:_ (boolean) Whether to add download data button or not  
_isDownloading:_ (boolean) true while downloading  
  
**Outputs**  
_changed:_ (GeneralFilterModel) On each change in SearchQuery, Paginator, Sorting, Filters  
_rowClicked:_ (any) Fires when a row is clicked with current clicked element  
_btnClicked:_ (number) Return the index of clicked button of 'btns'  
_menuBtnClicked:_ (MenuClickEvent) Return row index,menu button index & current clicked object  
_selectBtnClicked:_ (SelectClickEvent) Return menu button index & all selected objects  
_downloadClicked:_ (GeneralFilterModel) Fires when the download button clicked  

