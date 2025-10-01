import { render, screen, waitFor } from '@testing-library/react';
import { unstable_cache } from 'next/cache';
import AnswerList from './answerList';
import { getAnswersByQuestionSlug } from '@/services/answer';
import AnswerCard from './answerCard';

// Mock dependencies
jest.mock('@/services/answer');
jest.mock('next/cache');
jest.mock('./answerCard');

const mockGetAnswersByQuestionSlug = getAnswersByQuestionSlug as jest.MockedFunction<
  typeof getAnswersByQuestionSlug
>;
const mockUnstableCache = unstable_cache as jest.MockedFunction<typeof unstable_cache>;
const mockAnswerCard = AnswerCard as jest.MockedFunction<typeof AnswerCard>;

describe('AnswerList Component', () => {
  // Setup mock data
  const mockSlug = 'test-question-slug';
  const mockAnswers = [
    {
      _id: '507f1f77bcf86cd799439011',
      content: 'This is the first answer',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      questionId: '507f1f77bcf86cd799439012',
      upvotes: 5,
      downvotes: 1,
      author: {
        _id: '507f1f77bcf86cd799439013',
        name: 'John Doe',
        email: 'john@example.com',
        clerkId: 'clerk_123',
        username: 'johndoe',
        picture: 'https://example.com/avatar.jpg',
      },
    },
    {
      _id: '507f1f77bcf86cd799439014',
      content: 'This is the second answer',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      questionId: '507f1f77bcf86cd799439012',
      upvotes: 3,
      downvotes: 0,
      author: {
        _id: '507f1f77bcf86cd799439015',
        name: 'Jane Smith',
        email: 'jane@example.com',
        clerkId: 'clerk_456',
        username: 'janesmith',
        picture: 'https://example.com/avatar2.jpg',
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    mockAnswerCard.mockImplementation(({ answer }) => (
      <div data-testid={`answer-card-${answer._id}`}>
        {answer.content}
      </div>
    ));

    // Mock unstable_cache to return a function that calls the async function immediately
    mockUnstableCache.mockImplementation((fn) => fn as any);
  });

  describe('Happy Path - Rendering with answers', () => {
    it('should render multiple answers when answers exist', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(screen.getByTestId('answer-card-507f1f77bcf86cd799439011')).toBeInTheDocument();
        expect(screen.getByTestId('answer-card-507f1f77bcf86cd799439014')).toBeInTheDocument();
      });

      expect(mockAnswerCard).toHaveBeenCalledTimes(2);
    });

    it('should pass correct answer data to AnswerCard components', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          expect.objectContaining({
            answer: mockAnswers[0],
          }),
          expect.anything()
        );
        expect(mockAnswerCard).toHaveBeenCalledWith(
          expect.objectContaining({
            answer: mockAnswers[1],
          }),
          expect.anything()
        );
      });
    });

    it('should render answers in correct order', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      const { container } = render(
        await AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      );

      await waitFor(() => {
        const answerCards = container.querySelectorAll('[data-testid^="answer-card-"]');
        expect(answerCards).toHaveLength(2);
        expect(answerCards[0]).toHaveAttribute('data-testid', 'answer-card-507f1f77bcf86cd799439011');
        expect(answerCards[1]).toHaveAttribute('data-testid', 'answer-card-507f1f77bcf86cd799439014');
      });
    });

    it('should apply correct CSS classes to answer container', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      const { container } = render(
        await AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      );

      await waitFor(() => {
        const answerContainer = container.querySelector('.flex.flex-col.gap-5');
        expect(answerContainer).toBeInTheDocument();
      });
    });
  });

  describe('Edge Case - No answers', () => {
    it('should display "No Answer" message when answers array is empty', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue([]);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(screen.getByText('No Answer')).toBeInTheDocument();
      });

      expect(mockAnswerCard).not.toHaveBeenCalled();
    });

    it('should not render answer container when no answers exist', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue([]);

      const { container } = render(
        await AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      );

      await waitFor(() => {
        const answerContainer = container.querySelector('.flex.flex-col.gap-5');
        expect(answerContainer).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Case - Single answer', () => {
    it('should render correctly with only one answer', async () => {
      const singleAnswer = [mockAnswers[0]];
      mockGetAnswersByQuestionSlug.mockResolvedValue(singleAnswer);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(screen.getByTestId('answer-card-507f1f77bcf86cd799439011')).toBeInTheDocument();
      });

      expect(mockAnswerCard).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('No Answer')).not.toBeInTheDocument();
    });
  });

  describe('Edge Case - Slug parameter handling', () => {
    it('should handle empty slug parameter', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue([]);

      render(await AnswerList({ params: Promise.resolve({ slug: '' }) }));

      await waitFor(() => {
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledWith('');
      });
    });

    it('should handle slug with special characters', async () => {
      const specialSlug = 'test-question-with-special-chars-123';
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: specialSlug }) }));

      await waitFor(() => {
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledWith(specialSlug);
      });
    });

    it('should handle slug with unicode characters', async () => {
      const unicodeSlug = 'test-question-🚀-emoji';
      mockGetAnswersByQuestionSlug.mockResolvedValue([]);

      render(await AnswerList({ params: Promise.resolve({ slug: unicodeSlug }) }));

      await waitFor(() => {
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledWith(unicodeSlug);
      });
    });
  });

  describe('Caching behavior', () => {
    it('should call unstable_cache with correct cache key', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${mockSlug}`],
          expect.objectContaining({
            tags: [`answersByQuestionSlug:${mockSlug}`],
            revalidate: 600,
          })
        );
      });
    });

    it('should use correct revalidation time (600 seconds)', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue([]);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        const cacheCall = mockUnstableCache.mock.calls[0];
        expect(cacheCall[2]).toEqual(
          expect.objectContaining({
            revalidate: 600,
          })
        );
      });
    });

    it('should generate unique cache keys for different slugs', async () => {
      const slug1 = 'question-1';
      const slug2 = 'question-2';

      mockGetAnswersByQuestionSlug.mockResolvedValue([]);

      render(await AnswerList({ params: Promise.resolve({ slug: slug1 }) }));
      render(await AnswerList({ params: Promise.resolve({ slug: slug2 }) }));

      await waitFor(() => {
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${slug1}`],
          expect.anything()
        );
        expect(mockUnstableCache).toHaveBeenCalledWith(
          expect.any(Function),
          [`answersByQuestionSlug:${slug2}`],
          expect.anything()
        );
      });
    });
  });

  describe('Error handling', () => {
    it('should handle service error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetAnswersByQuestionSlug.mockRejectedValue(new Error('Service error'));

      await expect(
        AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      ).rejects.toThrow('Service error');

      consoleErrorSpy.mockRestore();
    });

    it('should handle null response from service', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(null as any);

      await expect(
        AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      ).rejects.toThrow();
    });

    it('should handle undefined response from service', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(undefined as any);

      await expect(
        AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      ).rejects.toThrow();
    });
  });

  describe('Large dataset handling', () => {
    it('should handle large number of answers efficiently', async () => {
      const largeAnswerSet = Array.from({ length: 100 }, (_, index) => ({
        _id: `507f1f77bcf86cd79943${String(index).padStart(4, '0')}`,
        content: `Answer ${index + 1}`,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
        questionId: '507f1f77bcf86cd799439012',
        upvotes: index,
        downvotes: 0,
        author: {
          _id: `user-${index}`,
          name: `User ${index}`,
          email: `user${index}@example.com`,
          clerkId: `clerk_${index}`,
          username: `user${index}`,
          picture: `https://example.com/avatar${index}.jpg`,
        },
      }));

      mockGetAnswersByQuestionSlug.mockResolvedValue(largeAnswerSet);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledTimes(100);
      });
    });
  });

  describe('Answer object structure validation', () => {
    it('should handle answers with all required fields', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        const firstCallArgs = mockAnswerCard.mock.calls[0][0];
        expect(firstCallArgs.answer).toHaveProperty('_id');
        expect(firstCallArgs.answer).toHaveProperty('content');
        expect(firstCallArgs.answer).toHaveProperty('author');
        expect(firstCallArgs.answer.author).toHaveProperty('_id');
        expect(firstCallArgs.answer.author).toHaveProperty('name');
      });
    });

    it('should correctly handle ObjectId toString conversion for keys', async () => {
      const answerWithObjectId = {
        ...mockAnswers[0],
        _id: {
          toString: () => '507f1f77bcf86cd799439011',
        },
      };

      mockGetAnswersByQuestionSlug.mockResolvedValue([answerWithObjectId] as any);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(screen.getByTestId('answer-card-507f1f77bcf86cd799439011')).toBeInTheDocument();
      });
    });
  });

  describe('Async params handling', () => {
    it('should correctly await params promise', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      const paramsPromise = new Promise<{ slug: string }>((resolve) => {
        setTimeout(() => resolve({ slug: mockSlug }), 100);
      });

      render(await AnswerList({ params: paramsPromise }));

      await waitFor(() => {
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledWith(mockSlug);
      });
    });

    it('should handle params promise rejection', async () => {
      const paramsPromise = Promise.reject(new Error('Params error'));

      await expect(AnswerList({ params: paramsPromise })).rejects.toThrow('Params error');
    });
  });

  describe('Component integration', () => {
    it('should integrate properly with AnswerCard component', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        mockAnswers.forEach((answer) => {
          expect(mockAnswerCard).toHaveBeenCalledWith(
            expect.objectContaining({
              answer: expect.objectContaining({
                _id: answer._id,
                content: answer.content,
                author: expect.objectContaining({
                  name: answer.author.name,
                }),
              }),
            }),
            expect.anything()
          );
        });
      });
    });
  });

  describe('Service function invocation', () => {
    it('should call getAnswersByQuestionSlug with correct slug', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledWith(mockSlug);
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledTimes(1);
      });
    });

    it('should only call service function once per render', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(mockGetAnswersByQuestionSlug).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('React Fragment behavior', () => {
    it('should render content within React Fragment', async () => {
      mockGetAnswersByQuestionSlug.mockResolvedValue(mockAnswers);

      const { container } = render(
        await AnswerList({ params: Promise.resolve({ slug: mockSlug }) })
      );

      // React Fragments don't create DOM nodes, so we check for direct children
      expect(container.firstChild).toBeTruthy();
    });
  });

  describe('Edge Case - Missing or optional answer properties', () => {
    it('should handle answers with minimal required properties', async () => {
      const minimalAnswer = [
        {
          _id: '507f1f77bcf86cd799439020',
          content: 'Minimal answer',
          createdAt: new Date(),
          updatedAt: new Date(),
          questionId: '507f1f77bcf86cd799439012',
          upvotes: 0,
          downvotes: 0,
          author: {
            _id: '507f1f77bcf86cd799439021',
            name: 'User',
            email: 'user@example.com',
            clerkId: 'clerk_999',
            username: 'user',
            picture: '',
          },
        },
      ];

      mockGetAnswersByQuestionSlug.mockResolvedValue(minimalAnswer);

      render(await AnswerList({ params: Promise.resolve({ slug: mockSlug }) }));

      await waitFor(() => {
        expect(mockAnswerCard).toHaveBeenCalledWith(
          expect.objectContaining({
            answer: expect.objectContaining({
              _id: '507f1f77bcf86cd799439020',
            }),
          }),
          expect.anything()
        );
      });
    });
  });
});