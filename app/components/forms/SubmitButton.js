import React from 'react';
import { useFormikContext } from 'formik'

import AppButton from '../AppButton';

function SubmitButton({title,style,...otherProps}) {
  const { handleSubmit, isValid } = useFormikContext()

  return (
    <AppButton 
      name={title} 
      style={style} 
      {...otherProps} 
      onPress={handleSubmit}
      disabled={!isValid}
    />
  );
}



export default SubmitButton;