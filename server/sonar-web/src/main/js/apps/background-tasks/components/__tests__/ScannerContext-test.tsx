/*
 * SonarQube
 * Copyright (C) 2009-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import { shallow } from 'enzyme';
import * as React from 'react';
import { mockTask } from '../../../../helpers/mocks/tasks';
import { click } from '../../../../helpers/testUtils';
import { TaskTypes } from '../../../../types/tasks';
import ScannerContext from '../ScannerContext';

jest.mock('../../../../api/ce', () => ({
  getTask: jest.fn(() => Promise.resolve({ scannerContext: 'context' }))
}));

const getTask = require('../../../../api/ce').getTask as jest.Mock<any>;

const task = mockTask({
  componentName: 'foo',
  id: '123',
  type: TaskTypes.Report
});

beforeEach(() => {
  getTask.mockClear();
});

it('renders', () => {
  const wrapper = shallow(<ScannerContext onClose={jest.fn()} task={task} />);
  wrapper.setState({ scannerContext: 'context' });
  expect(wrapper).toMatchSnapshot();
});

it('closes', () => {
  const onClose = jest.fn();
  const wrapper = shallow(<ScannerContext onClose={onClose} task={task} />);
  click(wrapper.find('.js-modal-close'));
  expect(onClose).toHaveBeenCalled();
});

it('fetches scanner context on mount', async () => {
  const wrapper = shallow(<ScannerContext onClose={jest.fn()} task={task} />);
  expect(wrapper.state()).toEqual({});
  expect(getTask).toHaveBeenCalledWith('123', ['scannerContext']);
  await new Promise(setImmediate);
  expect(wrapper.state()).toEqual({ scannerContext: 'context' });
});
