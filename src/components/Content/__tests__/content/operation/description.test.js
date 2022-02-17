import React from 'react';
import {
  screen,
  userEvent,
  StoreCreator,
  render,
} from '../../../../../../test-utils.js';
import Description from '../../../operation/description';

describe('Parameters tests', () => {
  const user = userEvent.setup();
  let store, relativeJsonPath;

  beforeEach(async () => {
    const {stores, creator} = StoreCreator();
    const node = creator.createPath('/user/abc', {post: 'Hello'});
    stores.uiStore.setActiveNode(node);
    relativeJsonPath = node.relativeJsonPath;
    render(<Description relativeJsonPath={relativeJsonPath} />, {
      providerProps: {value: stores},
    });
    store = stores;
  });

  it('has description, operationid and deprecation checkbox', () => {
    expect(screen.getByRole(/checkbox/)).toBeInTheDocument();
    expect(screen.getByRole(/textbox/)).toBeInTheDocument();
    expect(screen.getByRole(/textbox/)).toHaveTextContent('');
    expect(screen.getByTestId('operation-id')).toHaveTextContent(
      'post-user-abc',
    );
    expect(store).toHaveSchemaAt(
      [...relativeJsonPath, 'operationId'],
      'post-user-abc',
    );
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'description'], null);
  });

  it('can change description', async () => {
    await user.type(screen.getByRole(/textbox/), 'Pqr');
    expect(screen.getByTestId('operation-id')).toHaveTextContent(
      'post-user-abc',
    );
    expect(screen.getByRole(/textbox/)).toHaveTextContent('Pqr');
    expect(store).toHaveSchemaAt(
      [...relativeJsonPath, 'operationId'],
      'post-user-abc',
    );
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'description'], 'Pqr');
  });

  it('can toggle deprecation', async () => {
    await user.click(screen.getByRole(/checkbox/));
    expect(screen.getByRole(/checkbox/)).toBeChecked();
    expect(screen.getByTestId('operation-id')).toHaveTextContent(
      'post-user-abc',
    );
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'deprecated'], true);

    await user.click(screen.getByRole(/checkbox/));
    expect(screen.getByRole(/checkbox/)).not.toBeChecked();
    expect(screen.getByTestId('operation-id')).toHaveTextContent(
      'post-user-abc',
    );
    expect(store).toHaveSchemaAt([...relativeJsonPath, 'deprecated'], null);
  });
});
