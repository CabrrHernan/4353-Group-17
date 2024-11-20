import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter for testing with routing
import VolunteerMatchingForm from './VolunteerMatchingForm';

describe('VolunteerMatchingForm', () => {
  beforeEach(() => {
    // Reset fetch mocks before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementation after each test
  });

  test('renders the form elements', () => {
    render(
      <MemoryRouter>
        <VolunteerMatchingForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/volunteer name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/matched event/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/manually select event/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit match/i })).toBeInTheDocument();
  });

  test('fetches volunteers and events', async () => {
    const mockVolunteers = [{ id: 1, name: 'John Doe' }];
    const mockEvents = [{ id: 1, title: 'Event 1' }];

    // Mocking the responses for the fetch calls
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockVolunteers),
      })
    );

    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockEvents),
      })
    );

    render(
      <MemoryRouter>
        <VolunteerMatchingForm />
      </MemoryRouter>
    );

    // Ensure volunteer name appears after fetching
    expect(await screen.findByDisplayValue(mockVolunteers[0].name)).toBeInTheDocument();
  });

  test('shows error message for incomplete form submission', async () => {
    render(
      <MemoryRouter>
        <VolunteerMatchingForm />
      </MemoryRouter>
    );

    // Mock volunteer data
    const volunteer = { name: 'John Doe', id: 1 };
    const events = [{ id: 1, title: 'Event 1' }];

    // Mock volunteer and events fetching
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([volunteer]) })) // Mock volunteer
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(events) })); // Mock events

    await screen.findByDisplayValue(volunteer.name);

    fireEvent.click(screen.getByRole('button', { name: /submit match/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/please select an event/i)).toBeInTheDocument();
    });
  });

  test('submits the form successfully', async () => {
    // Mock successful match response
    const volunteer = { name: 'John Doe', id: 1 };
    const events = [{ id: 1, title: 'Event 1' }];

    // Mock volunteer and events fetching
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve([volunteer]) })) // Mock volunteer
      .mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(events) })) // Mock events
      .mockImplementationOnce(() => Promise.resolve({ // Mock successful match submission
        ok: true,
        json: () => Promise.resolve({ event: { title: 'Matched Event' } }),
      }));

    render(
      <MemoryRouter>
        <VolunteerMatchingForm />
      </MemoryRouter>
    );

    // Wait for volunteer and events to be loaded
    await screen.findByDisplayValue(volunteer.name);

    fireEvent.change(screen.getByLabelText(/manually select event/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /submit match/i }));

    // Check for success message
    expect(await screen.findByText(/volunteer matched successfully/i)).toBeInTheDocument();
  });
});
