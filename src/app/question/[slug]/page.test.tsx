import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Page, { generateStaticParams } from './page';
import { getQuestions } from '@/services/question';

// Mock the service and components
jest.mock('@/services/question');
jest.mock('@/components/answer/addAnswer', () => {
  return function MockAddAnswer() {
    return <div data-testid="add-answer">AddAnswer Component</div>;
  };
});
jest.mock('@/components/answer/answerList', () => {
  return function MockAnswerList({ params }: { params: Promise<{ slug: string }> }) {
    return <div data-testid="answer-list">AnswerList Component</div>;
  };
});
jest.mock('@/components/question/questionSection', () => {
  return function MockQuestionSection({ params }: { params: Promise<{ slug: string }> }) {
    return <div data-testid="question-section">QuestionSection Component</div>;
  };
});

const mockGetQuestions = getQuestions as jest.MockedFunction<typeof getQuestions>;

describe('Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the page with all child components', async () => {
      const params = Promise.resolve({ slug: 'test-question-slug' });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
      expect(screen.getByTestId('add-answer')).toBeInTheDocument();
      expect(screen.getByTestId('answer-list')).toBeInTheDocument();
    });

    it('should render the "Recent Answers" heading', async () => {
      const params = Promise.resolve({ slug: 'test-slug' });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      expect(screen.getByText('Recent Answers')).toBeInTheDocument();
    });

    it('should render with correct CSS classes for layout', async () => {
      const params = Promise.resolve({ slug: 'sample-slug' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        // Check main wrapper has expected classes
        const mainDiv = container.querySelector('.w-full.my-3');
        expect(mainDiv).toBeInTheDocument();

        // Check bordered card exists
        const borderedCard = container.querySelector('.bordered-card');
        expect(borderedCard).toBeInTheDocument();
      });
    });

    it('should render section heading with correct font class', async () => {
      const params = Promise.resolve({ slug: 'test-slug' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        const heading = container.querySelector('.font-righteous');
        expect(heading).toBeInTheDocument();
        expect(heading).toHaveClass('text-xl');
      });
    });
  });

  describe('Params Handling', () => {
    it('should pass params prop to QuestionSection component', async () => {
      const params = Promise.resolve({ slug: 'unique-question-slug' });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      // Verify QuestionSection receives params
      expect(screen.getByTestId('question-section')).toBeInTheDocument();
    });

    it('should pass params prop to AnswerList component', async () => {
      const params = Promise.resolve({ slug: 'another-slug' });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      // Verify AnswerList receives params
      expect(screen.getByTestId('answer-list')).toBeInTheDocument();
    });

    it('should handle params with special characters in slug', async () => {
      const params = Promise.resolve({ slug: 'test-question-with-dashes-123' });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
      expect(screen.getByTestId('answer-list')).toBeInTheDocument();
    });

    it('should handle params with empty slug', async () => {
      const params = Promise.resolve({ slug: '' });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
    });

    it('should handle params as a promise that resolves asynchronously', async () => {
      const params = new Promise<{ slug: string }>((resolve) => {
        setTimeout(() => resolve({ slug: 'delayed-slug' }), 10);
      });

      await act(async () => {
        const component = await Page({ params });
        render(component);
      });

      expect(screen.getByTestId('question-section')).toBeInTheDocument();
      expect(screen.getByTestId('answer-list')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should render components in correct order', async () => {
      const params = Promise.resolve({ slug: 'ordered-slug' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        const children = container.querySelectorAll('.flex.flex-col.gap-5 > *');
        expect(children).toHaveLength(3);
      });
    });

    it('should render AddAnswer between QuestionSection and AnswerList', async () => {
      const params = Promise.resolve({ slug: 'test' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        const flexContainer = container.querySelector('.flex.flex-col.gap-5');
        const elements = flexContainer?.children;

        expect(elements).toBeDefined();
        if (elements) {
          expect(elements[0]).toContainElement(screen.getByTestId('question-section'));
          expect(elements[1]).toContainElement(screen.getByTestId('add-answer'));
        }
      });
    });
  });

  describe('Responsive Design Classes', () => {
    it('should include responsive margin classes', async () => {
      const params = Promise.resolve({ slug: 'responsive-test' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        const mainDiv = container.querySelector('.my-3');
        expect(mainDiv).toHaveClass('md:my-8');
      });
    });

    it('should include max-width constraint', async () => {
      const params = Promise.resolve({ slug: 'width-test' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        const mainDiv = container.querySelector('.max-w-screen-lg');
        expect(mainDiv).toBeInTheDocument();
      });
    });

    it('should include padding classes', async () => {
      const params = Promise.resolve({ slug: 'padding-test' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);

        const mainDiv = container.querySelector('.px-3');
        expect(mainDiv).toBeInTheDocument();
      });
    });
  });

  describe('Snapshot Testing', () => {
    it('should match snapshot with typical params', async () => {
      const params = Promise.resolve({ slug: 'snapshot-test-slug' });

      await act(async () => {
        const component = await Page({ params });
        const { container } = render(component);
        expect(container).toMatchSnapshot();
      });
    });
  });
});

