
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/data/tripData';

interface TripReviewProps {
  tripId: string;
  onSubmitSuccess: (review: Review) => void;
}

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }),
});

const TripReview: React.FC<TripReviewProps> = ({ tripId, onSubmitSuccess }) => {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Limit to 5 images max
      const newFiles = filesArray.slice(0, 5 - selectedImages.length);
      
      if (newFiles.length + selectedImages.length > 5) {
        toast({
          title: "Maximum 5 images allowed",
          description: "You can upload up to 5 images per review",
          variant: "destructive"
        });
        return;
      }

      setSelectedImages(prev => [...prev, ...newFiles]);
      
      // Create image previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    
    // Also release the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real application, we would upload the images to cloud storage
    // Here we'll simulate it by converting images to base64 for demo purposes
    const promises = selectedImages.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(imageUrls => {
      const review: Review = {
        id: `review-${Date.now()}`,
        tripId,
        userId: 'current-user', // In a real app, get from auth context
        userName: localStorage.getItem('user') ? 
          JSON.parse(localStorage.getItem('user')!).name : 'Anonymous',
        rating: values.rating,
        comment: values.comment,
        images: imageUrls,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage for demo purposes
      const reviews = JSON.parse(localStorage.getItem('tripReviews') || '[]');
      reviews.push(review);
      localStorage.setItem('tripReviews', JSON.stringify(reviews));

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      // Clear form
      form.reset();
      setSelectedImages([]);
      setImagePreviews([]);
      setRating(0);
      
      // Notify parent component
      onSubmitSuccess(review);
    });
  };

  return (
    <div className="p-6 rounded-xl border bg-background shadow-sm">
      <h2 className="text-xl font-bold mb-4">Share Your Experience</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center mb-4">
            <p className="mr-3">Rating:</p>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setRating(star);
                    form.setValue('rating', star);
                  }}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`h-6 w-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive ml-2">Please select a rating</p>
            )}
          </div>
          
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Share details of your experience..." 
                    className="min-h-[100px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">Upload Photos (Max 5)</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-0.5"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
              
              {selectedImages.length < 5 && (
                <label className="w-20 h-20 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </label>
              )}
            </div>
          </div>

          <Button type="submit" disabled={rating === 0}>
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TripReview;
