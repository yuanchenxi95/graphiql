/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';

import Argument from './Argument';
import MarkdownContent from './MarkdownContent';
import TypeLink from './TypeLink';
import InjectQueryButton from './InjectQueryButton';

export default class FieldDoc extends React.Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    setEditorValue: PropTypes.func.isRequired,
    onClickType: PropTypes.func,
  };

  shouldComponentUpdate(nextProps) {
    return this.props.field !== nextProps.field || this.props.type !== nextProps.type;
  }

  render() {
    const { field, schema, type, setEditorValue } = this.props;

    let argsDef;
    if (field.args && field.args.length > 0) {
      argsDef = (
        <div className="doc-category">
          <div className="doc-category-title">
            {'arguments'}
          </div>
          {field.args.map(arg =>
            <div key={arg.name} className="doc-category-item">
              <div>
                <Argument arg={arg} onClickType={this.props.onClickType} />
              </div>
              <MarkdownContent
                className="doc-value-description"
                markdown={arg.description}
              />
            </div>,
          )}
        </div>
      );
    }

    return (
      <div>
        <MarkdownContent
          className="doc-type-description"
          markdown={field.description || 'No Description'}
        />
        {field.deprecationReason &&
          <MarkdownContent
            className="doc-deprecation"
            markdown={field.deprecationReason}
          />}
        <InjectQueryButton schema={schema} type={type} field={field} setEditorValue={setEditorValue} />
        <div className="doc-category">
          <div className="doc-category-title">
            {'type'}
          </div>
          <TypeLink type={field.type} onClick={this.props.onClickType} />
        </div>
        {argsDef}
      </div>
    );
  }
}
