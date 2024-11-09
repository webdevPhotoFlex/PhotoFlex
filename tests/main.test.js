import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainPage from '../src/components/pages/main-page/main-page';
import React from 'react';

describe('MainPage component', () => {
  it('MainPage updates rotation when Rotate icon is clicked', () => {
    render(<MainPage initialImageSrc="/placeholder.jpeg" />);

    const rotateIcon = screen.getByTestId('icon-2');

    fireEvent.click(rotateIcon);

    const imageRotateCanvas = screen.getByTestId('image-rotate');
    expect(imageRotateCanvas).toBeInTheDocument();
  });

  it('renders UploadContainer when no image is uploaded', () => {
    render(<MainPage />);
    const uploadContainer = screen.getByTestId('file-input');
    expect(uploadContainer).toBeInTheDocument();
  });

  it('renders ImageRotate component when image is uploaded and activeTool is 2', () => {
    render(<MainPage initialImageSrc="test-image.jpg" />);
    const rotateIcon = screen.getByTestId('icon-2');

    fireEvent.click(rotateIcon);

    const imageRotateCanvas = screen.getByTestId('image-rotate');
    expect(imageRotateCanvas).toBeInTheDocument();
  });

  it('renders ImageCrop component when image is uploaded and activeTool is 1', () => {
    render(<MainPage initialImageSrc="test-image.jpg" />);
    const cropIcon = screen.getByTestId('icon-1');

    fireEvent.click(cropIcon);

    const imageCropCanvas = screen.getByTestId('image-crop');
    expect(imageCropCanvas).toBeInTheDocument();
  });
});
//yyyyyy
