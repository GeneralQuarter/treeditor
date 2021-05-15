import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { EditorMapProps } from '@treeditor/components/editor-map.props';
import { Plant } from '@treeditor/models/plant';
import dynamic from 'next/dynamic'
import { useMemo } from 'react';

const initialCenter: [number, number] = [46.37926, 0.88279];
const initialPlants: Plant[] = [
  {
    code: 'MADO-01',
    width: 2,
    height: 3,
    position: initialCenter,
  },
  {
    code: 'MADO-02',
    width: 6,
    height: 32,
    position: [initialCenter[0], initialCenter[1] + 0.0001]
  }
]

function Home() {
  const EditorMap = useMemo(() => dynamic<EditorMapProps>(
    () => import('../src/components/editor-map'),
    { ssr: false }
  ), []);

  return (
    <>
      <div style={{width: '100vw', height: '100vh'}}>
        <EditorMap plants={initialPlants} />
      </div>
    </>
  )
}

export default withPageAuthRequired(Home);