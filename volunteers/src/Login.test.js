import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

describe('Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login setAuthState={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('handles login', async () => {
    const mockSetAuthState = jest.fn();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fake-token', is_admin: false }),
      })
    );

    render(
      <MemoryRouter>
        <Login setAuthState={mockSetAuthState} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(mockSetAuthState).toHaveBeenCalledWith({ isLoggedIn: true, username: 'testuser', isAdmin: false }));
  });
});