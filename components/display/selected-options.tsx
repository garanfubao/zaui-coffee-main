import React, { FC, useMemo } from "react";
import { SelectedOptions } from "types/cart";
import { Product, Option } from "types/product";
import variants from "../../data/variants";

export const DisplaySelectedOptions: FC<{
  children: Product;
  options: SelectedOptions;
}> = ({ children, options }) => {
  const variantDescriptions = useMemo(() => {
    const descriptions: { label: string; options: string[] }[] = [];
    
    if (children.variantId && Object.keys(options).length > 0) {
      const selectedVariants = Object.keys(options);
      selectedVariants.forEach((variantId) => {
        const variant = variants.find((v) => v.id === variantId);
        if (variant) {
          if (variant.type === "single") {
            const selectedOption = variant.options.find(
              (o: Option) => o.id === options[variantId],
            );
            if (selectedOption) {
              descriptions.push({
                label: variant.label || variant.id,
                options: [selectedOption.label || selectedOption.id]
              });
            }
          } else {
            const selectedOptions = variant.options.filter((o: Option) =>
              (options[variantId] as string[]).includes(o.id),
            );
            if (selectedOptions.length > 0) {
              descriptions.push({
                label: variant.label || variant.id,
                options: selectedOptions.map((o: Option) => o.label || o.id)
              });
            }
          }
        }
      });
    }
    return descriptions;
  }, [children, options]);

  if (variantDescriptions.length === 0) {
    return <span>Mặc định</span>;
  }

  return (
    <div className="space-y-0.5">
      {variantDescriptions.map((desc, index) => (
        <div key={index} className="flex items-start">
          <span className="text-gray-400 mr-1 mt-0.5">•</span>
          <div>
            <span className="font-semibold text-gray-700">{desc.label}:</span>
            <span className="text-gray-600 ml-1">{desc.options.join(", ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
