import { createOrder } from "zmp-sdk";
import { Option, Product } from "types/product";
import { getConfig } from "./config";
import { SelectedOptions } from "types/cart";
import variants from "../data/variants";

export function calcFinalPrice(product: Product, options?: SelectedOptions) {
  let finalPrice = product.price;
  console.log("=== calcFinalPrice ===");
  console.log("Product:", product.name, "Base price:", product.price);
  console.log("Options:", options);
  
  if (product.sale) {
    if (product.sale.type === "fixed") {
      finalPrice = product.price - product.sale.amount;
    } else {
      finalPrice = product.price * (1 - product.sale.percent);
    }
    console.log("After sale:", finalPrice);
  }

  if (options && product.variantId) {
    
    // Separate single and multiple selections
    const singleSelections: Option[] = [];
    const multipleSelections: Option[] = [];
    
    for (const variantKey in options) {
      const variant = variants.find((v: any) => v.id === variantKey);
      if (variant) {
        const currentOption = options[variantKey];
        if (typeof currentOption === "string") {
          // Single selection (e.g., size)
          const selected = variant.options.find((o: any) => o.id === currentOption);
          if (selected) {
            singleSelections.push(selected);
          }
        } else {
          // Multiple selection (e.g., toppings)
          const selecteds = variant.options.filter((o: any) =>
            (currentOption as string[]).includes(o.id),
          );
          multipleSelections.push(...selecteds);
        }
      }
    }
    
    console.log("Single selections:", singleSelections);
    console.log("Multiple selections:", multipleSelections);
    
    // Apply single selections first (replace base price)
    singleSelections.forEach(option => {
      if (option.priceChange) {
        if (option.priceChange.type === "fixed") {
          finalPrice = product.price + option.priceChange.amount;
        } else {
          finalPrice = product.price + (product.price * option.priceChange.percent);
        }
        console.log("After single selection:", option.label, finalPrice);
      }
    });
    
    // Apply multiple selections (add to current price)
    multipleSelections.forEach(option => {
      if (option.priceChange) {
        if (option.priceChange.type === "fixed") {
          finalPrice += option.priceChange.amount;
        } else {
          finalPrice += finalPrice * option.priceChange.percent;
        }
        console.log("After multiple selection:", option.label, finalPrice);
      }
    });
  }
  console.log("Final price:", finalPrice);
  return finalPrice;
}

export function getDummyImage(filename: string) {
  return `https://stc-zmp.zadn.vn/templates/zaui-coffee/dummy/${filename}`;
}

export function isIdentical(
  option1: SelectedOptions,
  option2: SelectedOptions,
) {
  const option1Keys = Object.keys(option1);
  const option2Keys = Object.keys(option2);

  if (option1Keys.length !== option2Keys.length) {
    return false;
  }

  for (const key of option1Keys) {
    const option1Value = option1[key];
    const option2Value = option2[key];

    const areEqual =
      Array.isArray(option1Value) &&
      Array.isArray(option2Value) &&
      [...option1Value].sort().toString() ===
        [...option2Value].sort().toString();

    if (option1Value !== option2Value && !areEqual) {
      return false;
    }
  }

  return true;
}

const pay = (amount: number, description?: string) =>
  createOrder({
    desc:
      description ??
      `Thanh toán cho ${getConfig((config) => config.app.title)}`,
    item: [],
    amount: amount,
    success: (data) => {
      console.log("Payment success: ", data);
    },
    fail: (err) => {
      console.log("Payment error: ", err);
    },
  });

export default pay;
