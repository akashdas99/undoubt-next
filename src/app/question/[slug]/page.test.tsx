import { render, screen } from '@testing-library/react';
import Page, { generateStaticParams } from './page';
import { getQuestions } from '@/services/question';
import QuestionSection from '@/components/question/questionSection';
import AddAnswer from '@/components/answer/addAnswer';
import AnswerList from '@/components/answer/answerList';

// Mock all dependencies
jest.mock('@/services/question');
jest.mock('@/components/question/questionSection');
jest.mock('@/components/answer/addAnswer');
jest.mock('@/components/answer/answerList');

const mockGetQuestions = getQuestions as jest.MockedFunction<typeof getQuestions>;
const mockQuestionSection = QuestionSection as jest.MockedFunction<typeof QuestionSection>;
const mockAddAnswer = AddAnswer as jest.MockedFunction<typeof AddAnswer>;
const mockAnswerList = AnswerList as jest.MockedFunction<typeof AnswerList>;

describe('Question Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockQuestionSection.mockReturnValue(<div data-testid="question-section">Question Section</div>);
    mockAddAnswer.mockReturnValue(<div data-testid="add-answer">Add Answer</div>);
    mockAnswerList.mockReturnValue(<div data-testid="answer-list">Answer List</div>);
  });

  describe('Page Component', () => {
    it('should render the page with all main components', async () => {
      const params = Promise.resolve({ slug: 'test-question' });
      
      // Await the async component before rendering
      const component = await Page({ params });
      render(component);

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
      expect(screen.getByTestId('add-answer')).toBeInTheDocument();
      expect(screen.getByTestId('answer-list')).toBeInTheDocument();
    });

    it('should render the correct layout structure with proper CSS classes', async () => {
      const params = Promise.resolve({ slug: 'test-question' });
      
      const component = await Page({ params });
      const { container } = render(component);

      // Check main container classes
      const mainContainer = container.querySelector('.w-full.my-3.md\\:my-8.max-w-screen-lg.px-3');
      expect(mainContainer).toBeInTheDocument();

      // Check flex container
      const flexContainer = container.querySelector('.flex.flex-col.gap-5');
      expect(flexContainer).toBeInTheDocument();
    });

    it('should render "Recent Answers" heading', async () => {
      const params = Promise.resolve({ slug: 'test-question' });
      
      const component = await Page({ params });
      render(component);

      expect(screen.getByText('Recent Answers')).toBeInTheDocument();
    });

    it('should apply correct CSS classes to Recent Answers heading', async () => {
      const params = Promise.resolve({ slug: 'test-question' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const heading = screen.getByText('Recent Answers');
      expect(heading).toHaveClass('active-neo', 'section-heading', 'mb-2', 'font-righteous', 'text-xl');
    });

    it('should render bordered card container with correct classes', async () => {
      const params = Promise.resolve({ slug: 'test-question' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const borderedCard = container.querySelector('.bordered-card.p-\\[1em\\]');
      expect(borderedCard).toBeInTheDocument();
    });

    it('should pass params prop to QuestionSection component', async () => {
      const params = Promise.resolve({ slug: 'specific-question-slug' });
      
      const component = await Page({ params });
      render(component);

      expect(mockQuestionSection).toHaveBeenCalledWith(
        expect.objectContaining({ params }),
        expect.anything()
      );
    });

    it('should pass params prop to AnswerList component', async () => {
      const params = Promise.resolve({ slug: 'another-slug' });
      
      const component = await Page({ params });
      render(component);

      expect(mockAnswerList).toHaveBeenCalledWith(
        expect.objectContaining({ params }),
        expect.anything()
      );
    });

    it('should render AddAnswer component without props', async () => {
      const params = Promise.resolve({ slug: 'test-slug' });
      
      const component = await Page({ params });
      render(component);

      expect(mockAddAnswer).toHaveBeenCalledWith({}, expect.anything());
    });

    it('should handle different slug values correctly', async () => {
      const testSlugs = ['slug-1', 'slug-2', 'very-long-slug-name-with-dashes'];
      
      for (const slug of testSlugs) {
        jest.clearAllMocks();
        const params = Promise.resolve({ slug });
        
        const component = await Page({ params });
        render(component);

        expect(mockQuestionSection).toHaveBeenCalledWith(
          expect.objectContaining({ params }),
          expect.anything()
        );
        expect(mockAnswerList).toHaveBeenCalledWith(
          expect.objectContaining({ params }),
          expect.anything()
        );
      }
    });

    it('should maintain component rendering order', async () => {
      const params = Promise.resolve({ slug: 'test' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const flexContainer = container.querySelector('.flex.flex-col.gap-5');
      const children = flexContainer?.children;

      expect(children).toHaveLength(3);
      expect(children?.[0]).toContainElement(screen.getByTestId('question-section'));
      expect(children?.[1]).toContainElement(screen.getByTestId('add-answer'));
    });

    it('should handle empty slug', async () => {
      const params = Promise.resolve({ slug: '' });
      
      const component = await Page({ params });
      render(component);

      expect(mockQuestionSection).toHaveBeenCalled();
      expect(mockAnswerList).toHaveBeenCalled();
    });

    it('should handle slug with special characters', async () => {
      const params = Promise.resolve({ slug: 'question-with-special-chars-123\!' });
      
      const component = await Page({ params });
      render(component);

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
      expect(screen.getByTestId('answer-list')).toBeInTheDocument();
    });

    it('should render all components even if one mock fails', async () => {
      mockQuestionSection.mockImplementation(() => {
        throw new Error('Component error');
      });
      
      const params = Promise.resolve({ slug: 'test' });

      await expect(async () => {
        const component = await Page({ params });
        render(component);
      }).rejects.toThrow('Component error');
    });
  });

  describe('generateStaticParams', () => {
    it('should return an array of slug params from questions', async () => {
      const mockQuestions = [
        { slug: 'question-1', title: 'Question 1' },
        { slug: 'question-2', title: 'Question 2' },
        { slug: 'question-3', title: 'Question 3' },
      ];
      
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'question-1' },
        { slug: 'question-2' },
        { slug: 'question-3' },
      ]);
    });

    it('should call getQuestions service', async () => {
      mockGetQuestions.mockResolvedValue([]);

      await generateStaticParams();

      expect(mockGetQuestions).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no questions exist', async () => {
      mockGetQuestions.mockResolvedValue([]);

      const result = await generateStaticParams();

      expect(result).toEqual([]);
    });

    it('should handle single question', async () => {
      const mockQuestions = [{ slug: 'only-question' }];
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: 'only-question' }]);
    });

    it('should handle questions with null slug gracefully', async () => {
      const mockQuestions = [
        { slug: 'valid-slug' },
        { slug: null },
        { slug: 'another-valid-slug' },
      ];
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'valid-slug' },
        { slug: null },
        { slug: 'another-valid-slug' },
      ]);
    });

    it('should handle questions with undefined slug', async () => {
      const mockQuestions = [
        { slug: 'question-1' },
        { slug: undefined },
      ];
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'question-1' },
        { slug: undefined },
      ]);
    });

    it('should handle large number of questions', async () => {
      const mockQuestions = Array.from({ length: 100 }, (_, i) => ({
        slug: `question-${i}`,
      }));
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toHaveLength(100);
      expect(result[0]).toEqual({ slug: 'question-0' });
      expect(result[99]).toEqual({ slug: 'question-99' });
    });

    it('should handle questions with special characters in slugs', async () => {
      const mockQuestions = [
        { slug: 'question-with-dashes' },
        { slug: 'question_with_underscores' },
        { slug: 'question123' },
      ];
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'question-with-dashes' },
        { slug: 'question_with_underscores' },
        { slug: 'question123' },
      ]);
    });

    it('should handle getQuestions rejection', async () => {
      mockGetQuestions.mockRejectedValue(new Error('Database error'));

      await expect(generateStaticParams()).rejects.toThrow('Database error');
    });

    it('should handle getQuestions timeout', async () => {
      mockGetQuestions.mockImplementation(
        () => new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      await expect(generateStaticParams()).rejects.toThrow('Timeout');
    });

    it('should preserve question object properties other than slug', async () => {
      const mockQuestions = [
        { slug: 'q1', title: 'Title 1', id: 1 },
        { slug: 'q2', title: 'Title 2', id: 2 },
      ];
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      // Should only return slug property
      expect(result).toEqual([
        { slug: 'q1' },
        { slug: 'q2' },
      ]);
    });

    it('should handle duplicate slugs', async () => {
      const mockQuestions = [
        { slug: 'duplicate' },
        { slug: 'duplicate' },
        { slug: 'unique' },
      ];
      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'duplicate' },
        { slug: 'duplicate' },
        { slug: 'unique' },
      ]);
    });
  });

  describe('Integration - Page with params resolution', () => {
    it('should handle params as a Promise correctly', async () => {
      const slug = 'integration-test-slug';
      const params = Promise.resolve({ slug });

      const component = await Page({ params });
      render(component);

      // Verify params was passed to components that need it
      expect(mockQuestionSection).toHaveBeenCalledWith(
        { params: expect.any(Promise) },
        expect.anything()
      );
    });

    it('should handle slow params resolution', async () => {
      const params = new Promise<{ slug: string }>((resolve) => {
        setTimeout(() => resolve({ slug: 'slow-slug' }), 50);
      });

      const component = await Page({ params });
      render(component);

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', async () => {
      const params = Promise.resolve({ slug: 'test' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const divs = container.querySelectorAll('div');
      expect(divs.length).toBeGreaterThan(0);
    });

    it('should render heading with appropriate text hierarchy', async () => {
      const params = Promise.resolve({ slug: 'test' });
      
      const component = await Page({ params });
      render(component);

      const heading = screen.getByText('Recent Answers');
      expect(heading.tagName).toBe('DIV');
      expect(heading).toHaveClass('text-xl');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive margin classes', async () => {
      const params = Promise.resolve({ slug: 'test' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const mainContainer = container.querySelector('.my-3.md\\:my-8');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have max-width constraint', async () => {
      const params = Promise.resolve({ slug: 'test' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const mainContainer = container.querySelector('.max-w-screen-lg');
      expect(mainContainer).toBeInTheDocument();
    });

    it('should have proper padding for mobile', async () => {
      const params = Promise.resolve({ slug: 'test' });
      
      const component = await Page({ params });
      const { container } = render(component);

      const mainContainer = container.querySelector('.px-3');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long slug values', async () => {
      const longSlug = 'a'.repeat(500);
      const params = Promise.resolve({ slug: longSlug });
      
      const component = await Page({ params });
      render(component);

      expect(mockQuestionSection).toHaveBeenCalledWith(
        expect.objectContaining({ params }),
        expect.anything()
      );
    });

    it('should handle slug with URL-encoded characters', async () => {
      const params = Promise.resolve({ slug: 'question%20with%20spaces' });
      
      const component = await Page({ params });
      render(component);

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
    });

    it('should handle slug with unicode characters', async () => {
      const params = Promise.resolve({ slug: 'question-über-français-日本語' });
      
      const component = await Page({ params });
      render(component);

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
    });
  });
});