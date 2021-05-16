import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditorMapProps } from '@treeditor/components/editor-map.props';
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

  if (isLoading) {
    return <p>Loading ...</p>
  }

  if (error) {
    return <p>An error as occured :(</p>
  }

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <EditorMap plants={data.items} onPlantPositionChange={plantPositionChanged} />
      </div>
    </>
  )
}

export default withPageAuthRequired(Home);