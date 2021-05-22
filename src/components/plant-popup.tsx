
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Plant } from "@treeditor/models/plant";
import Typography from "@material-ui/core/Typography";
import { fullLatinName } from "@treeditor/lib/plants/full-latin-name";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { hostNameFromUrl } from "@treeditor/lib/plants/hostname-from-url";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";

interface PlantPopupProps {
  plant: Plant;
  onShowOnMapClicked: (plant: Plant) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(3),
      minWidth: '400px',
    },
    content: {
      position: 'relative'
    },
    showOnMap: {
      position: 'absolute',
      top: theme.spacing(1),
      right: theme.spacing(1)
    },
    link: {
      marginTop: theme.spacing(2),
      display: 'block',
    }
  })
)

function PlantPopup({ plant, onShowOnMapClicked }: PlantPopupProps) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography><i>{fullLatinName(plant)}</i></Typography>
        <Typography variant="h4" color="secondary">{plant.code}</Typography>
        <Typography variant="subtitle1">{plant.commonName}</Typography>
        <Typography>{plant.height}m (H) x {plant.width}m (D)</Typography>
        {plant.sourceLinks.map(l => (
          <Link key={l} href={l} target="_blank" className={classes.link}>{hostNameFromUrl(l)}</Link>
        ))}
        <IconButton className={classes.showOnMap} onClick={() => onShowOnMapClicked(plant)}>
          <Visibility />
        </IconButton>
      </CardContent>
    </Card>
  )
}

export default PlantPopup;