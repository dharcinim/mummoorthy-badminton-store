import React from "react";

function ProductInfo({

    product,

    variants,

    selectedVariant,

    setSelectedVariant,

    quantity,

    increaseQuantity,

    decreaseQuantity,

    currentPrice,

    currentMRP,

    discount,

    saveAmount,

    currentStock,

    addToCart,

    toggleWishlist,

    liked,

    navigate,

    user

}) {

    return (

        <div>

            {/* Product Name */}

            <h1
                style={{
                    fontSize: "36px",
                    fontWeight: "700",
                    marginBottom: "12px"
                }}
            >
                {product.name}
            </h1>

            {/* Brand */}

            <div
                style={{
                    marginBottom: "8px",
                    color: "#666"
                }}
            >

                Brand :
                <b> {product.brand?.name}</b>

            </div>

            {/* Category */}

            <div
                style={{
                    marginBottom: "25px",
                    color: "#666"
                }}
            >

                Category :
                <b> {product.category?.name}</b>

            </div>

            {/* Price */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px"
                }}
            >

                <span
                    style={{
                        fontSize: "36px",
                        fontWeight: "700"
                    }}
                >

                    ₹{currentPrice}

                </span>

                <span
                    style={{
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: "20px"
                    }}
                >

                    ₹{currentMRP}

                </span>

                <span
                    style={{
                        background: "#0aa84f",
                        color: "#fff",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontWeight: "600"
                    }}
                >

                    {discount}% OFF

                </span>

            </div>

            <div
                style={{
                    marginTop: "10px",
                    color: "#0aa84f",
                    fontWeight: "600"
                }}
            >

                You Save ₹{saveAmount}

            </div>

            {/* Stock */}

            <div
                style={{
                    marginTop: "18px",
                    fontWeight: "600",
                    color:
                        currentStock > 0
                            ? "#0aa84f"
                            : "red"
                }}
            >

                {

                    currentStock > 0

                        ?

                        `In Stock (${currentStock})`

                        :

                        "Out Of Stock"

                }

            </div>

            {/* Weight */}

            <div
                style={{
                    marginTop: "35px"
                }}
            >

                <h3>

                    Weight

                </h3>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap"
                    }}
                >

                    {

                        variants.map((variant) => (

                            <button

                                key={variant.id}

                                onClick={() =>
                                    setSelectedVariant(variant)
                                }

                                style={{

                                    padding: "12px 22px",

                                    cursor: "pointer",

                                    border:

                                        selectedVariant?.id === variant.id

                                            ?

                                            "2px solid black"

                                            :

                                            "1px solid #ddd",

                                    background:

                                        selectedVariant?.id === variant.id

                                            ?

                                            "#000"

                                            :

                                            "#fff",

                                    color:

                                        selectedVariant?.id === variant.id

                                            ?

                                            "#fff"

                                            :

                                            "#000",

                                    borderRadius: "8px"

                                }}

                            >

                                {variant.weight}

                            </button>

                        ))

                    }

                </div>

            </div>

            {/* Quantity */}

            <div
                style={{
                    marginTop: "35px"
                }}
            >

                <h3>

                    Quantity

                </h3>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px"
                    }}
                >

                    <button
                        onClick={decreaseQuantity}
                    >
                        -
                    </button>

                    <span
                        style={{
                            fontSize: "20px"
                        }}
                    >

                        {quantity}

                    </span>

                    <button
                        onClick={increaseQuantity}
                    >
                        +
                    </button>

                </div>

            </div>

            {/* Buttons */}

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "40px"
                }}
            >

                <button

                    onClick={() => {

                        if (!user) {

                            navigate("/login");

                            return;

                        }

                        addToCart({

                            ...product,

                            quantity,

                            variant: selectedVariant

                        });

                    }}

                    style={{

                        flex: 1,

                        padding: "16px",

                        background: "#000",

                        color: "#fff",

                        border: "none",

                        borderRadius: "8px",

                        cursor: "pointer",

                        fontSize: "16px",

                        fontWeight: "600"

                    }}

                >

                    Add To Cart

                </button>

                <button

                    onClick={() => {

                        if (!user) {

                            navigate("/login");

                            return;

                        }

                        toggleWishlist(product.id);

                    }}

                    style={{

                        width: "70px",

                        borderRadius: "8px",

                        border: "1px solid #ddd",

                        background: "#fff",

                        cursor: "pointer",

                        fontSize: "24px"

                    }}

                >

                    {liked ? "❤️" : "🤍"}

                </button>

            </div>

            {/* Description */}

            <div
                style={{
                    marginTop: "50px"
                }}
            >

                <h2>

                    Description

                </h2>

                <p
                    style={{
                        lineHeight: "1.8",
                        color: "#555"
                    }}
                >

                    {product.description}

                </p>

            </div>

        </div>

    );

}

export default ProductInfo;