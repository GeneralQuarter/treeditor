import * as L from 'leaflet';

declare module 'leaflet' {
  namespace PM {
    interface Layer {
      disableLayerDrag: () => void;
      enableLayerDrag: () => void;
      dragging(): boolean;
    }
  }
}