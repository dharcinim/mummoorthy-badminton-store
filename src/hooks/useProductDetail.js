import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function useProductDetail() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      // Product
      const productRes = await api.get(`/products/${id}`);
      const productData = productRes.data;
      setProduct(productData);

      // Variants
      const variantRes = await api.get(
        `/product-variants/product/${id}`
      );

      const variantData = variantRes.data;
      setVariants(variantData);

      if (variantData.length > 0) {
        setSelectedVariant(variantData[0]);
      }

      // Images
      const imageRes = await api.get(
        `/product-images/product/${id}`
      );

      const imageData = imageRes.data;
      setImages(imageData);

      if (imageData.length > 0) {
        setSelectedImage(imageData[0].imageUrl);
      }

      // Related Products
      const allProducts = await api.get("/products");

      const related = allProducts.data.filter(
        (p) =>
          p.category?.id === productData.category?.id &&
          p.id !== productData.id
      );

      setRelatedProducts(related.slice(0, 4));
    } catch (err) {
      console.error(err);
      setError("Unable to load product.");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const currentPrice = selectedVariant
    ? selectedVariant.sellingPrice
    : 0;

  const currentMRP = selectedVariant
    ? selectedVariant.mrp
    : 0;

  const currentStock = selectedVariant
    ? selectedVariant.stock
    : 0;

  const discount =
    currentMRP > 0
      ? Math.round(
          ((currentMRP - currentPrice) / currentMRP) * 100
        )
      : 0;

  const saveAmount = currentMRP - currentPrice;

  return {
    loading,
    error,

    product,

    variants,
    images,
    relatedProducts,

    selectedVariant,
    setSelectedVariant,

    selectedImage,
    setSelectedImage,

    quantity,
    increaseQuantity,
    decreaseQuantity,

    currentPrice,
    currentMRP,
    currentStock,
    discount,
    saveAmount,
  };
}