import React, { useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";

export default function ProductDetailView({

    loading,
    error,

    product,

    images,
    variants,
    relatedProducts,

    selectedImage,
    setSelectedImage,

    selectedVariant,
    setSelectedVariant,

    quantity,
    increaseQuantity,
    decreaseQuantity,

    currentPrice,
    currentMRP,
    currentStock,
    discount,
    saveAmount,

    addToCart,
    toggleWishlist,
    liked,
    buyNow

}) {

    const categoryName = String(product?.category?.name || product?.categoryName || product?.category || "").toLowerCase().trim();
    const isShoe = categoryName === "shoes";
    const isClothing = categoryName === "clothing";

    // Variant controls are driven by the actual variants returned by the API.
    const variantColors = useMemo(() => {
        return [...new Set((variants || []).map((variant) => variant.color || variant.colour).filter(Boolean))];
    }, [variants]);
    const variantSizes = useMemo(() => {
        return [...new Set((variants || []).map((variant) => variant.size).filter(Boolean))];
    }, [variants]);

    const getImagesForColor = (colour) => {
        if (!colour) return images || [];
        const normalize = (value) => String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const colourWords = String(colour).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
            .filter((word) => !["and", "with"].includes(word));
        const compactColour = normalize(colour);
        const matches = (images || []).filter((img) => {
            const searchable = `${img.imageUrl || ""} ${img.altText || ""}`.toLowerCase();
            const compactSearchable = normalize(searchable);
            // Handles both "Black/Red" and filenames such as "BlackRed".
            if (compactColour && compactSearchable.includes(compactColour)) return true;
            // For multi-word colours, require every word to avoid mixing colour galleries.
            return colourWords.length > 0 && colourWords.every((word) => compactSearchable.includes(word));
        });
        if (matches.length) return matches;
        const primary = (images || []).filter((img) => img.primaryImage === true);
        return primary.length ? primary.slice(0, 1) : (images || []).slice(0, 1);
    };

    const visibleImages = useMemo(() => {
        if (!selectedVariant?.color) return images || [];
        const matches = getImagesForColor(selectedVariant.color);
        return matches.length ? matches : (images || []);
    }, [images, selectedVariant?.color]);

    useEffect(() => {
        if (!selectedVariant?.color || !images?.length) return;
        const colorImages = getImagesForColor(selectedVariant.color);
        const nextImage = colorImages[0]?.imageUrl;
        if (nextImage && nextImage !== selectedImage) setSelectedImage(nextImage);
    }, [selectedVariant?.color, images]);

    if (loading) {

        return (

            <div
                style={{
                    padding: "100px",
                    textAlign: "center",
                    fontSize: "24px",
                    fontWeight: "600"
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
                    color: "red",
                    fontSize: "22px"
                }}
            >
                {error}
            </div>

        );

    }

    return (

        <div
            style={{
                maxWidth: "1400px",
                margin: "40px auto",
                padding: "20px"
            }}
        >

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "50px",
                    alignItems: "start"
                }}
            >

                {/* LEFT SECTION */}

                <div>

                    <div
                        style={{
                            height: "550px",
                            border: "1px solid #e5e5e5",
                            borderRadius: "15px",
                            background: "#fff",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <img
                            src={selectedImage}
                            alt={product.name}
                            style={{
                                maxWidth: "90%",
                                maxHeight: "90%",
                                objectFit: "contain"
                            }}
                        />

                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            marginTop: "20px",
                            flexWrap: "wrap"
                        }}
                    >

                        {visibleImages.map((img) => (

                            <img

                                key={img.id}

                                src={img.imageUrl}

                                alt={img.altText}

                                onClick={() => setSelectedImage(img.imageUrl)}

                                style={{

                                    width: "80px",
                                    height: "80px",

                                    objectFit: "cover",

                                    cursor: "pointer",

                                    borderRadius: "10px",

                                    border:

                                        selectedImage === img.imageUrl

                                            ? "2px solid black"

                                            : "1px solid #ddd"

                                }}

                            />

                        ))}

                    </div>

                </div>

                {/* RIGHT SECTION STARTS */}
                <div>
                    

                                        <h1
                        style={{
                            fontSize: "34px",
                            fontWeight: "700",
                            marginBottom: "10px"
                        }}
                    >
                        {product.name}
                    </h1>

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            marginBottom: "20px",
                            color: "#666",
                            fontSize: "15px"
                        }}
                    >
                        <span>
                            <strong>Brand:</strong> {product.brand?.name}
                        </span>

                        <span>
                            <strong>Category:</strong> {product.category?.name}
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "15px",
                            flexWrap: "wrap"
                        }}
                    >

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "36px",
                                color: "#111"
                            }}
                        >
                            ₹{currentPrice}
                        </h2>

                        <span
                            style={{
                                textDecoration: "line-through",
                                color: "#888",
                                fontSize: "22px"
                            }}
                        >
                            ₹{currentMRP}
                        </span>

                        {discount > 0 && (

                            <span
                                style={{
                                    background: "#00b894",
                                    color: "#fff",
                                    padding: "5px 12px",
                                    borderRadius: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                {discount}% OFF
                            </span>

                        )}

                    </div>

                    <div
                        style={{
                            marginTop: "12px",
                            color: "#00a651",
                            fontWeight: "600"
                        }}
                    >
                        You Save ₹{saveAmount}
                    </div>

                    <div
                        style={{
                            marginTop: "25px",
                            fontSize: "16px"
                        }}
                    >
                        <strong>Stock :</strong>

                        <span
                            style={{
                                color: currentStock > 0 ? "green" : "red",
                                marginLeft: "8px",
                                fontWeight: "600"
                            }}
                        >
                            {
                                currentStock > 0
                                    ? `${currentStock} Available`
                                    : "Out of Stock"
                            }
                        </span>

                    </div>

                    {/* CATEGORY VARIANTS: SIZE + COLOUR */}

{(isShoe || variantColors.length > 0 || variantSizes.length > 0) && (

    <div style={{ marginTop: "35px" }}>

        {(isShoe || isClothing) && (variants || []).some((variant) => variant.size) && <> 
        {/* SIZE */}

        <h3 style={{ marginBottom: "15px" }}>
            {isClothing ? "Clothing Size" : "Size"}
        </h3>

        <div
            style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap"
            }}
        >

            {[
                ...new Set(
                    variants
                        .filter((variant) => variant.stock > 0)
                        .map((variant) => variant.size)
                        .filter(Boolean)
                )
            ].map((size) => (

                <button
                    key={size}

                    onClick={() => {

                        const firstVariant =
                            variants.find(
                                (variant) =>
                                    variant.size === size &&
                                    variant.stock > 0
                            );

                        if (firstVariant) {
                            setSelectedVariant(firstVariant);
                        }

                    }}

                    style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                        borderRadius: "8px",

                        border:
                            selectedVariant?.size === size
                                ? "2px solid black"
                                : "1px solid #ccc",

                        background:
                            selectedVariant?.size === size
                                ? "#000"
                                : "#fff",

                        color:
                            selectedVariant?.size === size
                                ? "#fff"
                                : "#000"
                    }}
                >
                    {size}
                </button>

            ))}

        </div>


        </>}

        {/* COLOUR */}

        <h3
            style={{
                marginTop: "25px",
                marginBottom: "15px"
            }}
        >
            Colour
        </h3>

        <div
            style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap"
            }}
        >

