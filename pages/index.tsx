import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditorMapProps } from '@treeditor/components/editor-map.props';
import PlantSearch from '@treeditor/components/plant-search';
import { getPlantsWithPosition } from '@treeditor/lib/contentful/get-plants-with-position';
import { useUpdatePlantMutation } from '@treeditor/lib/plants/mutations/update-plant-position.mutation';
import { plantsWithPositionQueryKey, usePlantsWithPositionQuery } from '@treeditor/lib/plants/queries/plants-with-position.query';
import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Plant } from '@treeditor/models/plant';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration'

export const getServerSideProps: GetServerSideProps = async () => {
  const paginatedPlants = await getPlantsWithPosition();
  const queryClient = new QueryClient()

  queryClient.setQueryData<PaginatedResult<Plant>>(plantsWithPositionQueryKey, paginatedPlants);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

function Home() {
  const { isLoading, error, data } = usePlantsWithPositionQuery();
  const updatePlantPositionMutation = useUpdatePlantMutation();

  const EditorMap = useMemo(() => dynamic<EditorMapProps>(
    () => import('../src/components/editor-map'),
    { ssr: false }
  ), []);

  const plantPositionChanged = async (plant: Plant, newPosition: [number, number]) => {
    try {
      await updatePlantPositionMutation.mutate({id: plant.id, newPosition})
    } catch (e) {
      console.log(e);
    }
  }

  const plantSearchPlantClicked = (plant: Plant) => {
    console.log(plant);
  }

  if (isLoading) {
    return <p>Loading ...</p>
  }

  if (error) {
    return <p>An error as occured :(</p>
  }

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <EditorMap plants={data.items} onPlantPositionChange={plantPositionChanged} />
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 500 }}>
          <PlantSearch onPlantClicked={plantSearchPlantClicked} />
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(Home);