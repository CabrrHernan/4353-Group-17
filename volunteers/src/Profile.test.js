import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './Profile';

describe('Profile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the profile form', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update profile/i })).toBeInTheDocument();
  });

  it('handles profile update', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Profile updated successfully' }),
      })
    );

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'updateduser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'updateduser@example.com' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'New Location' } });
    fireEvent.click(screen.getByRole('button', { name: /update profile/i }));

    await waitFor(() => expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument());
  });
});