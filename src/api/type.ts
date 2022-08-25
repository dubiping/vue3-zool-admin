export interface MenuRecordRaw {
  menuCode?: string;
  menuNameZh?: string;
  menuNameEn?: string;
  pageRoute?: string;
  menuIcon?: string;
  children?: MenuRecordRaw[];
}

export type MenuRecordModule = MenuRecordRaw[];
