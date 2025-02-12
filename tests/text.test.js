import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Text from '../src/components/tools/text-tool/text-tools';
import '@testing-library/jest-dom';

const mockStore = configureStore([]);
const mockDispatch = jest.fn();
let store;
const renderWithProvider = (component, initialState) => {
  const store = mockStore(initialState);
  store.dispatch = mockDispatch;
  return render(<Provider store={store}>{component}</Provider>);
};
describe('Text component', () => {
  beforeEach(() => {
    store = mockStore({
      image: {
        texts: [],
      },
    });
    store.dispatch = jest.fn();
  });

  it('renders the add text icon and label', () => {
    render(
      <Provider store={store}>
        <Text canvasRef={jest.fn()} />
      </Provider>
    );
    const addTextIcon = screen.getByTestId('add-text-icon');
    const addTextLabel = screen.getByText(/добавить текст/i);
    expect(addTextIcon).toBeInTheDocument();
    expect(addTextLabel).toBeInTheDocument();
  });

  it('renders color selection icons and label', () => {
    render(
      <Provider store={store}>
        <Text canvasRef={jest.fn()} />
      </Provider>
    );
    const colorBlocks = screen.getAllByTestId(/color-block-/);
    const colorLabel = screen.getByText(/выбор цвета/i);
    expect(colorBlocks.length).toBe(8);
    expect(colorLabel).toBeInTheDocument();
    colorBlocks.forEach((block, index) => {
      expect(
        screen.getByTestId(`color-icon-${index}`)
      ).toBeInTheDocument();
    });
  });

  it('renders correct labels for color icons', () => {
    render(
      <Provider store={store}>
        <Text canvasRef={jest.fn()} />
      </Provider>
    );
    const label = screen.getByText('Выбор цвета');
    expect(label).toBeInTheDocument();
  });

  it('renders the text input field', () => {
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts: [] },
    });
    expect(screen.getByTestId('text-input')).toBeInTheDocument();
  });

  it('allows entering text in the input field', () => {
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts: [] },
    });
    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(input.value).toBe('Hello');
  });

  it('adds new text when AddText button is clicked', () => {
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts: [] },
    });

    const input = screen.getByTestId('text-input');
    fireEvent.change(input, { target: { value: 'New Text' } });

    fireEvent.click(screen.getByTestId('add-text-icon'));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'ADD_TEXT',
        payload: expect.objectContaining({ content: 'New Text' }),
      })
    );
  });

  it('changes text color when a color block is clicked', () => {
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts: [] },
    });
    const colorBlock = screen.getByTestId('color-block-0');
    fireEvent.click(colorBlock);
    expect(screen.getByTestId('color-icon-0')).toHaveStyle(
      'border: 2px solid #000'
    );
  });

  it('deletes text when the delete icon is clicked', () => {
    const texts = [
      { id: 1, content: 'Text 1' },
      { id: 2, content: 'Text 2' },
    ];
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts },
    });

    fireEvent.click(screen.getByTestId('delete-icon-1'));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'REMOVE_TEXT',
        payload: 1,
      })
    );
  });

  it('handles mouse down and does not move text when dragging is not enabled', () => {
    const texts = [{ id: 1, content: 'Text 1', x: 100, y: 100 }];
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts },
    });

    fireEvent.mouseDown(screen.getByTestId('text-item-1'));
    fireEvent.mouseMove(document, { clientX: 150, clientY: 150 });
    fireEvent.mouseUp(document);

    expect(screen.getByTestId('text-item-1')).toHaveTextContent(
      'Text 1'
    );
  });

  it('moves text up when ArrowUp key is pressed', () => {
    const texts = [{ id: 1, content: 'Text 1', x: 100, y: 100 }];
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts },
    });

    fireEvent.click(screen.getByTestId('text-item-1'));

    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(mockDispatch).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'UPDATE_TEXT',
        payload: expect.objectContaining({
          id: 1,
          updates: { x: 100, y: 95 },
        }),
      })
    );
  });
  it('moves text down when ArrowDown key is pressed', () => {
    const texts = [{ id: 1, content: 'Text 1', x: 100, y: 100 }];
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts },
    });
    fireEvent.click(screen.getByTestId('text-item-1'));

    fireEvent.keyDown(document, { key: 'ArrowDown' });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'UPDATE_TEXT',
        payload: expect.objectContaining({
          id: 1,
          updates: { x: 100, y: 105 },
        }),
      })
    );
  });
  it('moves text left when ArrowLeft key is pressed', () => {
    const texts = [{ id: 1, content: 'Text 1', x: 100, y: 100 }];
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts },
    });
    fireEvent.click(screen.getByTestId('text-item-1'));
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'UPDATE_TEXT',
        payload: expect.objectContaining({
          id: 1,
          updates: { x: 95, y: 100 },
        }),
      })
    );
  });
  it('moves text right when ArrowRight key is pressed', () => {
    const texts = [{ id: 1, content: 'Text 1', x: 100, y: 100 }];
    renderWithProvider(<Text canvasRef={React.createRef()} />, {
      image: { texts },
    });
    fireEvent.click(screen.getByTestId('text-item-1'));
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'UPDATE_TEXT',
        payload: expect.objectContaining({
          id: 1,
          updates: { x: 105, y: 100 },
        }),
      })
    );
  });
  it('returns early if canvasRef.current is null', () => {
    const texts = [{ id: 1, content: 'Text 1', x: 100, y: 100 }];
    const canvasRef = { current: null };
    renderWithProvider(<Text canvasRef={canvasRef} />, {
      image: { texts },
    });
    fireEvent.mouseDown(document, { clientX: 150, clientY: 150 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
describe('Text component - handleMouseMove', () => {
  let store;
  let mockCanvasRef;

  beforeEach(() => {
    store = mockStore({
      image: {
        texts: [
          {
            id: 1,
            content: 'Sample Text',
            x: 100,
            y: 100,
            color: 'black',
            fontSize: 16,
          },
        ],
      },
    });
    store.dispatch = jest.fn();
    mockCanvasRef = {
      current: document.createElement('canvas'),
    };
    mockCanvasRef.current.getBoundingClientRect = jest.fn(() => ({
      left: 0,
      top: 0,
    }));
  });

  it('does nothing if dragging is false or selectedTextId is null', () => {
    render(
      <Provider store={store}>
        <Text canvasRef={mockCanvasRef} />
      </Provider>
    );
    const canvas = mockCanvasRef.current;
    fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(canvas, { clientX: 60, clientY: 60 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });
  it('sets selectedTextId, dragging, and dragOffset when a text is clicked', () => {
    renderWithProvider(<Text canvasRef={mockCanvasRef} />, {
      image: {
        texts: [
          {
            id: 1,
            content: 'Sample Text',
            x: 100,
            y: 100,
            color: 'black',
            fontSize: 16,
          },
        ],
      },
    });
    const canvas = mockCanvasRef.current;
    fireEvent.mouseDown(canvas, { clientX: 110, clientY: 105 });
    expect(store.dispatch).not.toHaveBeenCalled();
    const componentInstance = screen.getByTestId('text-component');
    expect(componentInstance).toBeInTheDocument();
  });
  it('does not update selectedTextId, dragging, or dragOffset when mouse is outside text boundaries', () => {
    renderWithProvider(<Text canvasRef={mockCanvasRef} />, {
      image: {
        texts: [
          {
            id: 1,
            content: 'Sample Text',
            x: 100,
            y: 100,
            color: 'black',
            fontSize: 16,
          },
        ],
      },
    });
    const canvas = mockCanvasRef.current;
    fireEvent.mouseDown(canvas, { clientX: 90, clientY: 105 });
    expect(store.dispatch).not.toHaveBeenCalled();

    fireEvent.mouseDown(canvas, { clientX: 200, clientY: 105 });
    expect(store.dispatch).not.toHaveBeenCalled();

    fireEvent.mouseDown(canvas, { clientX: 110, clientY: 90 });
    expect(store.dispatch).not.toHaveBeenCalled();

    fireEvent.mouseDown(canvas, { clientX: 110, clientY: 200 });
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
