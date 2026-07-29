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

    const [selectedVariant, setSelectedVariant] = useState(null);

   const liked = selectedVariant
    ? isLiked(selectedVariant.id)
    : false;

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [product, setProduct] = useState(null);

    const [variants, setVariants] = useState([]);

    const [images, setImages] = useState([]);

    const [relatedProducts, setRelatedProducts] = useState([]);

    

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

            setRelatedProducts(related.slice(0, 4));

        }

        catch (err) {

            console.error(err);

            setError("Unable to load product.");

        }

        finally {

            setLoading(false);

        }

    };

        const currentVariant =
        selectedVariant ?? variants[0];

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

    const increaseQuantity = () => {

        if (quantity < currentStock) {

            setQuantity(quantity + 1);

        }

    };

    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(quantity - 1);

        }

    };

    const handleAddToCart = () => {

        console.log("=== NEW HANDLE ADD TO CART ===");

    console.log("selectedVariant =", selectedVariant);

    console.log("selectedVariant.id =", selectedVariant?.id);

    if (!user) {
        navigate("/login");
        return;
    }

    if (!selectedVariant) {
        alert("Please select a variant.");
        return;
    }

    console.log("Selected Variant:", selectedVariant);
    console.log("Variant ID:", selectedVariant.id);

    addToCart({

        productVariantId: selectedVariant.id,

        quantity: quantity

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


            toggleWishlist={async (e) => {

    if (!user) {
        navigate("/login");
        return;
    }

    if (!selectedVariant) {
        alert("Please select a variant.");
        return;
    }

    // Get button position
    const rect = e.currentTarget.getBoundingClientRect();

    // Create flying heart
    const heart = document.createElement("div");
    heart.innerHTML = "❤️";

    heart.style.position = "fixed";
    heart.style.left = rect.left + rect.width / 2 + "px";
    heart.style.top = rect.top + rect.height / 2 + "px";
    heart.style.fontSize = "28px";
    heart.style.zIndex = "9999";
    heart.style.pointerEvents = "none";
    heart.style.transition = "all 0.8s ease";

    document.body.appendChild(heart);

    // Add to wishlist
    await toggleWishlist(selectedVariant.id);

    // Target (Header heart)
    const target = document.getElementById("wishlist-icon");

    if (target) {

        const targetRect = target.getBoundingClientRect();

        requestAnimationFrame(() => {

            heart.style.left =
                targetRect.left + targetRect.width / 2 + "px";

            heart.style.top =
                targetRect.top + targetRect.height / 2 + "px";

            heart.style.transform = "scale(0.2)";
            heart.style.opacity = "0";

        });

        setTimeout(() => {
            heart.remove();
        }, 850);
    } else {
        heart.remove();
    }

}}

            liked={liked}

            buyNow={handleBuyNow}

            navigate={navigate}

        />

    );

}

export default ProductDetail;