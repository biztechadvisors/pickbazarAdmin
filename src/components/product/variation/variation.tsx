import { useState, useMemo } from 'react';
import { isVariationSelected } from './is-variation-selected';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { AttributesProvider, useAttributes } from './attributes.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useProductQuery } from '@/data/product';
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';
import Button from '@/components/ui/button';

interface Props {
  product: any;
  id: any;
  email: any;
  contact: any;
}

const Variation = ({ product, id, email, contact }: Props) => {
  const { attributes } = useAttributes();
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const options = product?.variation_options || [];

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.title && option.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchTerm('');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 p-8 bg-white rounded-lg shadow-sm">
          {/* Left side - Product Image */}
          <div className="w-full md:w-1/2">
            <img 
              src={product?.image?.thumbnail || 'https://via.placeholder.com/600'} 
              alt={product?.name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>

          {/* Right side - Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
            
            <div className="mb-6">
              <VariationPrice
                selectedVariation={selectedOption}
                minPrice={product.min_price}
                maxPrice={product.max_price}
              />
            </div>

            <div className="mb-6">
              <p className="text-gray-700">{product?.description}</p>
            </div>

            {!selectedOption ? (
              <div className="mb-8">
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="w-full flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-white text-gray-800 hover:border-gray-400 transition-colors"
                  >
                    <span className="font-medium">Select an Option</span>
                    <svg
                      className={`w-5 h-5 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
                      {/* Search input */}
                      <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                        <input
                          type="text"
                          placeholder="Search options..."
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                      
                      {/* Options list */}
                      <div className="max-h-80 overflow-auto">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option: any, index: number) => (
                            <button
                              key={index}
                              onClick={() => handleOptionSelect(option)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center"
                            >
                              <div>
                                <span className="font-medium block text-gray-800">{option.name}</span>
                                {option.title && <span className="text-sm text-gray-600">{option.title}</span>}
                              </div>
                              <span className="font-medium text-gray-900">₹{option.price}</span>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No options found matching "{searchTerm}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-medium mb-2 text-gray-800">Selected Option:</h4>
                  <div className="p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-800">{selectedOption.name}</span>
                      <span className="font-medium text-gray-900">₹{selectedOption.price}</span>
                    </div>
                    {selectedOption.title && (
                      <p className="text-sm text-gray-600 mt-1">{selectedOption.title}</p>
                    )}
                  </div>
                </div>
                <AddToCart
                  data={product}
                  id={id}
                  email={email}
                  phone={contact}
                  variant="big"
                  variation={selectedOption}
                  disabled={false}
                />
                <Button 
                  onClick={() => setSelectedOption(null)}
                  className="mt-4 w-full bg-gray-400 hover:bg-gray-600 text-gray-800"
                >
                  Change Option
                </Button>
              </div>
            )}

            {/* Product Meta */}
            <div className="mt-8 pt-6 border-t border-gray-200">            
              {product?.categories?.length > 0 && (
                <div className="flex mb-2">
                  <span className="text-gray-600 w-32">Categories:</span>
                  <span className="text-gray-800">
                    {product.categories.map((cat: any) => cat.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductVariation = ({ productSlug }: { productSlug: any }) => {
  const { locale } = useRouter();
  const { data }: any = useMeQuery();
  const userId = data?.dealer?.id;
  const { id, email, contact } = data || {};
  const { slug, product_id, shop_id } = productSlug || {};

  const { product, isLoading: loading } = useProductQuery({
    slug: slug || '',
    id: product_id || '',
    shop_id: shop_id || '',
    userId,
    language: locale!,
  });

  if (loading) return <div className="bg-white min-h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="bg-white min-h-screen flex items-center justify-center">Product not found</div>;
  
  return (
    <AttributesProvider>
      <Variation product={product} id={id} email={email} contact={contact} />
    </AttributesProvider>
  );
};

export default ProductVariation;
