import React from 'react';
import {Classes} from '@blueprintjs/popover2';
import {mount} from 'enzyme';
import SchemaDropdown from '../schema-dropdown';
import {act} from '../../../test-utils';

describe('Dropdown without portal', () => {
  it('Renders a dropdown', async () => {
    const clickHandler = jest.fn();
    const wrapper = mount(
      <SchemaDropdown
        schema={{type: 'string'}}
        usePortal={false}
        transitionDuration={0}
        hoverOpenDelay={0}
        hoverCloseDelay={0}
        handleOnClick={clickHandler}>
        <div className="mytarget">Text</div>
      </SchemaDropdown>,
    );

    const targetNode = wrapper.find(`.${Classes.POPOVER2_TARGET}`);
    await act(async () => {
      targetNode.simulate('click');
    });
    wrapper.update();
    expect(targetNode.getDOMNode()).toHaveClass(Classes.POPOVER2_OPEN);

    const contentNode = wrapper.find(`.${Classes.POPOVER2_CONTENT}`);

    // Assert that selected schema is string
    let selectedType = contentNode.find('.schema-literal-selected').text();
    expect(selectedType).toBe('string');

    // Select object schema
    contentNode.find('.schema-object').simulate('click');

    expect(clickHandler).toHaveBeenCalledWith('object', ['type']);
  });
});
