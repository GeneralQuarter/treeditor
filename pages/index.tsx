import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditorMapProps } from '@treeditor/components/editor-map.props';
import getPlantsWithPosition from '@treeditor/lib/plants/get-plants-with-position';
import { PaginatedResult } from '@treeditor/models/paginated-result';
import { Plant } from '@treeditor/models/plant';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration'

export const getServerSideProps: GetServerSideProps = async () => {
  const paginatedPlants = await getPlantsWithPosition();
  const queryClient = new QueryClient()

  queryClient.setQueryData<PaginatedResult<Plant>>('plants-with-position', paginatedPlants);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    }
  }
}

function Home() {
  const fetchPlantsWithPosition = () => fetch('/api/plants?has-position=true').then(res => res.json());

  const { isLoading, error, data } = useQuery<PaginatedResult<Plant>>('plants-with-position', fetchPlantsWithPosition);

  const EditorMap = useMemo(() => dynamic<EditorMapProps>(
    () => import('../src/components/editor-map'),
    { ssr: false }
  ), []);

  if (isLoading) {
    return <p>Loading ...</p>
  }

  if (error) {
    return <p>An error as occured :(</p>
  }

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <EditorMap plants={data.items} />
      </div>
    </>
  )
}

export default withPageAuthRequired(Home);