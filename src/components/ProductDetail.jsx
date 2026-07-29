import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ProductDetailView from "../components/ProductDetailView";

import { CartContext } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

import {
    getProduct,
    getVariants,
    getProducts,
    getImages
} from "../services/productDetailService";

function ProductDetail() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const { toggleWishlist, isLiked } = useWishlist();

    const { user } = useAuth();

    const liked = selectedVariant
    ? isLiked(selectedVariant.id)
    : false;

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

            const productData = await getProduct(id);

            setProduct(productData);

            const variantData = await getVariants(id);

            setVariants(variantData);

            if (variantData.length > 0) {

                setSelectedVariant(variantData[0]);

            }

            const imageData = await getImages(id);

            setImages(imageData);

            if (imageData.length > 0) {

                setSelectedImage(imageData[0].imageUrl);

            }

            const products = await getProducts();

            const related = products.filter(

                (item) =>

                    item.category?.id === productData.category?.id &&
                    item.id !== productData.id

            );

            setRelatedProducts(related.slice(0,4));

        }

        catch(err){

            console.error(err);

            setError("Unable to load product.");

        }

        finally{

            setLoading(false);

        }

    };

    const increaseQuantity = () => {

    if (currentStock > quantity) {

        setQuantity(quantity + 1);

    }

};

const decreaseQuantity = () => {

    if (quantity > 1) {

        setQuantity(quantity - 1);

    }

};

if (loading) {

    return (
        <div
            style={{
                padding: "100px",
                textAlign: "center",
                fontSize: "22px"
            }}
        >
            Loading Product...
        </div>
    );

}

if (error) {

    return (
        <div
            style={{
                padding: "100px",
                textAlign: "center",
                color: "red"
            }}
        >
            {error}
        </div>
    );

}

if (!product) {

    return null;

}

const currentVariant =
    selectedVariant ??
    variants[0];

const currentPrice =
    currentVariant?.sellingPrice ?? 0;

const currentMRP =
    currentVariant?.mrp ?? currentPrice;

const currentStock =
    currentVariant?.stock ?? 0;

const discount =
    currentMRP > currentPrice
        ? Math.round(
              ((currentMRP - currentPrice) / currentMRP) * 100
          )
        : 0;

const saveAmount =
    currentMRP - currentPrice;

const handleAddToCart = () => {

    console.log("=== HANDLE ADD TO CART ===");
    console.log("selectedVariant =", selectedVariant);
    console.log("selectedVariant.id =", selectedVariant?.id);

    if (!user) {

        navigate("/login");

        return;

    }

    if (!selectedVariant) {

        alert("Please select a product variant.");

        return;

    }

    addToCart({

        productVariantId: selectedVariant.id,

        quantity

    });

};

const handleBuyNow = () => {

    handleAddToCart();

    navigate("/cart");

};

return (

    <ProductDetailView

        loading={loading}

        error={error}

        product={product}

        images={images}

        variants={variants}

        relatedProducts={relatedProducts}

        selectedImage={selectedImage}

        setSelectedImage={setSelectedImage}

        selectedVariant={selectedVariant}

        setSelectedVariant={setSelectedVariant}

        quantity={quantity}

        increaseQuantity={increaseQuantity}

        decreaseQuantity={decreaseQuantity}

        currentPrice={currentPrice}

        currentMRP={currentMRP}

        currentStock={currentStock}

        discount={discount}

        saveAmount={saveAmount}

        addToCart={handleAddToCart}

     toggleWishlist={() => {
    if (!user) {
        navigate("/login");
        return;
    }

    if (!selectedVariant) {
        alert("Please select a variant.");
        return;
    }

    toggleWishlist(selectedVariant.id);

    setTimeout(() => {
        const wishlistIcon = document.getElementById("wishlist-icon");

        if (wishlistIcon) {
            wishlistIcon.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, 300);
}}

        liked={liked}

        navigate={navigate}

        buyNow={handleBuyNow}

    />

);

}

export default ProductDetail;