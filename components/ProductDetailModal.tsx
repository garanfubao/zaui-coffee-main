import React, { useState, useEffect } from "react";
import { Modal, Text, Button, Box } from "zmp-ui";
import type { Product, Variant, Option } from "../types/product";
import { formatVND } from "../utils/price";
import { useCart } from "../hooks/useCart";
import { calcFinalPrice } from "../utils/product";

interface ProductDetailModalProps {
  product: Product | null;
  visible: boolean;
  onClose: () => void;
}

interface SelectedOptions {
  [variantId: string]: string | string[];
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  visible,
  onClose,
}) => {
  const { add } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [variants, setVariants] = useState<Variant[]>([]);
  const [finalPrice, setFinalPrice] = useState(0);

  // Load variants data
  useEffect(() => {
    const loadVariants = async () => {
      try {
        const variantsData = await import("../data/variants");
        setVariants(variantsData.default);
      } catch (error) {
        console.error("Failed to load variants:", error);
      }
    };
    
    if (product && visible) {
      loadVariants();
    }
  }, [product, visible]);

  // Calculate final price based on selected options
  useEffect(() => {
    if (!product) return;
    
    const price = calcFinalPrice(product, selectedOptions);
    setFinalPrice(price);
  }, [selectedOptions, product]);

  // Initialize default selections
  useEffect(() => {
    if (!product || !product.variantId || !variants.length) return;

    const defaults: SelectedOptions = {};
    product.variantId.forEach(variantId => {
      const variant = variants.find(v => v.id === variantId);
      if (variant) {
        if (variant.type === 'single' && variant.default) {
          defaults[variantId] = variant.default;
        } else if (variant.type === 'multiple' && variant.default) {
          defaults[variantId] = variant.default;
        }
      }
    });
    setSelectedOptions(defaults);
  }, [product, variants]);

  const handleOptionSelect = (variantId: string, optionId: string, isMultiple: boolean) => {
    setSelectedOptions(prev => {
      if (isMultiple) {
        const current = (prev[variantId] as string[]) || [];
        const newSelection = current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : [...current, optionId];
        return { ...prev, [variantId]: newSelection };
      } else {
        return { ...prev, [variantId]: optionId };
      }
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add product with selected options
    add(product, 1, selectedOptions);
    onClose();
    
    // Reset selections
    setSelectedOptions({});
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      title={product.name}
      onClose={onClose}
      actions={[
        {
          text: "Thêm vào giỏ",
          onClick: handleAddToCart,
          highLight: true,
        },
      ]}
    >
      <Box className="space-y-4">
        {/* Product Description */}
        {product.description && (
          <Box>
            <Text className="text-gray-600 text-sm">
              {product.description.replace(/<[^>]*>/g, '')}
            </Text>
          </Box>
        )}

        {/* Variants Selection */}
        {product.variantId && product.variantId.length > 0 && (
          <Box className="space-y-4">
            {product.variantId.map(variantId => {
              const variant = variants.find(v => v.id === variantId);
              if (!variant) return null;

              return (
                <Box key={variantId} className="space-y-2">
                  <Text className="font-semibold">{variant.label}</Text>
                  
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => {
                      const isSelected = variant.type === 'single'
                        ? selectedOptions[variantId] === option.id
                        : (selectedOptions[variantId] as string[])?.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                            isSelected
                              ? 'bg-[#E0A000] text-white border-[#E0A000]'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-[#E0A000]'
                          }`}
                          onClick={() => handleOptionSelect(variantId, option.id, variant.type === 'multiple')}
                        >
                          <div className="text-center">
                            <div>{option.label}</div>
                            {option.priceChange && (
                              <div className="text-xs mt-1">
                                {option.priceChange.type === 'percent' 
                                  ? `${option.priceChange.percent > 0 ? '+' : ''}${(option.priceChange.percent * 100).toFixed(0)}%`
                                  : `${option.priceChange.amount > 0 ? '+' : ''}${formatVND(option.priceChange.amount)}`
                                }
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Box>
              );
            })}
          </Box>
        )}

        {/* Price Display */}
        <Box className="border-t pt-4">
          <div className="flex justify-between items-center">
            <Text className="text-lg font-semibold">Tổng tiền:</Text>
            <Text className="text-xl font-bold text-[#E0A000]">
              {formatVND(finalPrice)}
            </Text>
          </div>
          
          {product.sale && (
            <div className="flex justify-between items-center mt-2">
              <Text className="text-sm text-gray-500 line-through">
                {formatVND(product.price)}
              </Text>
              <div className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                {product.sale.type === 'percent' 
                  ? `Giảm ${(product.sale.percent * 100).toFixed(0)}%`
                  : `Giảm ${formatVND(product.sale.amount)}`
                }
              </div>
            </div>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ProductDetailModal;