{variantColors.map((colour) => {

    // Find this colour regardless of selected size
    const colourVariant = variants.find(
        (variant) =>
            variant.color === colour
    );

    if (!colourVariant) {
        return null;
    }

    // Check whether this colour is available
    // for the currently selected size
const availableVariant = variants.find(
    (variant) => variant.color === colour && variant.stock > 0 &&
        (!selectedVariant?.size || variant.size === selectedVariant.size)
) || variants.find((variant) => variant.color === colour && variant.stock > 0);

    const isAvailable =
        !!availableVariant;

    const colourImages = getImagesForColor(colour);

    const thumbnail =
        colourImages[0]?.imageUrl;

    return (

        <div
            key={colour}
            style={{
                textAlign: "center",
                opacity: isAvailable ? 1 : 0.45
            }}
        >

            <button
                disabled={!isAvailable}

                onClick={() => {

                    if (!isAvailable) {
                        return;
                    }

                    setSelectedVariant(
                        availableVariant
                    );

                    const nextImages = getImagesForColor(colour);
                    if (nextImages.length) setSelectedImage(nextImages[0].imageUrl);

                }}

                style={{
                    position: "relative",
                    padding: "3px",
                    borderRadius: "10px",

                    cursor:
                        isAvailable
                            ? "pointer"
                            : "not-allowed",

                    border:
                        selectedVariant?.color === colour &&
                        isAvailable
                            ? "3px solid black"
                            : "1px solid #ddd",

                    background: "#fff"
                }}
            >

            {thumbnail && (

    <img
        src={thumbnail}
        alt={colour}
        style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            borderRadius: "7px",

            filter:
                isAvailable
                    ? "none"
                    : "blur(2px) grayscale(40%)",

            opacity:
                isAvailable
                    ? 1
                    : 0.5
        }}
    />

)}



            </button>

            <div
                style={{
                    marginTop: "6px",
                    fontSize: "13px"
                }}
            >
                {colour}
            </div>

        </div>

    );

})}
        </div>

    </div>

)}

                                        <div
                        style={{
                            marginTop: "35px"
                        }}
                    >

                        <h3
                            style={{
                                marginBottom: "15px"
                            }}
                        >
                            Quantity
                        </h3>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "20px"
                            }}
                        >

                            <button
                                onClick={decreaseQuantity}
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    fontSize: "22px",
                                    border: "1px solid #ccc",
                                    background: "#fff",
                                    cursor: "pointer",
                                    borderRadius: "8px"
                                }}
                            >
                                -
                            </button>

                            <span
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "600"
                                }}
                            >
                                {quantity}
                            </span>

                            <button
                                onClick={increaseQuantity}
                                style={{
                                    width: "45px",
                                    height: "45px",
                                    fontSize: "22px",
                                    border: "1px solid #ccc",
                                    background: "#fff",
                                    cursor: "pointer",
                                    borderRadius: "8px"
                                }}
                            >
                                +
                            </button>

                        </div>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            marginTop: "40px",
                            flexWrap: "wrap"
                        }}
                    >

                        <button
                            onClick={(e) => toggleWishlist(e)}
                            style={{
                                padding: "14px 28px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                background: "#fff",
                                cursor: "pointer",
                                fontSize: "16px"
                            }}
                        >
                            {liked ? "❤️ Wishlisted" : "🤍 Wishlist"}
                        </button>

                        <button
                            onClick={addToCart}
                            disabled={currentStock <= 0}
                            style={{
                                padding: "14px 35px",
                                background:
                                    currentStock > 0
                                        ? "#000"
                                        : "#999",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                cursor:
                                    currentStock > 0
                                        ? "pointer"
                                        : "not-allowed",
                                fontSize: "16px",
                                fontWeight: "600"
                            }}
                        >
                            Add To Cart
                        </button>

                        <button
                            onClick={buyNow}
                            disabled={currentStock <= 0}
                            style={{
                                padding: "14px 35px",
                                background:
                                    currentStock > 0
                                        ? "#ff6b00"
                                        : "#999",
                                color: "#fff",
                                border: "none",
                                borderRadius: "10px",
                                cursor:
                                    currentStock > 0
                                        ? "pointer"
                                        : "not-allowed",
                                fontSize: "16px",
                                fontWeight: "600"
                            }}
                        >
                            Buy Now
                        </button>

                    </div>

                    <div
                        style={{
                            marginTop: "40px"
                        }}
                    >

                        <h3>Description</h3>

                        <p
                            style={{
                                color: "#555",
                                lineHeight: "1.8"
                            }}
                        >
                            {product.description}
                        </p>

                    </div>

                                        <div
                        style={{
                            marginTop: "40px"
                        }}
                    >

                        <h3>Specifications</h3>

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "15px"
                            }}
                        >
                            <tbody>

                                <tr>
                                    <td style={styles.key}>Brand</td>
                                    <td style={styles.value}>
                                        {product.brand?.name}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={styles.key}>Category</td>
                                    <td style={styles.value}>
                                        {product.category?.name}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={styles.key}>Weight</td>
                                    <td style={styles.value}>
                                        {selectedVariant?.weight}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={styles.key}>Playing Level</td>
                                    <td style={styles.value}>
                                        {selectedVariant?.playingLevel || "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={styles.key}>Frame Material</td>
                                    <td style={styles.value}>
                                        {selectedVariant?.frameMaterial || "-"}
                                    </td>
                                </tr>

                                <tr>
                                    <td style={styles.key}>Shaft Material</td>
                                    <td style={styles.value}>
                                        {selectedVariant?.shaftMaterial || "-"}
                                    </td>
                                </tr>

                            </tbody>
                        </table>

                    </div>

                    <div
                        style={{
                            marginTop: "40px"
                        }}
                    >

                        <h3>Reviews</h3>

                        <p
                            style={{
                                color: "#666"
                            }}
                        >
                            Reviews will be available soon.
                        </p>

                    </div>

                </div>

            </div>

            <div
                style={{
                    marginTop: "70px"
                }}
            >

                <h2
                    style={{
                        marginBottom: "30px"
                    }}
                >
                    Related Products
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(250px,1fr))",
                        gap: "25px"
                    }}
                >

                    {relatedProducts.map((item) => (

                        <ProductCard

                            key={item.id}

                            product={item}

                            showNew={item.newArrival}

                            showBest={item.bestSeller}

                        />

                    ))}

                </div>

            </div>

        </div>

    );

}

const styles = {

    key: {

        border: "1px solid #ddd",

        padding: "12px",

        fontWeight: "600",

        width: "220px",

        background: "#fafafa"

    },

    value: {

        border: "1px solid #ddd",

        padding: "12px"

    }

};