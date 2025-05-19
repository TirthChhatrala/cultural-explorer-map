
import React from 'react';
import { Star } from 'lucide-react';
import { Review } from '@/data/tripData';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ReviewDisplayProps {
  reviews: Review[];
}

const ReviewDisplay: React.FC<ReviewDisplayProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[500px]">
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border rounded-lg">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.userName}`} />
                <AvatarFallback>{review.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{review.userName}</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </span>
                </div>
                
                <div className="flex items-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                
                <p className="mt-2 text-muted-foreground">{review.comment}</p>
                
                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {review.images.map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`User review photo ${index}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ReviewDisplay;
