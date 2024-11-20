import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventManagementForm from './EventManagementForm';

// Mock the fetch API
global.fetch = jest.fn();

describe('EventManagementForm', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks after each test
  });

  it('submits the form successfully', async () => {
    // Mock the successful response from the server
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Event created successfully!' }),
    });

    render(
      <MemoryRouter>
        <EventManagementForm />
      </MemoryRouter>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Event Name/), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/Event Description/), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText(/Location/), { target: { value: 'Test Location' } });
    fireEvent.change(screen.getByLabelText(/Urgency/), { target: { value: 'Medium' } });
    fireEvent.change(screen.getByLabelText(/Event Date/), { target: { value: '2024-12-31' } });
    fireEvent.change(screen.getByLabelText(/End Date/), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText(/Capacity/), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Required Skills/), { target: { value: 'Communication' } });  // Assuming it's a string input

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the success message
    await waitFor(() => expect(screen.getByText(/event created successfully/i)).toBeInTheDocument());

    // Optionally, check if the form resets (if that's the behavior)
    expect(screen.queryByLabelText(/Event Name/)).toHaveValue('');
  });

  it('displays error if required fields are missing', async () => {
    render(
      <MemoryRouter>
        <EventManagementForm />
      </MemoryRouter>
    );
    // Submit without filling out the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for and check if the error message appears
    await waitFor(() => screen.getByText(/Please fill in all required fields/));
    expect(screen.getByText(/Please fill in all required fields/)).toBeInTheDocument();
  });
});
