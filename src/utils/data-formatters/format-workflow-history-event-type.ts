// Copyright (c) 2022-2024 Uber Technologies Inc.
//
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { type HistoryEvent } from '@/__generated__/proto-ts/uber/cadence/api/v1/HistoryEvent';

// Utility type to capitalize the first letter
type CapitalizeFirstLetter<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : T;

// Utility type to remove 'EventAttributes' suffix
type RemoveEventAttributes<T extends string> =
  T extends `${infer Prefix}EventAttributes` ? Prefix : T;

// Combine both transformations: capitalize and remove 'EventAttributes'
type TransformEventType<T extends string> = CapitalizeFirstLetter<
  RemoveEventAttributes<T>
>;

const formatWorkflowHistoryEventType = <T extends HistoryEvent['attributes']>(
  attributes: T
) => {
  if (!attributes) return attributes;

  return `${attributes[0].toUpperCase()}${attributes.slice(1)}`.replace(
    'EventAttributes',
    ''
  ) as TransformEventType<T>;
};

export default formatWorkflowHistoryEventType;
