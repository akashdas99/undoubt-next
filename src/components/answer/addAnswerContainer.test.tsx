import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddAnswerContainer from './addAnswerContainer';

// Mock dependencies that may be used
jest.mock('../../hooks/useAnswer', () => ({
  useAnswer: jest.fn(),
}));

jest.mock('../../services/answerService', () => ({
  submitAnswer: jest.fn(),
}));

describe('AddAnswerContainer', () => {
  // Setup and teardown
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the component without crashing', () => {
      render(<AddAnswerContainer />);
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('should render all required form fields', () => {
      render(<AddAnswerContainer />);
      expect(screen.getByLabelText(/answer/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render with correct initial state', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i);
      expect(textarea).toHaveValue('');
    });

    it('should display placeholder text in answer field', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByPlaceholderText(/enter your answer/i);
      expect(textarea).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should update answer text when user types', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      fireEvent.change(textarea, { target: { value: 'This is my answer' } });
      
      expect(textarea.value).toBe('This is my answer');
    });

    it('should handle multiple character inputs correctly', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      fireEvent.change(textarea, { target: { value: 'A' } });
      fireEvent.change(textarea, { target: { value: 'AB' } });
      fireEvent.change(textarea, { target: { value: 'ABC' } });
      
      expect(textarea.value).toBe('ABC');
    });

    it('should handle special characters in answer', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      const specialText = 'Special chars: @#$%^&*()_+-=[]{}|;:,.<>?/~`';
      fireEvent.change(textarea, { target: { value: specialText } });
      
      expect(textarea.value).toBe(specialText);
    });

    it('should handle unicode characters in answer', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      const unicodeText = 'Unicode: 你好 🎉 émojis';
      fireEvent.change(textarea, { target: { value: unicodeText } });
      
      expect(textarea.value).toBe(unicodeText);
    });

    it('should enable submit button when answer is provided', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Valid answer' } });
      
      expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button when answer is empty', () => {
      render(<AddAnswerContainer />);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should call submit handler when form is submitted', async () => {
      const mockSubmit = jest.fn();
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('Test answer');
      });
    });

    it('should prevent submission with empty answer', () => {
      const mockSubmit = jest.fn();
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);
      
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should trim whitespace from answer before submission', async () => {
      const mockSubmit = jest.fn();
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: '  Test answer  ' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('Test answer');
      });
    });

    it('should clear form after successful submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue({ success: true });
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(textarea.value).toBe('');
      });
    });

    it('should show loading state during submission', async () => {
      const mockSubmit = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 100))
      );
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/submitting/i)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText(/submitting/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('should show error for answer exceeding maximum length', () => {
      render(<AddAnswerContainer maxLength={100} />);
      const textarea = screen.getByLabelText(/answer/i);
      
      const longText = 'a'.repeat(101);
      fireEvent.change(textarea, { target: { value: longText } });
      
      expect(screen.getByText(/answer is too long/i)).toBeInTheDocument();
    });

    it('should show error for answer below minimum length', () => {
      render(<AddAnswerContainer minLength={10} />);
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'short' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/answer is too short/i)).toBeInTheDocument();
    });

    it('should show character count when typing', () => {
      render(<AddAnswerContainer maxLength={100} />);
      const textarea = screen.getByLabelText(/answer/i);
      
      fireEvent.change(textarea, { target: { value: 'Test' } });
      
      expect(screen.getByText(/4 \/ 100/)).toBeInTheDocument();
    });

    it('should not allow submission when validation fails', () => {
      const mockSubmit = jest.fn();
      render(<AddAnswerContainer onSubmit={mockSubmit} minLength={10} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'short' } });
      fireEvent.click(submitButton);
      
      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on submission failure', async () => {
      const mockSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit answer/i)).toBeInTheDocument();
      });
    });

    it('should allow retry after submission failure', async () => {
      const mockSubmit = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ success: true });
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit answer/i)).toBeInTheDocument();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/failed to submit answer/i)).not.toBeInTheDocument();
      });
    });

    it('should handle network timeout gracefully', async () => {
      const mockSubmit = jest.fn().mockImplementation(() => 
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      );
      render(<AddAnswerContainer onSubmit={mockSubmit} timeout={1000} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/request timed out/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Props and Configuration', () => {
    it('should accept and use custom placeholder text', () => {
      render(<AddAnswerContainer placeholder="Custom placeholder" />);
      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<AddAnswerContainer className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should call onCancel when cancel button is clicked', () => {
      const mockCancel = jest.fn();
      render(<AddAnswerContainer onCancel={mockCancel} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      
      expect(mockCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable all inputs when disabled prop is true', () => {
      render(<AddAnswerContainer disabled />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      expect(textarea).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });

    it('should render with custom submit button text', () => {
      render(<AddAnswerContainer submitButtonText="Post Answer" />);
      expect(screen.getByRole('button', { name: /post answer/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<AddAnswerContainer />);
      
      const textarea = screen.getByLabelText(/answer/i);
      expect(textarea).toHaveAttribute('aria-label');
    });

    it('should associate error messages with input field', async () => {
      render(<AddAnswerContainer minLength={10} />);
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'short' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const errorMessage = screen.getByText(/answer is too short/i);
        expect(textarea).toHaveAttribute('aria-describedby', errorMessage.id);
      });
    });

    it('should be keyboard navigable', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      textarea.focus();
      expect(document.activeElement).toBe(textarea);
      
      fireEvent.keyDown(textarea, { key: 'Tab' });
      expect(document.activeElement).toBe(submitButton);
    });

    it('should support form submission via Enter key', async () => {
      const mockSubmit = jest.fn();
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith('Test answer');
      });
    });

    it('should announce submission status to screen readers', async () => {
      const mockSubmit = jest.fn().mockResolvedValue({ success: true });
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/answer submitted successfully/i);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid successive submissions', async () => {
      const mockSubmit = jest.fn().mockResolvedValue({ success: true });
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle null or undefined props gracefully', () => {
      expect(() => {
        render(<AddAnswerContainer onSubmit={undefined} placeholder={null} />);
      }).not.toThrow();
    });

    it('should handle very long answers', () => {
      render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      const veryLongText = 'a'.repeat(10000);
      fireEvent.change(textarea, { target: { value: veryLongText } });
      
      expect(textarea.value).toBe(veryLongText);
    });

    it('should handle empty string submission attempt', () => {
      const mockSubmit = jest.fn();
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: '   ' } });
      fireEvent.click(submitButton);
      
      expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('should preserve answer text when component receives new props', () => {
      const { rerender } = render(<AddAnswerContainer questionId={1} />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      fireEvent.change(textarea, { target: { value: 'My answer' } });
      expect(textarea.value).toBe('My answer');
      
      rerender(<AddAnswerContainer questionId={1} />);
      expect(textarea.value).toBe('My answer');
    });

    it('should clear answer when questionId changes', () => {
      const { rerender } = render(<AddAnswerContainer questionId={1} />);
      const textarea = screen.getByLabelText(/answer/i) as HTMLTextAreaElement;
      
      fireEvent.change(textarea, { target: { value: 'My answer' } });
      expect(textarea.value).toBe('My answer');
      
      rerender(<AddAnswerContainer questionId={2} />);
      expect(textarea.value).toBe('');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full user flow from typing to submission', async () => {
      const mockSubmit = jest.fn().mockResolvedValue({ success: true });
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // User types answer
      fireEvent.change(textarea, { target: { value: 'Complete answer' } });
      expect(screen.getByDisplayValue('Complete answer')).toBeInTheDocument();
      
      // User submits
      fireEvent.click(submitButton);
      
      // Loading state appears
      await waitFor(() => {
        expect(screen.getByText(/submitting/i)).toBeInTheDocument();
      });
      
      // Success message appears
      await waitFor(() => {
        expect(screen.getByText(/answer submitted successfully/i)).toBeInTheDocument();
      });
      
      // Form clears
      expect(textarea).toHaveValue('');
    });

    it('should handle complete error recovery flow', async () => {
      const mockSubmit = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ success: true });
      render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // First submission fails
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit answer/i)).toBeInTheDocument();
      });
      
      // User retries
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/answer submitted successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for default state', () => {
      const { container } = render(<AddAnswerContainer />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with answer text', () => {
      const { container } = render(<AddAnswerContainer />);
      const textarea = screen.getByLabelText(/answer/i);
      
      fireEvent.change(textarea, { target: { value: 'Test answer' } });
      
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot in error state', async () => {
      const mockSubmit = jest.fn().mockRejectedValue(new Error('Test error'));
      const { container } = render(<AddAnswerContainer onSubmit={mockSubmit} />);
      
      const textarea = screen.getByLabelText(/answer/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(textarea, { target: { value: 'Test' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit answer/i)).toBeInTheDocument();
      });
      
      expect(container).toMatchSnapshot();
    });
  });
});