import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { usePlantsByPartialCodeQuery } from '@treeditor/lib/plants/queries/plants-by-partial-code.query';
import { useDebounce } from '@treeditor/lib/use-debounce';
import { useState } from 'react';
import { fullLatinName } from '@treeditor/lib/plants/full-latin-name';
import Visibility from '@mui/icons-material/Visibility';
import Add from '@mui/icons-material/Add';
import { Plant } from '@treeditor/models/plant';
import { Rectangle } from '@treeditor/models/rectangle';
import { styled } from '@mui/styles';
import { Stack } from '@mui/material';
import { useRectanglesByPartialLabelQuery } from '@treeditor/lib/rectangles/queries/rectangles-by-partial-label.query';
import { dimensionsText } from '@treeditor/lib/rectangles/dimensions-text';

interface SearchProps {
  onPlantClicked?: (plant: Plant) => void;
  onRectangleClicked?: (rectangle: Rectangle) => void;
}

const Container = styled(Paper)({
  minWidth: '400px',
});

const OptionContainer = styled(Stack)({
  position: 'relative',
});

const OptionIconContainer = styled(Stack)({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
});

interface PlantOption extends Plant {
  __type: 'Plant'
};

interface RectangleOption extends Rectangle {
  __type: 'Rectangle'
}

type Option = PlantOption | RectangleOption;

function Search({ onPlantClicked, onRectangleClicked }: SearchProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<Option | null>(null);
  const debouncedInputValue = useDebounce(inputValue);
  const { isLoading: isLoadingPlants, data: dataPlants } = usePlantsByPartialCodeQuery(debouncedInputValue);
  const { isLoading: isLoadingRectangles, data: dataRectangles } = useRectanglesByPartialLabelQuery(debouncedInputValue);

  const mergeOptions = (plants: Plant[], rectangles: Rectangle[]): Option[] => {
    const plantOptions: Option[] = plants.map(p => ({
      __type: 'Plant',
      ...p
    }));

    const rectangleOptions: Option[] = rectangles.map(r => ({
      __type: 'Rectangle',
      ...r
    }));

    return plantOptions.concat(rectangleOptions);
  }

  return (
    <Container sx={{ m: 3 }}>
      <Autocomplete 
        loading={isLoadingPlants || isLoadingRectangles}
        freeSolo
        blurOnSelect={true}
        clearOnBlur={true}
        options={dataPlants && dataRectangles ? mergeOptions(dataPlants.items, dataRectangles.items) : []}
        inputValue={inputValue}
        value={value}
        getOptionLabel={o => o.__type === 'Plant' ? o.code : o.label}
        groupBy={o => o.__type}
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

          const { __type, ...item } = value;

          if (__type === 'Plant') {
            onPlantClicked?.(item as Plant);
          } else if (__type === 'Rectangle') {
            onRectangleClicked?.(item as Rectangle);
          }
        }}
        renderInput={({InputProps, ...params}) => (
          <TextField {...params} placeholder="Search plant by code" InputProps={{...InputProps, sx: { px: 2, py: 1 }}}/>
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <OptionContainer sx={{ width: '100%', my: 1 }}>
              {option.__type === 'Plant' && <Typography variant="body2" color="textSecondary">{fullLatinName(option)}</Typography>}
              <Typography><strong>{option.__type === 'Plant' ? option.code : option.label}</strong></Typography>
              <Typography>{option.__type === 'Plant' ? option.commonName : dimensionsText(option)}</Typography>
              <OptionIconContainer alignItems="center" justifyContent="center">
                {option.__type === 'Plant' && option.position || option.__type === 'Rectangle' && option.coords ? <Visibility /> : <Add />}
              </OptionIconContainer>
            </OptionContainer>
          </li>
        )}
      />
    </Container>
  )
}

export default Search;