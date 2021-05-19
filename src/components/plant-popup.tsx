
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { Plant } from "@treeditor/models/plant";
import Typography from "@material-ui/core/Typography";
import { fullLatinName } from "@treeditor/lib/plants/full-latin-name";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

interface PlantPopupProps {
  plant: Plant;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: theme.spacing(3),
      minWidth: '400px',
    }
  })
)

function PlantPopup({ plant }: PlantPopupProps) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader 
        title={plant.code}
        subheader={plant.commonName}
      />
      <CardContent>
        <Typography><i>{fullLatinName(plant)}</i></Typography>
        <Typography>{plant.height}m (H) x {plant.width}m (W)</Typography>
      </CardContent>
    </Card>
  )
}

export default PlantPopup;