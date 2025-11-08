import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${product.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
    >
      <div className="h-64 bg-gray-50 flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{product.baseVariant || product.variant}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 line-through mr-2">
              ₹{product.mrp.toLocaleString('en-IN')}
            </span>
            <span className="text-2xl font-semibold text-blue-600">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-2 flex-wrap">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
            {product.emiPlans?.length || 0} EMI Plans
          </span>
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">
              {product.variants.colors.length} Colors
            </span>
          )}
          {product.variants?.storage && product.variants.storage.length > 0 && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
              {product.variants.storage.length} Storage Options
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
