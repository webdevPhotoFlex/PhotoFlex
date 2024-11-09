import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToolBar from '../src/components/tool-bar/tool-bar';
import React from 'react';

describe('ToolBar component', () => {
  it('should render all icons', () => {
    const { getByTestId } = render(<ToolBar onRotate={jest.fn()} />);

    for (let i = 0; i < 8; i++) {
      expect(getByTestId(`icon-${i}`)).toBeInTheDocument();
    }
  });
});
