import { Rectangle } from '@treeditor/models/rectangle';
import { Polygon, Tooltip, useMapEvent } from 'react-leaflet';
import { Polygon as LeafletPolygon, LatLng } from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import { dimensionsText } from '@treeditor/lib/rectangles/dimensions-text';

export interface RectangleMarkerProps {
  rectangle: Rectangle;
  onCoordsChange?: (newCoords: [number, number][]) => void;
}

export default function RectangleMarker({ rectangle, onCoordsChange }: RectangleMarkerProps) {
  const polygonRef = useRef<LeafletPolygon | null>(null);
  const [locked, setLocked] = useState<boolean>(true);
  const [newCoords, setNewCoords] = useState<[number, number][] | null>(null);

  const eventHandlers = {
    contextmenu() {
      if (!locked && newCoords) {
        onCoordsChange?.(newCoords);
        setNewCoords(null);
      }

      setLocked(!locked);
    },
    'pm:dragstart': () => {
      const polygon = polygonRef.current;

      if (!polygon) {
        return;
      }

      polygon.pm.disableRotate();
    },
    'pm:dragend': (e: {target: LeafletPolygon}) => {
      const latLngs = e.target.getLatLngs()[0] as LatLng[];
      setNewCoords(latLngs.map(ll => [ll.lat, ll.lng]));

      const polygon = polygonRef.current;

      if (!polygon) {
        return;
      }

      polygon.pm.enableRotate();
    },
    'pm:rotateend': (e: {target: LeafletPolygon}) => {
      const latLngs = e.target.getLatLngs()[0] as LatLng[];
      setNewCoords(latLngs.map(ll => [ll.lat, ll.lng]));
    }
  };

  useEffect(() => {
    const polygon = polygonRef.current;

    if (!polygon) {
      return;
    }

    if (locked) {
      setTimeout(() => {
        polygon.pm.disableLayerDrag()
        polygon.pm.disableRotate();
      }, 0);
      polygon.setStyle({fillColor: 'purple'});
    } else {
      polygon.pm.enableLayerDrag();
      polygon.pm.enableRotate();
      polygon.setStyle({fillColor: 'blue'});
    }
  }, [polygonRef, locked])

  return (
    <Polygon positions={rectangle.coords}
      ref={polygonRef}
      eventHandlers={eventHandlers}
      weight={1}
      pathOptions={{ color: 'purple' }}>
      <Tooltip direction="center" className="rectangle-label">
        <span className="label">{rectangle.label}</span>
        <div className="dimensions">{dimensionsText(rectangle)}</div>
      </Tooltip>
    </Polygon>
  )
}