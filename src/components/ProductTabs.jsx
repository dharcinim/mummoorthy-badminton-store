import React, { useState } from "react";

function ProductTabs({ product, selectedVariant }) {

    const [activeTab, setActiveTab] = useState("description");

    return (

        <div style={{ marginTop: "60px" }}>

            {/* Tabs */}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    borderBottom: "2px solid #eee",
                    marginBottom: "25px"
                }}
            >

                <button
                    onClick={() => setActiveTab("description")}
                    style={buttonStyle(activeTab === "description")}
                >
                    Description
                </button>

                <button
                    onClick={() => setActiveTab("specifications")}
                    style={buttonStyle(activeTab === "specifications")}
                >
                    Specifications
                </button>

                <button
                    onClick={() => setActiveTab("additional")}
                    style={buttonStyle(activeTab === "additional")}
                >
                    Additional Info
                </button>

            </div>

            {/* Description */}

            {activeTab === "description" && (

                <div>

                    <p
                        style={{
                            lineHeight: "1.8",
                            color: "#555"
                        }}
                    >
                        {product.description}
                    </p>

                </div>

            )}

            {/* Specifications */}

            {activeTab === "specifications" && (

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <tbody>

                        <Row
                            title="Weight"
                            value={selectedVariant?.weight}
                        />

                        <Row
                            title="Grip Size"
                            value={selectedVariant?.gripSize}
                        />

                        <Row
                            title="Balance"
                            value={selectedVariant?.balance}
                        />

                        <Row
                            title="Flexibility"
                            value={selectedVariant?.flexibility}
                        />

                        <Row
                            title="Frame Material"
                            value={selectedVariant?.frameMaterial}
                        />

                        <Row
                            title="Shaft Material"
                            value={selectedVariant?.shaftMaterial}
                        />

                        <Row
                            title="Playing Level"
                            value={selectedVariant?.playingLevel}
                        />

                        <Row
                            title="Maximum Tension"
                            value={selectedVariant?.maxTension}
                        />

                    </tbody>

                </table>

            )}

            {/* Additional */}

            {activeTab === "additional" && (

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse"
                    }}
                >

                    <tbody>

                        <Row
                            title="Brand"
                            value={product.brand?.name}
                        />

                        <Row
                            title="Category"
                            value={product.category?.name}
                        />

                        <Row
                            title="Warranty"
                            value={product.warranty}
                        />

                        <Row
                            title="Country of Origin"
                            value={product.countryOfOrigin}
                        />

                        <Row
                            title="GST"
                            value={`${product.gstPercentage}%`}
                        />

                    </tbody>

                </table>

            )}

        </div>

    );

}

function Row({ title, value }) {

    return (

        <tr>

            <td
                style={{
                    border: "1px solid #eee",
                    padding: "12px",
                    fontWeight: "600",
                    width: "220px"
                }}
            >
                {title}
            </td>

            <td
                style={{
                    border: "1px solid #eee",
                    padding: "12px"
                }}
            >
                {value || "-"}
            </td>

        </tr>

    );

}

function buttonStyle(active) {

    return {

        padding: "12px 20px",

        cursor: "pointer",

        border: "none",

        background: "none",

        borderBottom: active
            ? "3px solid black"
            : "3px solid transparent",

        fontWeight: active
            ? "700"
            : "500",

        fontSize: "15px"

    };

}

export default ProductTabs;