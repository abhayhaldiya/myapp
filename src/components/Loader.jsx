const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      {/* Outer ring */}
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-teal-600 border-t-transparent absolute top-0 left-0"></div>
      </div>
      
      {/* Loading text with animation */}
      <div className="mt-6 flex items-center gap-2">
        <p className="text-gray-700 font-medium">{message}</p>
        <div className="flex gap-1">
          <span className="animate-bounce inline-block" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce inline-block" style={{ animationDelay: '300ms' }}>.</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
