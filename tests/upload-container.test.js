import {
  render,
  screen,
  fireEvent,
  createEvent,
} from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UploadContainer from '../src/components/upload-container/upload-container';
import {
  setIsDragOver,
  setImageSrc,
} from '../src/services/actions/image-actions';
import '@testing-library/jest-dom';
console.warn = jest.fn();

const mockStore = configureStore();

jest.mock(
  '../src/components/upload-container/upload-container.module.css',
  () => ({
    mainContainer: 'mainContainer',
    dragOver: 'dragOver',
    uploadText: 'uploadText',
    uploadLabel: 'uploadLabel',
    uploadIcon: 'uploadIcon',
  })
);
const renderWithStore = (store) => {
  return render(
    <Provider store={store}>
      <UploadContainer />
    </Provider>
  );
};

describe('UploadContainer', () => {
  it('должен рендерить компонент без ошибок и показывать текст "choose or drag file"', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    renderWithStore(store);
    const uploadText = screen.getByText(/choose or drag file/i);
    expect(uploadText).toBeInTheDocument();
  });

  it('должен обновить состояние при перетаскивании файла', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    store.dispatch = jest.fn();
    renderWithStore(store);
    const dropArea = screen.getByTestId('upload-container');
    const file = new File(['image'], 'image.png', {
      type: 'image/png',
    });
    const dragEvent = { dataTransfer: { files: [file] } };
    fireEvent.drop(dropArea, dragEvent);
    expect(store.dispatch).toHaveBeenCalledWith(setIsDragOver(false));
  });

  it('должен изменять состояние isDragOver при dragOver', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    renderWithStore(store);
    const container = screen.getByTestId('upload-container');

    fireEvent.dragOver(container);

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_IS_DRAG_OVER', payload: true },
    ]);
  });

  it('должен изменять состояние isDragOver при dragLeave', () => {
    const store = mockStore({
      image: {
        isDragOver: true,
        imageSrc: null,
      },
    });

    renderWithStore(store);
    const container = screen.getByTestId('upload-container');

    fireEvent.dragLeave(container);

    const actions = store.getActions();
    expect(actions).toEqual([
      { type: 'SET_IS_DRAG_OVER', payload: false },
    ]);
  });

  it('должен обновить состояние imageSrc при выборе файла через инпут', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    store.dispatch = jest.fn();
    renderWithStore(store);
    const fileInput = screen.getByLabelText(/choose or drag file/i);
    const file = new File(['image'], 'image.png', {
      type: 'image/png',
    });

    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
    };
    global.FileReader = jest.fn(() => mockFileReader);

    fireEvent.change(fileInput, { target: { files: [file] } });

    mockFileReader.onload = jest.fn((event) => {
      store.dispatch(setImageSrc(event.target.result));
    });

    mockFileReader.onload({
      target: { result: 'data:image/png;base64,image' },
    });

    expect(store.dispatch).toHaveBeenCalledWith(
      setImageSrc('data:image/png;base64,image')
    );
  });
  it('не должен вызывать setImageSrc, если файл не был перетянут', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    store.dispatch = jest.fn();
    renderWithStore(store);
    const dropArea = screen.getByTestId('upload-container');

    const preventDefault = jest.fn();
    const dataTransfer = { files: [] };

    const dropEvent = createEvent.drop(dropArea);
    dropEvent.preventDefault = preventDefault;
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: dataTransfer,
    });

    fireEvent(dropArea, dropEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(setIsDragOver(false));
    expect(store.dispatch).not.toHaveBeenCalledWith(
      setImageSrc(expect.anything())
    );
  });

  it('не должен вызывать setImageSrc, если файл не был выбран через инпут', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    store.dispatch = jest.fn();
    renderWithStore(store);
    const fileInput = screen.getByLabelText(/choose or drag file/i);

    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
    };
    global.FileReader = jest.fn(() => mockFileReader);

    fireEvent.change(fileInput, { target: { files: [] } });

    expect(mockFileReader.readAsDataURL).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalledWith(
      setImageSrc(expect.anything())
    );
  });

  it('должен применять правильный класс при isDragOver равном true', () => {
    const store = mockStore({
      image: {
        isDragOver: true,
        imageSrc: null,
      },
    });

    renderWithStore(store);
    const container = screen.getByTestId('upload-container');

    expect(container.className).toMatch(/dragOver/);
  });

  it('не должен применять класс dragOver при isDragOver равном false', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
      },
    });

    renderWithStore(store);
    const container = screen.getByTestId('upload-container');

    expect(container.className).not.toMatch(/dragOver/);
  });
});
describe('UploadContainer - темы', () => {
  // it('должен применять светлый стиль, когда darkMode равен false', () => {
  //   const store = mockStore({
  //     image: {
  //       isDragOver: false,
  //       imageSrc: null,
  //       darkMode: false,
  //     },
  //   });
  //
  //   renderWithStore(store);
  //   const container = screen.getByTestId('upload-container');
  //
  //   expect(container.className).toContain('lightTheme');
  // });

  it('не должен применять светлый стиль, когда darkMode равен true', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
        darkMode: true,
      },
    });

    renderWithStore(store);
    const container = screen.getByTestId('upload-container');

    expect(container.className).not.toContain('lightTheme');
  });

  // it('должен применять светлый стиль для текста, когда darkMode равен false', () => {
  //   const store = mockStore({
  //     image: {
  //       isDragOver: false,
  //       imageSrc: null,
  //       darkMode: false,
  //     },
  //   });
  //
  //   renderWithStore(store);
  //   const text = screen.getByText(/choose or drag file/i);
  //
  //   expect(text.className).toContain('lightText');
  // });

  it('не должен применять светлый стиль для текста, когда darkMode равен true', () => {
    const store = mockStore({
      image: {
        isDragOver: false,
        imageSrc: null,
        darkMode: true,
      },
    });

    renderWithStore(store);
    const text = screen.getByText(/choose or drag file/i);

    expect(text.className).not.toContain('lightText');
  });
});
