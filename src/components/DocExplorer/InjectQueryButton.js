import React, { Fragment } from 'react'

import { injectQuery, getRootType, ROOT_TYPE } from '../../utility/argumentsGenerator';
import PropTypes from 'prop-types'

export default function InjectQueryButton({ schema, field, setEditorValue }) {
  const buttonStyles = {
    'borderRadius': '20px',
    'backgroundColor': '#f4f4f4',
    'color': 'black',
  }
  const rootType = getRootType(schema, field);

  return (<Fragment>
    {
      rootType !== ROOT_TYPE.UNSUPPORTED
      && <button
        // className="docExplorerShow"
        style={buttonStyles}
        onClick={() => injectQuery(field, rootType, setEditorValue)}>
        {'+'}
      </button>
    }
  </Fragment>);
}


InjectQueryButton.propTypes = {
  schema: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  setEditorValue: PropTypes.func.isRequired,
};
