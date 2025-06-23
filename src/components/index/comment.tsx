import { useEffect, useState } from 'react';
import commentApi from '@/api/commentApi';
import { Comment, mapCommentResponseToComment } from '@/types/comment';

const getRandomItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CustomerTestimonialsSection = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    commentApi
      .getAll()
      .then((res) => {
        const validComments = res.data
          .filter((c) => c.comment) // Chỉ lấy comment có nội dung
          .map(mapCommentResponseToComment);

        const randomComments = getRandomItems(validComments, 4);
        setComments(randomComments);
      })
      .catch((err) => {
        console.error('Failed to fetch comments:', err);
      });
  }, []);

  return (
    <div className="py-20 bg-japanese-sumi text-black relative overflow-hidden">
      <div className="absolute inset-0 bg-bamboo-pattern bg-cover bg-center opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="japanese-title text-4xl font-bold mb-4 text-japanese-sakura">
            Cảm Nhận Khách Hàng
          </h2>
          <p className="japanese-text text-japanese-washi/80 text-lg">
            Khám phá lý do tại sao nhiều khách hàng yêu thích chúng tôi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="japanese-card bg-japanese-washi/10 backdrop-blur-sm p-6 border border-japanese-sakura/20"
            >
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <img
                    src={comment.avatar || '/fallback-avatar.jpg'}
                    alt={comment.user_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-japanese-sakura"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-black font-japanese text-lg">
                    {comment.user_name}
                  </h4>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-5 h-5 ${
                          i < comment.rating ? 'text-secondary' : 'text-japanese-stone'
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  {comment.commented_item.name
 && (
                    <p className="text-sm text-black mt-1 italic">
                      {comment.commented_item.name}
                    </p>
                  )}
                </div>
              </div>
              <p className="japanese-text text-black leading-relaxed italic">
                "{comment.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerTestimonialsSection;
