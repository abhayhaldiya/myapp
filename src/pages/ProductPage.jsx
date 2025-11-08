import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDownpayment, setSelectedDownpayment] = useState(null);
  const [selectedEMIPlan, setSelectedEMIPlan] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({
    color: null,
    storage: null,
    finish: null
  });
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products/${slug}`);
        setProduct(response.data.data);
        setError(null);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to load product. Please try again later.');
        }
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (product && product.emiPlans && product.emiPlans.length > 0) {
      // Set first EMI plan as default
      setSelectedEMIPlan(product.emiPlans[0]._id);
      // Set default downpayment to 20%
      setSelectedDownpayment(20);
      
      // Set default variants
      const defaultVariants = {};
      if (product.variants?.colors?.length > 0) {
        defaultVariants.color = product.variants.colors[0].value;
      }
      if (product.variants?.storage?.length > 0) {
        defaultVariants.storage = product.variants.storage[1]?.value || product.variants.storage[0].value;
      }
      if (product.variants?.finish?.length > 0) {
        defaultVariants.finish = product.variants.finish[0].value;
      }
      setSelectedVariants(defaultVariants);
      setCurrentImage(product.image);
    }
  }, [product]);

  // Handle variant selection
  const handleVariantChange = (type, value) => {
    setSelectedVariants(prev => ({ ...prev, [type]: value }));
    
    // Update image if color variant has an image
    if (type === 'color' && product.variants?.colors) {
      const colorVariant = product.variants.colors.find(c => c.value === value);
      if (colorVariant?.image) {
        setCurrentImage(colorVariant.image);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Calculate price based on selected variants
  const calculateVariantPrice = () => {
    let totalModifier = 0;
    
    if (selectedVariants.color && product.variants?.colors) {
      const colorVariant = product.variants.colors.find(c => c.value === selectedVariants.color);
      totalModifier += colorVariant?.priceModifier || 0;
    }
    
    if (selectedVariants.storage && product.variants?.storage) {
      const storageVariant = product.variants.storage.find(s => s.value === selectedVariants.storage);
      totalModifier += storageVariant?.priceModifier || 0;
    }
    
    if (selectedVariants.finish && product.variants?.finish) {
      const finishVariant = product.variants.finish.find(f => f.value === selectedVariants.finish);
      totalModifier += finishVariant?.priceModifier || 0;
    }
    
    return product.price + totalModifier;
  };

  const currentPrice = calculateVariantPrice();

  // Calculate downpayment options (20% and 40% of current price)
  const downpaymentOptions = [
    { percentage: 20, amount: Math.round(currentPrice * 0.2) },
    { percentage: 40, amount: Math.round(currentPrice * 0.4) }
  ];

  // Calculate remaining amount after downpayment
  const downpaymentAmount = selectedDownpayment 
    ? Math.round(currentPrice * (selectedDownpayment / 100))
    : 0;
  const remainingAmount = currentPrice - downpaymentAmount;

  // Function to calculate EMI with interest
  const calculateEMI = (principal, ratePerMonth, tenure) => {
    if (ratePerMonth === 0) {
      return Math.round(principal / tenure);
    }
    const rate = ratePerMonth / 100;
    const emi = principal * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  // Calculate dynamic EMI plans based on selected downpayment
  const dynamicEMIPlans = product.emiPlans?.map(plan => {
    const monthlyEMI = calculateEMI(remainingAmount, plan.interestRate, plan.tenureMonths);
    const totalAmount = monthlyEMI * plan.tenureMonths;
    const interestAmount = totalAmount - remainingAmount;
    
    return {
      ...plan,
      calculatedMonthlyAmount: monthlyEMI,
      calculatedTotalAmount: totalAmount,
      calculatedInterestAmount: interestAmount
    };
  });

  const selectedPlan = dynamicEMIPlans?.find(plan => plan._id === selectedEMIPlan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Shop on EMI &gt; Smart Phones &gt; Apple &gt; {product.name}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Product Image */}
          <div className="bg-white rounded-lg p-8">
            <div className="flex justify-center items-center mb-6" style={{ minHeight: '400px', maxHeight: '500px' }}>
              <img
                src={currentImage || product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 justify-center flex-wrap">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-gray-50 ${
                      currentImage === img ? 'border-teal-600' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="max-w-full max-h-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details & EMI Options */}
          <div>
            {/* Product Info Card */}
            <div className="bg-cyan-50 rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-600 mb-4">
                {product.baseVariant}
              </p>
              <div className="text-3xl font-bold text-gray-900">
                ₹{currentPrice.toLocaleString('en-IN')}
              </div>
              {currentPrice !== product.price && (
                <p className="text-sm text-gray-500 mt-1">
                  Base price: ₹{product.price.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            {/* Variant Selectors */}
            {/* Color Selection */}
            {product.variants?.colors && product.variants.colors.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Color: {product.variants.colors.find(c => c.value === selectedVariants.color)?.label}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleVariantChange('color', color.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariants.color === color.value
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-teal-300'
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selection */}
            {product.variants?.storage && product.variants.storage.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Storage: {product.variants.storage.find(s => s.value === selectedVariants.storage)?.label}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.storage.map((storage) => (
                    <button
                      key={storage.value}
                      onClick={() => handleVariantChange('storage', storage.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedVariants.storage === storage.value
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-300 bg-white hover:border-teal-300'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{storage.label}</div>
                      {storage.priceModifier !== 0 && (
                        <div className="text-xs text-gray-600 mt-1">
                          {storage.priceModifier > 0 ? '+' : ''}₹{storage.priceModifier.toLocaleString('en-IN')}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Finish Selection */}
            {product.variants?.finish && product.variants.finish.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Finish: {product.variants.finish.find(f => f.value === selectedVariants.finish)?.label}
                </h3>
                <div className="flex gap-3">
                  {product.variants.finish.map((finish) => (
                    <button
                      key={finish.value}
                      onClick={() => handleVariantChange('finish', finish.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedVariants.finish === finish.value
                          ? 'border-teal-600 bg-teal-50 text-teal-900'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-teal-300'
                      }`}
                    >
                      {finish.label}
                      {finish.priceModifier !== 0 && (
                        <span className="text-xs ml-1">
                          ({finish.priceModifier > 0 ? '+' : ''}₹{finish.priceModifier.toLocaleString('en-IN')})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Downpayment Selection */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Choose a Downpayment</h3>
              <div className="grid grid-cols-2 gap-4">
                {downpaymentOptions.map((option) => (
                  <button
                    key={option.percentage}
                    onClick={() => setSelectedDownpayment(option.percentage)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDownpayment === option.percentage
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-gray-300 bg-white text-gray-900 hover:border-teal-400'
                    }`}
                  >
                    <div className="font-bold text-lg">₹{option.amount.toLocaleString('en-IN')}</div>
                    <div className={`text-xs mt-1 ${selectedDownpayment === option.percentage ? 'text-white' : 'text-gray-500'}`}>
                      {option.percentage}% down
                    </div>
                  </button>
                ))}
              </div>
              {selectedDownpayment && (
                <div className="mt-4 p-3 bg-teal-50 rounded-lg">
                  <p className="text-sm text-teal-800">
                    💡 EMI amounts updated based on ₹{remainingAmount.toLocaleString('en-IN')} financing
                  </p>
                </div>
              )}
            </div>

            {/* EMI Tenure Selection */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Choose EMI Tenure</h3>
              <div className="space-y-3">
                {dynamicEMIPlans && dynamicEMIPlans.length > 0 ? (
                  dynamicEMIPlans.map((plan) => (
                    <label
                      key={plan._id}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedEMIPlan === plan._id
                          ? 'border-teal-600 bg-teal-50'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          name="emiPlan"
                          checked={selectedEMIPlan === plan._id}
                          onChange={() => setSelectedEMIPlan(plan._id)}
                          className="w-4 h-4 text-teal-600"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">
                              ₹{plan.calculatedMonthlyAmount.toLocaleString('en-IN')} x {plan.tenureMonths} months
                            </span>
                            {plan.interestRate === 0 && (
                              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                NO EMI
                              </span>
                            )}
                            {plan.cashback && (
                              <span className="text-xs text-gray-600 ml-2">
                                ({plan.cashback})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {plan.interestRate > 0 ? (
                              <span>
                                ({plan.interestRate}% per month) • Interest: ₹{plan.calculatedInterestAmount.toLocaleString('en-IN')}
                              </span>
                            ) : (
                              <span>(0% interest)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-600">
                    No EMI plans available
                  </div>
                )}
              </div>
              {dynamicEMIPlans && dynamicEMIPlans.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Product Price:</span>
                    <span className="font-semibold">₹{currentPrice.toLocaleString('en-IN')}</span>
                  </div>
                  {selectedDownpayment && (
                    <>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Downpayment ({selectedDownpayment}%):</span>
                        <span className="font-semibold text-teal-600">-₹{downpaymentAmount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Amount to be financed:</span>
                        <span className="font-semibold">₹{remainingAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  )}
                  {selectedPlan && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Total Amount Payable:</span>
                      <span className="font-bold text-gray-900">
                        ₹{(downpaymentAmount + selectedPlan.calculatedTotalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Buy Button */}
            <button className="w-full bg-teal-600 text-white font-semibold py-4 rounded-lg hover:bg-teal-700 transition-colors text-lg">
              Buy on {selectedPlan ? selectedPlan.tenureMonths : 3} months EMI
            </button>

            {/* Additional Info */}
            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">* real card payment per month order value</p>
              <p>Sold by: Retail Infocom</p>
              <p className="mt-4 text-blue-600 cursor-pointer hover:underline">
                + See Product Description
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
