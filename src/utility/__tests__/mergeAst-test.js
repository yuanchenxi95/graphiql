/**
 *  Copyright (c) Facebook, Inc. and its affiliates.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';

import { parse } from 'graphql';

import { mergeAst } from '../mergeAst';
import { customizedPrint } from '../customizedPrint';

import { fixtures } from './mergeAst-fixture';

describe('MergeAst', () => {
  fixtures.forEach(fixture => {
    it(fixture.desc, () => {
      const result = customizedPrint(mergeAst(parse(fixture.query))).replace(/\s/g, '');
      expect(result).to.equal(fixture.mergedQuery.replace(/\s/g, ''));
    });
  });
});
