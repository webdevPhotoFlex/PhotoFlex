import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import PersonalAccount from '../src/components/pages/personal-account/personal-account';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../../../images/logo.png', () => 'mock-logo');
jest.mock('../../../images/1.jpeg', () => 'mock-photo-1');
jest.mock('../../../images/2.jpeg', () => 'mock-photo-2');
jest.mock('../../../images/21.jpeg', () => 'mock-photo-21');
jest.mock('@mui/icons-material/Edit', () => {
  const EditIcon = () => <div>EditIcon</div>;
  EditIcon.displayName = 'EditIcon';
  return EditIcon;
});

jest.mock('@mui/icons-material/ArrowBackIos', () => {
  const ArrowBackIosIcon = () => <div>ArrowBackIosIcon</div>;
  ArrowBackIosIcon.displayName = 'ArrowBackIosIcon';
  return ArrowBackIosIcon;
});

jest.mock('@mui/icons-material/ArrowForwardIos', () => {
  const ArrowForwardIosIcon = () => <div>ArrowForwardIosIcon</div>;
  ArrowForwardIosIcon.displayName = 'ArrowForwardIosIcon';
  return ArrowForwardIosIcon;
});

const mockStore = configureStore([]);
const store = mockStore({
  // Здесь можно указать начальное состояние store
});

describe('PersonalAccount', () => {
  const renderWithProvider = (ui) =>
    render(
      <Provider store={store}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>
    );

  test('renders PersonalAccount component', () => {
    renderWithProvider(<PersonalAccount />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('telegram')
    ).toBeInTheDocument();
  });

  it('displays an error when invalid phone or email is entered', async () => {
    renderWithProvider(<PersonalAccount />);

    const phoneInput = screen.getByPlaceholderText('phone');
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    expect(
      await screen.findByText('Неверный формат номера')
    ).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('email');
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' },
    });
    expect(
      await screen.findByText('Неверный формат email')
    ).toBeInTheDocument();
  });

  it('displays no error for valid phone or email input', async () => {
    renderWithProvider(<PersonalAccount />);

    const phoneInput = screen.getByPlaceholderText('phone');
    fireEvent.change(phoneInput, {
      target: { value: '+7 999 999 99 99' },
    });
    expect(screen.queryByText('Неверный формат номера')).toBeNull();

    const emailInput = screen.getByPlaceholderText('email');
    fireEvent.change(emailInput, {
      target: { value: 'username52@gmal.com' },
    });
    expect(screen.queryByText('Неверный формат email')).toBeNull();
  });

  it('navigates through photos when clicking next and previous buttons', () => {
    renderWithProvider(<PersonalAccount />);

    const photos = screen.getAllByRole('img');
    expect(photos.length).toBe(1);

    fireEvent.click(screen.getByText('ArrowForwardIosIcon'));

    const newPhotos = screen.getAllByRole('img');
    expect(newPhotos.length).toBe(1);
  });

  it('cycles to the last photo after reaching the first one', () => {
    renderWithProvider(<PersonalAccount />);

    const nextButton = screen.getByText('ArrowForwardIosIcon');
    for (let i = 0; i < 20; i++) {
      fireEvent.click(nextButton);
    }
    const firstPhoto = screen.getAllByRole('img')[0];
    expect(firstPhoto.src).toContain('mock-photo-21');
  });

  it('does not allow toggling edit mode if there are validation errors', async () => {
    renderWithProvider(<PersonalAccount />);

    const phoneInput = screen.getByPlaceholderText('phone');
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    const editButton = screen.getByText('EditIcon');
    fireEvent.click(editButton);

    expect(screen.queryByPlaceholderText('name')).toBeNull();
  });

  it('formats phone correctly and updates userData', () => {
    renderWithProvider(<PersonalAccount />);

    const phoneInput = screen.getByPlaceholderText('phone');
    fireEvent.change(phoneInput, {
      target: { value: '+7 999 123 45 67' },
    });

    expect(phoneInput.value).toBe('+7 999 123 45 67');
  });

  it('cycles through photos after reaching the end', () => {
    renderWithProvider(<PersonalAccount />);

    const forwardIcon = screen.getByText('ArrowForwardIosIcon');
    for (let i = 0; i < 21; i++) {
      fireEvent.click(forwardIcon);
    }
    const firstPhoto = screen.getByTestId('photo-0');
    expect(firstPhoto.style.backgroundImage).toContain(
      'mock-photo-21'
    );
  });

  it('shows error when entering invalid email', async () => {
    renderWithProvider(<PersonalAccount />);

    const emailInput = screen.getByPlaceholderText('email');
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' },
    });

    expect(
      await screen.findByText('Неверный формат email')
    ).toBeInTheDocument();
  });

  it('does not show error for valid phone or email', () => {
    renderWithProvider(<PersonalAccount />);

    const phoneInput = screen.getByPlaceholderText('phone');
    fireEvent.change(phoneInput, {
      target: { value: '+7 999 999 99 99' },
    });
    expect(screen.queryByText('Неверный формат номера')).toBeNull();

    const emailInput = screen.getByPlaceholderText('email');
    fireEvent.change(emailInput, {
      target: { value: 'test@example.com' },
    });
    expect(screen.queryByText('Неверный формат email')).toBeNull();
  });
});