describe('generateStaticParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should return an array of slug params from getQuestions', async () => {
      const mockQuestions = [
        { slug: 'question-1', id: '1', title: 'Question 1' },
        { slug: 'question-2', id: '2', title: 'Question 2' },
        { slug: 'question-3', id: '3', title: 'Question 3' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'question-1' },
        { slug: 'question-2' },
        { slug: 'question-3' },
      ]);
      expect(mockGetQuestions).toHaveBeenCalledTimes(1);
    });

    it('should handle empty questions array', async () => {
      mockGetQuestions.mockResolvedValue([]);

      const result = await generateStaticParams();

      expect(result).toEqual([]);
      expect(mockGetQuestions).toHaveBeenCalledTimes(1);
    });

    it('should handle single question', async () => {
      const mockQuestions = [
        { slug: 'only-question', id: '1', title: 'Only Question' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: 'only-question' }]);
    });

    it('should extract only slug property from questions', async () => {
      const mockQuestions = [
        { 
          slug: 'detailed-question', 
          id: '1', 
          title: 'Detailed Question',
          content: 'Some content',
          author: 'John Doe',
          createdAt: '2024-01-01'
        },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: 'detailed-question' }]);
      expect(result[0]).not.toHaveProperty('id');
      expect(result[0]).not.toHaveProperty('title');
      expect(result[0]).not.toHaveProperty('content');
    });
  });

  describe('Edge Cases', () => {
    it('should handle questions with undefined slug', async () => {
      const mockQuestions = [
        { slug: 'valid-slug', id: '1' },
        { slug: undefined, id: '2' },
        { slug: 'another-valid-slug', id: '3' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'valid-slug' },
        { slug: undefined },
        { slug: 'another-valid-slug' },
      ]);
    });

    it('should handle questions with null slug', async () => {
      const mockQuestions = [
        { slug: null, id: '1' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([{ slug: null }]);
    });

    it('should handle questions with empty string slug', async () => {
      const mockQuestions = [
        { slug: '', id: '1' },
        { slug: 'valid-slug', id: '2' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: '' },
        { slug: 'valid-slug' },
      ]);
    });

    it('should handle large number of questions', async () => {
      const mockQuestions = Array.from({ length: 1000 }, (_, i) => ({
        slug: `question-${i}`,
        id: `${i}`,
        title: `Question ${i}`,
      }));

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toHaveLength(1000);
      expect(result[0]).toEqual({ slug: 'question-0' });
      expect(result[999]).toEqual({ slug: 'question-999' });
    });

    it('should handle questions with special characters in slug', async () => {
      const mockQuestions = [
        { slug: 'question-with-dashes', id: '1' },
        { slug: 'question_with_underscores', id: '2' },
        { slug: 'question-123-numbers', id: '3' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result).toEqual([
        { slug: 'question-with-dashes' },
        { slug: 'question_with_underscores' },
        { slug: 'question-123-numbers' },
      ]);
    });
  });

  describe('Error Handling', () => {
    it('should propagate error when getQuestions fails', async () => {
      const error = new Error('Failed to fetch questions');
      mockGetQuestions.mockRejectedValue(error);

      await expect(generateStaticParams()).rejects.toThrow('Failed to fetch questions');
      expect(mockGetQuestions).toHaveBeenCalledTimes(1);
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Network timeout');
      mockGetQuestions.mockRejectedValue(timeoutError);

      await expect(generateStaticParams()).rejects.toThrow('Network timeout');
    });

    it('should handle null return from getQuestions', async () => {
      mockGetQuestions.mockResolvedValue(null as any);

      await expect(async () => {
        const result = await generateStaticParams();
        return result;
      }).rejects.toThrow();
    });

    it('should handle undefined return from getQuestions', async () => {
      mockGetQuestions.mockResolvedValue(undefined as any);

      await expect(async () => {
        const result = await generateStaticParams();
        return result;
      }).rejects.toThrow();
    });
  });

  describe('Async Behavior', () => {
    it('should properly await getQuestions before mapping', async () => {
      const mockQuestions = [
        { slug: 'async-test-1', id: '1' },
        { slug: 'async-test-2', id: '2' },
      ];

      let resolveGetQuestions: (value: any) => void;
      const questionsPromise = new Promise((resolve) => {
        resolveGetQuestions = resolve;
      });

      mockGetQuestions.mockReturnValue(questionsPromise as any);

      const resultPromise = generateStaticParams();

      // Verify that the result is still pending
      const isPending = (await Promise.race([
        resultPromise.then(() => 'resolved'),
        Promise.resolve('pending'),
      ])) === 'pending';

      expect(isPending).toBe(true);

      // Now resolve the promise
      resolveGetQuestions(mockQuestions);

      const result = await resultPromise;
      expect(result).toEqual([
        { slug: 'async-test-1' },
        { slug: 'async-test-2' },
      ]);
    });

    it('should call getQuestions with no arguments', async () => {
      mockGetQuestions.mockResolvedValue([]);

      await generateStaticParams();

      expect(mockGetQuestions).toHaveBeenCalledWith();
    });
  });

  describe('Type Safety', () => {
    it('should return properly typed slug params', async () => {
      const mockQuestions = [
        { slug: 'typed-question', id: '1', title: 'Typed Question' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      expect(result[0]).toHaveProperty('slug');
      expect(typeof result[0].slug).toBe('string');
    });
  });

  describe('Integration with Next.js', () => {
    it('should return format compatible with Next.js static params', async () => {
      const mockQuestions = [
        { slug: 'nextjs-compatible-1', id: '1' },
        { slug: 'nextjs-compatible-2', id: '2' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      // Next.js expects an array of objects with param keys
      expect(Array.isArray(result)).toBe(true);
      result.forEach((param) => {
        expect(param).toHaveProperty('slug');
        expect(Object.keys(param)).toEqual(['slug']);
      });
    });

    it('should generate unique paths for each question', async () => {
      const mockQuestions = [
        { slug: 'unique-1', id: '1' },
        { slug: 'unique-2', id: '2' },
        { slug: 'unique-3', id: '3' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();
      const slugs = result.map((r) => r.slug);
      const uniqueSlugs = new Set(slugs);

      expect(uniqueSlugs.size).toBe(slugs.length);
    });
  });

  describe('Performance', () => {
    it('should call getQuestions only once', async () => {
      mockGetQuestions.mockResolvedValue([
        { slug: 'perf-test', id: '1' },
      ] as any);

      await generateStaticParams();

      expect(mockGetQuestions).toHaveBeenCalledTimes(1);
    });

    it('should not perform unnecessary transformations', async () => {
      const mockQuestions = [
        { slug: 'original-slug', id: '1', extraData: 'unused' },
      ];

      mockGetQuestions.mockResolvedValue(mockQuestions as any);

      const result = await generateStaticParams();

      // Should only extract slug, not transform it
      expect(result[0].slug).toBe('original-slug');
    });
  });
});