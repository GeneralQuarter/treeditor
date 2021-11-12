import { Plant } from '@treeditor/models/plant';
import { LatLng, LatLngTuple, Map, PathOptions, SVG } from 'leaflet';
import { MapContainer, Polygon, Polyline } from 'react-leaflet';
import { polygons } from '@treeditor/data/polygons';
import PlantMarker from './plant-marker';
import { addSmoothWheelZoom } from '@treeditor/lib/leaflet/add-smooth-wheel-zoom';
import { EditorMapProps } from './editor-map.props';
import RectangleMarker from './rectangle-marker';

import '@geoman-io/leaflet-geoman-free';


const initialCenter: LatLngTuple = [46.37926, 0.88279];
const fullRenderer = new SVG({ padding: 1 });

const terrainPathOptions: PathOptions = { color: 'green', fillOpacity: 0.4, dashArray: '6', weight: 2, fillColor: 'white' };
const twoMetersNorthPathOptions: PathOptions = { color: 'gray', fillOpacity: 0.2, dashArray: '2', weight: 1 };
const highTensionLinePathOptions: PathOptions = { color: 'blue', opacity: 0.3, weight: 1 };

function EditorMap({plants, onPlantPositionChange, rectangles, onRectangleCoordsChange, setMap, selectedPlant, setSelectedPlant}: EditorMapProps) {
  const whenCreated = (map: Map) => {
    addSmoothWheelZoom(map);
    setMap?.(map);
  }

  const plantClicked = (plant: Plant) => {
    setSelectedPlant(selectedPlant && selectedPlant.code === plant.code ? null : plant);
  }

  const plantPositionChanged = (plant: Plant, newPosition: LatLng) => {
    onPlantPositionChange(plant, [newPosition.lat, newPosition.lng]);
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
    <Polygon positions={polygons.path} pathOptions={{ color: 'black', stroke: false, fillOpacity: 0.2 }} renderer={fullRenderer} pmIgnore={true} />
    <Polyline positions={polygons.twoMetersNorth} pathOptions={twoMetersNorthPathOptions} renderer={fullRenderer} pmIgnore={true} />
    <Polyline positions={polygons.highTensionLine1} pathOptions={highTensionLinePathOptions} renderer={fullRenderer} pmIgnore={true} />
    <Polyline positions={polygons.highTensionLine2} pathOptions={highTensionLinePathOptions} renderer={fullRenderer} pmIgnore={true} />
    <Polyline positions={polygons.highTensionLine3} pathOptions={highTensionLinePathOptions} renderer={fullRenderer} pmIgnore={true} />
    {rectangles.map(rectangle => (
      <RectangleMarker key={rectangle.id}
        rectangle={rectangle}
        onCoordsChange={newCoords => onRectangleCoordsChange(rectangle, newCoords)}
      />
    ))}
    {plants.map(plant => (
      <PlantMarker key={plant.code} 
        plant={plant} 
        onClick={() => plantClicked(plant)} 
        onPositionChange={newPosition => plantPositionChanged(plant, newPosition)}
        selected={selectedPlant && plant.code === selectedPlant.code}
      />
    ))}
  </MapContainer>
}

export default EditorMap;