import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { usePlantsByPartialCodeQuery } from "@treeditor/lib/plants/queries/plants-by-partial-code.query";
import { useDebounce } from "@treeditor/lib/use-debounce";
import { useState } from "react";
import { fullLatinName } from "@treeditor/lib/plants/full-latin-name";
import Visibility from "@material-ui/icons/Visibility";
import Add from "@material-ui/icons/Add";
import { Plant } from "@treeditor/models/plant";

interface PlantSearchProps {
  onPlantClicked?: (plant: Plant) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      margin: theme.spacing(3),
      minWidth: '400px',
    },
    textField: {
      paddingInline: theme.spacing(2),
      paddingBlock: theme.spacing(1)
    },
    optionTextContainer: {
      flex: 1,
      flexFlow: 'column',
      position: 'relative'
    },
    optionIconContainer: {
      position: 'absolute',
      right: theme.spacing(1),
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center'
    }
  })
)

function PlantSearch({ onPlantClicked }: PlantSearchProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<Plant>(null);
  const debouncedInputValue = useDebounce(inputValue);
  const { isLoading, data } = usePlantsByPartialCodeQuery(debouncedInputValue);
  const classes = useStyles();

  return (
    <>
      <Paper className={classes.paper}>
        <Autocomplete 
          loading={isLoading}
          freeSolo
          blurOnSelect={true}
          clearOnBlur={true}
          options={data ? data.items : []}
          getOptionLabel={plant => plant.code}
          inputValue={inputValue}
          value={value}
          onInputChange={(e, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onBlur={() => {
            setInputValue('');
            setValue(null);
          }}
          onChange={(e, value) => {
            setInputValue('');
            setValue(null);

            if (typeof value === 'string' || value === null) {
              return;
            }

            onPlantClicked?.(value);
          }}
          renderInput={({InputProps, ...params}) => (
            <TextField {...params} placeholder="Search plant by code" InputProps={{...InputProps, className: classes.textField}}/>
          )}
          renderOption={plant => (
            <>
              <div className={classes.optionTextContainer}>
                <Typography variant="body2" color="textSecondary">{fullLatinName(plant)}</Typography>
                <Typography><strong>{plant.code}</strong></Typography>
                <Typography>{plant.commonName}</Typography>
                <div className={classes.optionIconContainer}>{plant.position ? <Visibility /> : <Add />}</div>
              </div>
            </>
          )}
        />
      </Paper>
    </>
  )
}

export default PlantSearch;