export interface Signature {
  [propName: string]: any;
}

export interface GridApi {
  showLoadingOverlay: Function;
  hideOverlay: Function;
  showNoRowsOverlay: Function;
  sizeColumnsToFit: Function;
  $agDelivery: object;
  [propName: string]: any;
}

export interface GridOptions {
  isRowSelectable?: boolean | undefined;
  columnApi?: object & { columnModel: any };
  [propName: string]: any;
}
