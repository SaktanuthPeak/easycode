import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Reviews from './reviews'; // Update this path to match your file structure
import ax from '../../conf/ax';

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ courseId: '123' }),
  useNavigate: () => jest.fn()
}));

// Mock the axios instance
jest.mock('../../conf/ax');

describe('Reviews Component', () => {
  const mockReviews = [
    { id: 1, username: 'user1', stars: 5, comment: 'Excellent course!' },
    { id: 2, username: 'user2', stars: 4, comment: 'Very good content' },
    { id: 3, username: 'user3', stars: 3, comment: 'Decent overall' },
    { id: 4, username: 'user4', stars: 2, comment: 'Needs improvement' },
    { id: 5, username: 'user5', stars: 1, comment: 'Not recommended' },
  ];

  beforeEach(() => {
    // Mock API response
    ax.get.mockResolvedValue({
      data: {
        data: {
          Course_name: 'Test Course',
          reviews: mockReviews
        }
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all reviews initially', async () => {
    render(
      <MemoryRouter>
        <Reviews />
      </MemoryRouter>
    );

    // Wait for the reviews to load
    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Check if all reviews are displayed
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('Excellent course!')).toBeInTheDocument();
    expect(screen.getByText('user5')).toBeInTheDocument();
    expect(screen.getByText('Not recommended')).toBeInTheDocument();
  });

  test('filters reviews by star rating', async () => {
    render(
      <MemoryRouter>
        <Reviews />
      </MemoryRouter>
    );

    // Wait for the reviews to load
    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Initially all reviews should be visible
    expect(screen.getAllByText(/user\d/).length).toBe(5);

    // Select 5 stars filter
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '5' } });

    // Only 5 star reviews should be visible now
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('Excellent course!')).toBeInTheDocument();
    expect(screen.queryByText('user2')).not.toBeInTheDocument();
    expect(screen.queryByText('user3')).not.toBeInTheDocument();
    expect(screen.queryByText('user4')).not.toBeInTheDocument();
    expect(screen.queryByText('user5')).not.toBeInTheDocument();

    // Change to 3 stars filter
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });

    // Only 3 star reviews should be visible now
    expect(screen.queryByText('user1')).not.toBeInTheDocument();
    expect(screen.queryByText('user2')).not.toBeInTheDocument();
    expect(screen.getByText('user3')).toBeInTheDocument();
    expect(screen.getByText('Decent overall')).toBeInTheDocument();
    expect(screen.queryByText('user4')).not.toBeInTheDocument();
    expect(screen.queryByText('user5')).not.toBeInTheDocument();

    // Reset filter to show all reviews
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });

    // All reviews should be visible again
    expect(screen.getAllByText(/user\d/).length).toBe(5);
  });

  test('combines star filter with search term', async () => {
    render(
      <MemoryRouter>
        <Reviews />
      </MemoryRouter>
    );

    // Wait for the reviews to load
    await waitFor(() => {
      expect(screen.getByText('Test Course')).toBeInTheDocument();
    });

    // Search for users with "user" in their name
    fireEvent.change(screen.getByPlaceholderText('Search users...'), { 
      target: { value: 'user1' } 
    });

    // Only user1 should be visible
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.queryByText('user2')).not.toBeInTheDocument();

    // Now add star filter for 5 stars
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '5' } });

    // user1 should still be visible because they have 5 stars
    expect(screen.getByText('user1')).toBeInTheDocument();
    
    // Change search term to user2
    fireEvent.change(screen.getByPlaceholderText('Search users...'), { 
      target: { value: 'user2' } 
    });

    // No results should be visible because user2 has 4 stars, not 5
    expect(screen.getByText('No reviews match your criteria.')).toBeInTheDocument();
    
    // Change star filter to 4 stars
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '4' } });
    
    // Now user2 should be visible
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('Very good content')).toBeInTheDocument();
  });
});