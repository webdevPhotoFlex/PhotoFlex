import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Filters from '../src/components/tools/filter-tool/filters-tools';
import React from 'react';

describe('Filters component', () => {
  test('renders all filters with correct labels', () => {
    render(<Filters />);
    const filterNames = [
      'nebula',
      'outerspace',
      'refulgence',
      'grayscale',
    ];
    filterNames.forEach((name) => {
      const filterLabels = screen.getAllByText(name);
      expect(filterLabels.length).toBeGreaterThan(0);
      filterLabels.forEach((label) => {
        expect(label).toBeInTheDocument();
      });
    });
  });
});
