import { withPageAuthRequired } from '@auth0/nextjs-auth0/dist/frontend';
import Button from '@material-ui/core/Button';

function Home() {
  return (
    <>
      <Button color="primary">Test</Button>
    </>
  )
}

export default withPageAuthRequired(Home);