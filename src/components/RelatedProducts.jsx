import React from "react";
import ProductCard from "./ProductCard";

function RelatedProducts({ products }) {

    if (!products || products.length === 0) {

        return null;

    }

    return (

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
                        "repeat(auto-fill,minmax(250px,1fr))",
                    gap: "25px"
                }}
            >

                {

                    products.map(product => (

                        <ProductCard

                            key={product.id}

                            product={product}

                        />

                    ))

                }

            </div>

        </div>

    );

}

export default RelatedProducts;