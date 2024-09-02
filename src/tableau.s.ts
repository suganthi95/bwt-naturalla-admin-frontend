interface Tableau {
    Viz: new (
      element: HTMLElement,
      url: string,
      options?: {
        width?: string;
        height?: string;
        hideTabs?: boolean;
        hideToolbar?: boolean;
      }
    ) => void;
  }
  
  declare global {
    interface Window {
      tableau: Tableau;
    }
  }
  
  export {};