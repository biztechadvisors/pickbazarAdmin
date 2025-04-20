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
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const optionsPerPage = 3;

  const options = product?.variation_options || [];

  const filteredOptions = useMemo(() => {
    return options.filter(option => 
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.title && option.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [options, searchTerm]);

  // Pagination logic
  const indexOfLastOption = currentPage * optionsPerPage;
  const indexOfFirstOption = indexOfLastOption - optionsPerPage;
  const currentOptions = filteredOptions.slice(indexOfFirstOption, indexOfLastOption);
  const totalPages = Math.ceil(filteredOptions.length / optionsPerPage);

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Determine which image to display
  const displayImage = selectedOption?.image[0]?.thumbnail || 
                     product?.image?.thumbnail || 
                     'https://via.placeholder.com/600';

  // Extract and format variation details
  const formatVariationDetails = (option: any) => {
    if (!option) return null;
    return (
      <div className="text-xs text-gray-600 space-y-1 mt-1">
        {option.sku && <p>SKU: {option.sku}</p>}
        {option.title && <p>Title: {option.title.replace(/\//g, ', ')}</p>}
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <img 
              src={displayImage}
              alt={selectedOption?.name || product?.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-xl font-bold text-gray-900">{product?.name}</h1>
            
           

            <div className="my-3">
              <VariationPrice
                selectedVariation={selectedOption}
                minPrice={product.min_price}
                maxPrice={product.max_price}
              />
            </div>

            <p className="text-gray-700 text-sm mb-4">{product?.description}</p>

            {!selectedOption ? (
              <div>
                <input
                  type="text"
                  placeholder="Search options..."
                  className="w-full p-2 border border-gray-300 rounded mb-3 text-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                
                <div className="space-y-2">
                  {currentOptions.length > 0 ? (
                    currentOptions.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleOptionSelect(option)}
                        className="flex flex-col items-start p-2 border border-gray-200 w-full text-sm"
                      >
                        <div className="flex justify-between w-full">
                          <span>{option.name}</span>
                          <span>₹{option.price}</span>
                        </div>
                        <span className="text-gray-800 text-xs">{option.title}</span>
                      </Button>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 text-sm py-2">
                      No options found
                    </p>
                  )}
                </div>

                {/* Pagination Controls */}
                {filteredOptions.length > optionsPerPage && (
                  <div className="flex justify-center items-center mt-4 space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 text-sm ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 text-sm ${currentPage === number ? 'bg-gray-800 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {number}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 text-sm ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <AddToCart
                  data={product}
                  id={id}
                  email={email}
                  phone={contact}
                  variant="big"
                  variation={selectedOption}
                  disabled={false}
                  className="w-full"
                />
                <Button 
                  onClick={() => setSelectedOption(null)}
                  className="w-full bg-gray-400 hover:bg-gray-600 text-gray-800 text-sm"
                >
                  Change Option
                </Button>
              </div>
            )}

            {/* Categories and Type */}
            {product?.categories?.length > 0 && (
              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-600">
                  Categories: {product.categories.map(cat => cat.name).join(', ')}
                </p>
                {product?.type && (
                  <p className="text-xs text-gray-600">
                    Type: {product.type.name}
                  </p>
                )}
              </div>
            )}
             {/* Variation details */}
             {formatVariationDetails(selectedOption)}
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
