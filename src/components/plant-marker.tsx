import { useEffect, useRef, useState } from 'react';
import { Circle, Tooltip, useMapEvent } from 'react-leaflet';
import { Circle as LeafletCircle, LatLng } from 'leaflet';
import HeightTriangle from './height-triangle';
import { Plant } from '@treeditor/models/plant';

export interface PlantMarkerProps {
  plant: Plant;
  onPositionChange?: (newPosition: LatLng) => void;
  onLockChange?: (locked: boolean) => void;
  onClick?: () => void;
  selected?: boolean;
}

export default function PlantMarker({ plant, onPositionChange, onLockChange, onClick, selected }: PlantMarkerProps) {
  const circleRef = useRef<LeafletCircle | null>(null);
  const [showLabel, setShowlabel] = useState(false);
  const [locked, setLocked] = useState(true);
  const [newPosition, setNewPosition] = useState<LatLng | null>(null);

  const eventHandlers = {
    contextmenu() {
      if (!locked && newPosition) {
        onPositionChange?.(newPosition);
        setNewPosition(null);
      }

      setLocked(!locked);
      onLockChange?.(!locked);
    },
    click(e: {target: LeafletCircle}) {
      if (e.target.pm.dragging()) {
        return;
      }

      onClick?.();
    },
    'pm:dragend': (e: {target: LeafletCircle}) => {
      setNewPosition(e.target.getLatLng());
    }
  };

  useMapEvent('zoom', () => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    const { width } = (circle as any)._path.getBoundingClientRect();

    if (width >= 72) {
      if (!showLabel) {
        setShowlabel(true);
      }
    } else {
      if (showLabel) {
        setShowlabel(false)
      }
    }
  });

  useEffect(() => {
    const circle = circleRef.current;

    if (!circle) {
      return;
    }

    const isAzoteFixator = plant.tags.includes('fixateurDazote');

    if (locked) {
      setTimeout(() => {
        circle.pm.disableLayerDrag();
      }, 0)
      circle.setStyle({fillColor: isAzoteFixator ? 'green' : 'gray'});
    } else {
      circle.pm.enableLayerDrag();
      circle.setStyle({fillColor: 'blue'});
    }
  }, [circleRef, locked])
  
  return (
    <Circle center={plant.position} 
            radius={plant.width / 2}
            ref={circleRef}
            eventHandlers={eventHandlers}
            pathOptions={{color: selected ? 'blue' : 'gray'}} 
            weight={1}>
      {showLabel && 
        <Tooltip direction="center" interactive={false} permanent={true} className="plant-label">
          <div className="code">{plant.code}</div>
          <div className="height">{plant.height}</div>
          <div className="plant-center"></div>
          <HeightTriangle height="40" width="40" className="triangle" />
        </Tooltip>
      }
    </Circle>
  )
}