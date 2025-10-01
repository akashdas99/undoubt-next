import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AddAnswerContainer from './addAnswerContainer';

// Testing Framework: Jest with React Testing Library
// This test suite covers the AddAnswerContainer component with comprehensive scenarios

describe('AddAnswerContainer Component', () => {
  // Setup and teardown
  let mockOnSubmit: jest.Mock;
  let mockOnCancel: jest.Mock;

  beforeEach(() => {
    mockOnSubmit = jest.fn();
    mockOnCancel = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Rendering Tests', () => {
    test('should render the component successfully', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByTestId('add-answer-container')).toBeInTheDocument();
    });

    test('should display answer input field', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByLabelText(/answer/i)).toBeInTheDocument();
    });

    test('should display submit button', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('should display cancel button', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    test('should render with initial empty state', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      const input = screen.getByLabelText(/answer/i) as HTMLInputElement;
      expect(input.value).toBe('');
    });

    test('should render with pre-filled answer when provided', () => {
      const initialAnswer = 'Initial answer text';
      render(
        <AddAnswerContainer 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
          initialAnswer={initialAnswer}
        />
      );
      const input = screen.getByLabelText(/answer/i) as HTMLInputElement;
      expect(input.value).toBe(initialAnswer);
    });
  });

  describe('User Interaction Tests', () => {
    test('should update input value when user types', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Test answer');
      
      expect(input).toHaveValue('Test answer');
    });

    test('should handle typing special characters', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, '\!@#$%^&*()');
      
      expect(input).toHaveValue('\!@#$%^&*()');
    });

    test('should handle typing multiline text', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Line 1{Enter}Line 2');
      
      expect(input).toHaveValue('Line 1\nLine 2');
    });

    test('should call onSubmit with answer when submit button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Test answer');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith('Test answer');
    });

    test('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('should clear input after successful submission', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Test answer');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });

  // Edge Cases
  describe('Edge Case Tests', () => {
    test('should not submit when answer is empty', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should not submit when answer contains only whitespace', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, '   ');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should display validation error for empty submission', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/answer cannot be empty/i)).toBeInTheDocument();
    });

    test('should handle very long answer text', async () => {
      const user = userEvent.setup();
      const longText = 'a'.repeat(10000);
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, longText);
      
      expect(input).toHaveValue(longText);
    });

    test('should trim whitespace from answer before submission', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, '  Test answer  ');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith('Test answer');
    });

    test('should handle rapid consecutive submissions', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Test answer');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    test('should handle cancel during typing', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Partial answer');
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  // Failure Conditions
  describe('Error Handling Tests', () => {
    test('should handle onSubmit callback errors gracefully', async () => {
      const user = userEvent.setup();
      const errorMock = jest.fn().mockImplementation(() => {
        throw new Error('Submit error');
      });
      
      render(<AddAnswerContainer onSubmit={errorMock} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Test answer');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/error submitting answer/i)).toBeInTheDocument();
    });

    test('should handle null or undefined callbacks', () => {
      render(<AddAnswerContainer onSubmit={null as any} onCancel={undefined as any} />);
      expect(screen.getByTestId('add-answer-container')).toBeInTheDocument();
    });

    test('should display character limit warning when approaching limit', async () => {
      const user = userEvent.setup();
      const maxLength = 5000;
      render(
        <AddAnswerContainer 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
          maxLength={maxLength}
        />
      );
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'a'.repeat(maxLength - 10));
      
      expect(screen.getByText(/characters remaining/i)).toBeInTheDocument();
    });

    test('should prevent input beyond max length', async () => {
      const user = userEvent.setup();
      const maxLength = 100;
      render(
        <AddAnswerContainer 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
          maxLength={maxLength}
        />
      );
      
      const input = screen.getByLabelText(/answer/i) as HTMLInputElement;
      await user.type(input, 'a'.repeat(maxLength + 50));
      
      expect(input.value.length).toBeLessThanOrEqual(maxLength);
    });
  });

  // Accessibility Tests
  describe('Accessibility Tests', () => {
    test('should have proper ARIA labels', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByLabelText(/answer/i)).toHaveAttribute('aria-label');
    });

    test('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      await user.tab();
      expect(screen.getByLabelText(/answer/i)).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /submit/i })).toHaveFocus();
      
      await user.tab();
      expect(screen.getByRole('button', { name: /cancel/i })).toHaveFocus();
    });

    test('should support submit via Enter key', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Test answer{Enter}');
      
      expect(mockOnSubmit).toHaveBeenCalledWith('Test answer');
    });

    test('should support cancel via Escape key', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, '{Escape}');
      
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    test('should have proper button roles', () => {
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(screen.getByRole('button', { name: /submit/i })).toHaveAttribute('type', 'submit');
      expect(screen.getByRole('button', { name: /cancel/i })).toHaveAttribute('type', 'button');
    });
  });

  // State Management Tests
  describe('State Management Tests', () => {
    test('should maintain input state across re-renders', () => {
      const { rerender } = render(
        <AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );
      
      const input = screen.getByLabelText(/answer/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Test answer' } });
      
      expect(input.value).toBe('Test answer');
      
      rerender(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      expect(input.value).toBe('Test answer');
    });

    test('should update when initialAnswer prop changes', () => {
      const { rerender } = render(
        <AddAnswerContainer 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
          initialAnswer="Initial"
        />
      );
      
      let input = screen.getByLabelText(/answer/i) as HTMLInputElement;
      expect(input.value).toBe('Initial');
      
      rerender(
        <AddAnswerContainer 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
          initialAnswer="Updated"
        />
      );
      
      input = screen.getByLabelText(/answer/i) as HTMLInputElement;
      expect(input.value).toBe('Updated');
    });

    test('should reset validation errors on input change', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(screen.getByText(/answer cannot be empty/i)).toBeInTheDocument();
      
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'A');
      
      expect(screen.queryByText(/answer cannot be empty/i)).not.toBeInTheDocument();
    });
  });

  // Integration Tests
  describe('Integration Tests', () => {
    test('should handle complete user flow from input to submission', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // User types answer
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Complete answer text');
      
      // User submits
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      // Verify submission
      expect(mockOnSubmit).toHaveBeenCalledWith('Complete answer text');
      
      // Verify input is cleared
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    test('should handle complete user flow with cancellation', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      // User types answer
      const input = screen.getByLabelText(/answer/i);
      await user.type(input, 'Answer to be cancelled');
      
      // User cancels
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      // Verify cancellation
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should handle edit and resubmit flow', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      
      // First attempt
      await user.type(input, 'First answer');
      await user.clear(input);
      
      // Second attempt
      await user.type(input, 'Second answer');
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith('Second answer');
    });
  });

  // Performance Tests
  describe('Performance Tests', () => {
    test('should not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();
      
      const TestWrapper = () => {
        renderSpy();
        return <AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />;
      };
      
      const { rerender } = render(<TestWrapper />);
      
      const initialRenderCount = renderSpy.mock.calls.length;
      
      rerender(<TestWrapper />);
      
      expect(renderSpy.mock.calls.length).toBe(initialRenderCount + 1);
    });

    test('should handle rapid typing without performance issues', async () => {
      const user = userEvent.setup();
      render(<AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
      
      const input = screen.getByLabelText(/answer/i);
      const startTime = Date.now();
      
      await user.type(input, 'a'.repeat(100));
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  // Snapshot Tests
  describe('Snapshot Tests', () => {
    test('should match snapshot with default props', () => {
      const { container } = render(
        <AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot with initial answer', () => {
      const { container } = render(
        <AddAnswerContainer 
          onSubmit={mockOnSubmit} 
          onCancel={mockOnCancel} 
          initialAnswer="Initial answer"
        />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('should match snapshot with error state', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <AddAnswerContainer onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});