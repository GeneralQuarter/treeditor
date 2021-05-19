import { useState } from 'react';
import { Plant } from '@treeditor/models/plant';
import { LatLng, LatLngTuple, Map, PathOptions, SVG } from 'leaflet';
import { MapContainer, Polygon } from 'react-leaflet';
import { polygons } from '@treeditor/data/polygons';
import PlantMarker from './plant-marker';
import { addSmoothWheelZoom } from '@treeditor/lib/leaflet/add-smooth-wheel-zoom';
import { EditorMapProps } from './editor-map.props';

import '@geoman-io/leaflet-geoman-free';

const initialCenter: LatLngTuple = [46.37926, 0.88279];
const fullRenderer = new SVG({ padding: 1 });

const terrainPathOptions: PathOptions = { color: 'green', fillOpacity: 0.4, dashArray: '6', weight: 2, fillColor: 'white' };

function EditorMap({plants, onPlantPositionChange, setMap}: EditorMapProps) {
  const [selectedPlant, setSelectedPlant] = useState<string | null>();

  const whenCreated = (map: Map) => {
    addSmoothWheelZoom(map);
    setMap?.(map);
  }

  const plantClicked = (plant: Plant) => {
    setSelectedPlant(plant.code === selectedPlant ? null : plant.code);
  }

  const plantPositionChanged = (plant: Plant, newPosition: LatLng) => {
    onPlantPositionChange(plant, [newPosition.lat, newPosition.lng]);
  }

  const plantLockChanged = (plant: Plant, locked: boolean) => {
    setSelectedPlant(plant.code);
  }

  return <MapContainer
    center={initialCenter}
    zoom={17}
    maxZoom={23}
    style={{ width: '100vw', height: '100vh' }}
    scrollWheelZoom={false}
    whenCreated={whenCreated}
    doubleClickZoom={false}
    zoomControl={false}
  >
    <Polygon positions={polygons.terrain} pathOptions={terrainPathOptions} renderer={fullRenderer} pmIgnore={true} />
    <Polygon positions={polygons.happyLake} pathOptions={{ color: 'blue', stroke: false }} renderer={fullRenderer} pmIgnore={true} />
    <Polygon positions={polygons.d116} pathOptions={{ color: 'black', stroke: false, fillOpacity: 0.5 }} renderer={fullRenderer} pmIgnore={true} />
    <Polygon positions={polygons.gartempe} pathOptions={{ color: 'blue', stroke: false, fillOpacity: 0.5 }} renderer={fullRenderer} pmIgnore={true} />
    {plants.map(plant => (
      <PlantMarker key={plant.code} 
        plant={plant} 
        onClick={() => plantClicked(plant)} 
        onPositionChange={newPosition => plantPositionChanged(plant, newPosition)}
        onLockChange={locked => plantLockChanged(plant, locked)}
        selected={plant.code === selectedPlant}
      />
    ))}
  </MapContainer>
}

export default EditorMap;