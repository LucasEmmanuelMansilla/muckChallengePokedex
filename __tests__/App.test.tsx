/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

test('muestra la Pokédex', async () => {
  globalThis.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({ results: [] }),
  })) as jest.Mock;

  let tree: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });

  expect(JSON.stringify(tree!.toJSON())).toContain('Pokédex');

  await ReactTestRenderer.act(async () => {
    tree!.unmount();
  });
});
