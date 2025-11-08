const EMIPlanCard = ({ plan }) => {
  return (
    <div className="emi-card">
      <div className="mb-4">
        <div className="text-3xl font-bold mb-1">
          ₹{plan.monthlyAmount.toLocaleString('en-IN')}/mo
        </div>
        <p className="text-sm opacity-90">for {plan.tenureMonths} months</p>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm opacity-90">Interest Rate:</span>
          <span className="font-semibold">{plan.interestRate}%</span>
        </div>
        
        {plan.cashback && (
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">Cashback:</span>
            <span className="font-semibold bg-green-400 text-green-900 px-2 py-1 rounded text-xs">
              {plan.cashback}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-white/20">
          <span className="text-sm opacity-90">Total Amount:</span>
          <span className="font-semibold">
            ₹{(plan.monthlyAmount * plan.tenureMonths).toLocaleString('en-IN')}
          </span>
        </div>
      </div>
      
      <button className="w-full bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
        Proceed with Selected Plan
      </button>
    </div>
  );
};

export default EMIPlanCard;
