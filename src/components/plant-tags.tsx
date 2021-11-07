import Chip from "@material-ui/core/Chip";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBlock: theme.spacing(1),
    '& > *': {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    textTransform: 'capitalize',
    maxWidth: '400px'
  },
}));

interface PlantTagsProps {
  tags: string[];
}

function PlantTags({ tags }: PlantTagsProps) {
  const classes = useStyles();
  return <div className={classes.root} >
    {tags.map(tag => (
      <Chip key={tag} size="small" label={tag.split('-').join(' ')} />
    ))}
  </div>;
}

export default PlantTags;