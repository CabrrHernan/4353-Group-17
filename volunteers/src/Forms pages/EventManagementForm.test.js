// EventManagementForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EventManagementForm from './EventManagementForm';

describe('EventManagementForm', () => {
  beforeEach(() => {
    // Reset fetch mocks before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders the form elements', () => {
    render(
      <MemoryRouter>
        <EventManagementForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows error message for incomplete form submission', async () => {
    render(
      <MemoryRouter>
        <EventManagementForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i })); // simulate form submission

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    });
  });

  test('submits the form successfully', async () => {
    const mockResponse = { ok: true, json: () => Promise.resolve({ message: 'Event created successfully' }) };
    global.fetch.mockImplementationOnce(() => Promise.resolve(mockResponse));
  
    render(
      <MemoryRouter>
        <EventManagementForm />
      </MemoryRouter>
    );
  
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/event name/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/event description/i), { target: { value: 'Description' } });
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Test Location' } });
  
    // Selecting required skills individually
    const requiredSkills = screen.getByLabelText(/required skills/i);
    
    // Select "Communication"
    fireEvent.change(requiredSkills, {
      target: {
        value: 'Communication',
      },
    });
  
    // Select "Leadership"
    fireEvent.change(requiredSkills, {
      target: {
        value: 'Leadership',
      },
    });
  
    fireEvent.change(screen.getByLabelText(/urgency/i), { target: { value: 'Medium' } });
    fireEvent.change(screen.getByLabelText(/event date/i), { target: { value: '2024-12-01' } }); // Fill Event Date
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
    // Check for success message
    expect(await screen.findByText(/event created successfully/i)).toBeInTheDocument();
  });
  
});
