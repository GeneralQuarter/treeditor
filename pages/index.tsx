import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditorMapProps } from '@treeditor/components/editor-map.props';
import PlantPopup from '@treeditor/components/plant-popup';
import Search from '@treeditor/components/search';
import { getPlantsWithPosition } from '@treeditor/lib/contentful/get-plants-with-position';
import { getRectanglesWithCoords } from '@treeditor/lib/contentful/get-rectangles-with-coords';
import { generateRectangle } from '@treeditor/lib/leaflet/generate-rectangle';
import { useUpdatePlantMutation } from '@treeditor/lib/plants/mutations/update-plant-position.mutation';
import { plantsWithPositionQueryKey, usePlantsWithPositionQuery } from '@treeditor/lib/plants/queries/plants-with-position.query';
import { useUpdateRectangleCoordsMutation } from '@treeditor/lib/rectangles/mutations/update-rectangle-coords.mutation';
import { rectanglesWithCoordsQueryKey, useRectanglesWithCoordsQuery } from '@treeditor/lib/rectangles/queries/rectangles-with-coords.query';
import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Plant } from '@treeditor/models/plant';
import { Rectangle } from '@treeditor/models/rectangle';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration'

export const getServerSideProps: GetServerSideProps = async () => {
  const paginatedPlants = await getPlantsWithPosition();
  const paginatedRectangles = await getRectanglesWithCoords();
  const queryClient = new QueryClient()

  queryClient.setQueryData<PaginatedResult<Plant>>(plantsWithPositionQueryKey, paginatedPlants);
  queryClient.setQueryData<PaginatedResult<Rectangle>>(rectanglesWithCoordsQueryKey, paginatedRectangles);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

function Home() {
  const { isLoading: isLoadingPlants, error: errorPlants, data: dataPlants } = usePlantsWithPositionQuery();
  const { isLoading: isLoadingRectangles, error: errorRectangles, data: dataRectangles } = useRectanglesWithCoordsQuery();
  const updatePlantPositionMutation = useUpdatePlantMutation();
  const updateRectangleCoordsMutation = useUpdateRectangleCoordsMutation();
  const [map, setMap] = useState<any | null>();
  const [selectedPlant, setSelectedPlant] = useState<Plant>();

  const EditorMap = useMemo(() => dynamic<EditorMapProps>(
    () => import('../src/components/editor-map'),
    { ssr: false }
  ), []);

  const plantPositionChanged = async (plant: Plant, newPosition: [number, number]) => {
    try {
      const newPlant = {...plant, position: newPosition};
      updatePlantPositionMutation.mutate(newPlant);
      updateSelectedPlant(newPlant);
    } catch (e) {
      console.log(e);
    }
  }

  const rectangleCoordsChanged = async (rectangle: Rectangle, newCoords: [number, number][]) => {
    try {
      const newRectangle = {...rectangle, coords: newCoords};
      updateRectangleCoordsMutation.mutate(newRectangle);
    } catch (e) {
      console.log(e);
    }
  }

  const searchPlantClicked = async (plant: Plant) => {
    if (!map) {
      return;
    }

    if (plant.position) {
      map.flyTo(plant.position, 23);
    } else {
      const coords = map.getCenter();
      const newPlant = {...plant, position: [coords.lat, coords.lng] as [number, number]};
      updatePlantPositionMutation.mutate(newPlant);
      updateSelectedPlant(newPlant);
    }
  }

  const searchRectangleClicked = async (rectangle: Rectangle) => {
    if (!map) {
      return;
    }

    if (rectangle.coords) {
      map.flyTo(rectangle.coords[0], 20);
    } else {
      const center = map.getCenter();
      const coords = generateRectangle([center.lat, center.lng], rectangle.width, rectangle.length);
      const newRectangle = {...rectangle, coords: coords};
      updateRectangleCoordsMutation.mutate(newRectangle);
    }
  }

  // position of the selected plant was updated, update the selected plant with the new position
  const updateSelectedPlant = (newPlant: Plant) => {
    if (!selectedPlant || !newPlant) {
      return;
    }

    if (newPlant.code !== selectedPlant.code) {
      return;
    }

    setSelectedPlant(newPlant);
  }

  if (isLoadingPlants || isLoadingRectangles) {
    return <p>Loading ...</p>
  }

  if (errorPlants || errorRectangles) {
    return <p>An error as occured :(</p>
  }

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <EditorMap plants={dataPlants.items} 
          rectangles={dataRectangles.items} 
          onPlantPositionChange={plantPositionChanged}
          onRectangleCoordsChange={rectangleCoordsChanged} 
          setMap={setMap} 
          selectedPlant={selectedPlant} 
          setSelectedPlant={setSelectedPlant}
        />
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 500 }}>
          <Search onPlantClicked={searchPlantClicked} onRectangleClicked={searchRectangleClicked} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 500}}>
          {selectedPlant && <PlantPopup plant={selectedPlant} onShowOnMapClicked={searchPlantClicked}/>}
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(Home);