import { Stack } from '@mui/material';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/styles';

interface PlantTagsProps {
  tags: string[];
}

const Container = styled(Stack)({
  maxWidth: '400px',
  flexWrap: 'wrap',
  textTransform: 'capitalize'
});

function PlantTags({ tags }: PlantTagsProps) {
  return <Container direction="row">
    {tags.map(tag => (
      <Chip key={tag} size="small" sx={{ mr: 1, mt: 1 }} label={tag.split('-').join(' ')} />
    ))}
  </Container>;
}

export default PlantTags;