import { Tag, Award, Star } from 'lucide-react';

interface ProductDetailsProps {
  category: string;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  details: string[];
  rating?: number;
}

export function ProductDetails({
  category,
  tags,
  isFeatured,
  isNew,
  details,
  rating,
}: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Category and Tags */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Tag className="w-4 h-4 mr-1" />
          <span className="capitalize">{category}</span>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {isNew && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Award className="w-4 h-4 mr-1" />
            New Arrival
          </span>
        )}
        {isFeatured && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Star className="w-4 h-4 mr-1" />
            Featured
          </span>
        )}
        {rating !== undefined && rating >= 4.5 && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Star className="w-4 h-4 mr-1 fill-current" />
            Top Rated
          </span>
        )}
      </div>

      {/* Product Details */}
      {details.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Product Details</h3>
          <ul className="space-y-2 text-gray-700">
            {details.map((detail, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
