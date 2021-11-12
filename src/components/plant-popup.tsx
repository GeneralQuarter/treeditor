
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Plant } from '@treeditor/models/plant';
import Typography from '@mui/material/Typography';
import { fullLatinName } from '@treeditor/lib/plants/full-latin-name';
import Link from '@mui/material/Link';
import { hostNameFromUrl } from '@treeditor/lib/plants/hostname-from-url';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import PlantTags from './plant-tags';
import { styled } from '@mui/styles';

interface PlantPopupProps {
  plant: Plant;
  onShowOnMapClicked: (plant: Plant) => void;
}

const PopupCard = styled(Card)({
  minWidth: '400px',
});

const PopupContent = styled(CardContent)({
  position: 'relative',
});

const ShowOnMapIconButton = styled(IconButton)({
  position: 'absolute',
  top: 0,
  right: 0,
});

const SourceLink = styled(Link)({
  display: 'block',
});

function PlantPopup({ plant, onShowOnMapClicked }: PlantPopupProps) {
  return (
    <PopupCard sx={{ m: 3 }}>
      <PopupContent>
        <Typography><i>{fullLatinName(plant)}</i></Typography>
        <Typography variant="h4" color="secondary">{plant.code}</Typography>
        <Typography variant="subtitle1">{plant.commonName}</Typography>
        <Typography>{plant.height}m (H) x {plant.width}m (D)</Typography>
        <PlantTags tags={plant.tags} />
        {plant.sourceLinks.map(l => (
          <SourceLink key={l} href={l} target="_blank" sx={{ mt: 2 }}>{hostNameFromUrl(l)}</SourceLink>
        ))}
        <ShowOnMapIconButton sx={{ m: 1 }} onClick={() => onShowOnMapClicked(plant)}>
          <Visibility />
        </ShowOnMapIconButton>
      </PopupContent>
    </PopupCard>
  )
}

export default PlantPopup;