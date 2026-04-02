export type ReviewItem = {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  product?: string;
  updatedAt?: string;
  __v?: number;
  user?: UserLike;
};

type UserLike = {
  _id?: string;
  name?: string;
  email?: string;
};

type RatingBreakdownProps = {
  reviews: ReviewItem[];
};

function getRatingBreakdown(reviews: ReviewItem[]) {
  const total = reviews.length;

  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;

    return {
      star,
      count,
      percent: total ? Math.round((count / total) * 100) : 0,
    };
  });
}

export default function RatingBreakdown({ reviews }: RatingBreakdownProps) {
  const breakdown = getRatingBreakdown(reviews);

  return (
    <div className="flex-1 w-full">
      {breakdown.map((item) => (
        <div key={item.star} className="flex items-center gap-3 mb-2">
          <span className="text-sm text-gray-600 w-12">{item.star} star</span>

          <div className="flex-1 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-300"
              style={{ width: `${item.percent}%` }}
            />
          </div>

          <span className="text-sm text-gray-500 w-10">{item.percent}%</span>
        </div>
      ))}
    </div>
  );
}
