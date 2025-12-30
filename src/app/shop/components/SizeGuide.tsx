import { Info } from 'lucide-react';
import { SizeGuide as SizeGuideType } from '@/types/products';

interface SizeGuideProps {
  sizeGuide: SizeGuideType;
  className?: string;
}

export function SizeGuide({ sizeGuide, className = '' }: SizeGuideProps) {
  if (!sizeGuide || sizeGuide.sizes.length === 0) return null;

  // Get all unique measurement types
  const measurementTypes = new Set<string>();
  sizeGuide.sizes.forEach((size) => {
    Object.keys(size).forEach((key) => {
      if (key !== 'size') {
        measurementTypes.add(key);
      }
    });
  });

  return (
    <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Size Guide</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Info className="w-4 h-4 mr-1" />
          <span>All measurements in inches</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Size</th>
              {Array.from(measurementTypes).map((type) => (
                <th key={type} className="px-4 py-2 text-left text-sm font-medium text-gray-700 capitalize">
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sizeGuide.sizes.map((size) => (
              <tr key={size.size} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{size.size}</td>
                {Array.from(measurementTypes).map((type) => (
                  <td key={`${size.size}-${type}`} className="px-4 py-3 text-sm text-gray-500">
                    {size[type as keyof typeof size] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sizeGuide.measuringGuide && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">How to measure:</h4>
          <p className="text-sm text-gray-600">{sizeGuide.measuringGuide}</p>
        </div>
      )}
    </div>
  );
}
