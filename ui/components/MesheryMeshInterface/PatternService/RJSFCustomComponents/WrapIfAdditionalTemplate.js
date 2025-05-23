import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { ADDITIONAL_PROPERTY_FLAG } from '@rjsf/utils';
import { IconButton, Input, InputLabel, Grid, FormControl } from '@layer5/sistent';
import { iconMedium } from '../../../../css/icons.styles';

const WrapIfAdditionalTemplate = ({
  children,
  classNames,
  disabled,
  id,
  label,
  onDropPropertyClick,
  onKeyChange,
  readonly,
  required,
  schema,
}) => {
  const value = label.startsWith('newKey') ? '' : label; // removing the default value i.e newKey.
  const keyLabel = `Key`;
  const additional = ADDITIONAL_PROPERTY_FLAG in schema;

  if (!additional) {
    return <div className={classNames}>{children}</div>;
  }
  const handleChange = ({ target }) => onKeyChange(target.value);

  return (
    <Grid container key={`${id}-key`} alignItems="center" spacing={2} className={classNames}>
      <Grid item xs>
        <FormControl fullWidth={true} required={required}>
          <InputLabel>{keyLabel}</InputLabel>
          <Input
            autoFocus={true}
            defaultValue={value}
            disabled={disabled || readonly}
            id={`${id}-key`}
            name={`${id}-key`}
            onChange={!readonly ? handleChange : undefined}
            type="text"
          />
        </FormControl>
      </Grid>
      <Grid item style={{ alignSelf: 'flex-end' }}>
        <span style={{ fontSize: '1.25rem' }}>&nbsp;:&nbsp;</span>
      </Grid>
      <Grid item={true} xs>
        {children}
      </Grid>
      <Grid item={true}>
        <IconButton
          component="span"
          disabled={disabled || readonly}
          onClick={onDropPropertyClick(label)}
        >
          <DeleteIcon style={iconMedium} />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default WrapIfAdditionalTemplate;
