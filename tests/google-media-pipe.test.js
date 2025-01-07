import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GoogleRemoveBgTool from '../src/components/tools/google-media-pipe/google-media-pipe-tool.js';

const mockStore = configureStore([]);
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('GoogleRemoveBgTool Component', () => {
  it('calls handleRemoveBackground and updates image', async () => {
    const initialState = {
      image: {
        image: { src: 'test-image' },
        imageBeforeRemoveGoogle: null,
      },
      auth: {
        isAuthenticated: true,
      },
    };

    const { store } = renderWithProvider(
      <GoogleRemoveBgTool
        canvasRef={{ current: document.createElement('canvas') }}
      />,
      initialState
    );

    const removeBgButton = screen.getByText('Удалить фон');
    fireEvent.click(removeBgButton);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'SET_IMAGE_BEFORE_REMOVE_GOOGLE',
      payload: { src: 'test-image' },
    });
  });
});
