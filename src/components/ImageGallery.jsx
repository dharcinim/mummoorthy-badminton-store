import React from "react";

function ImageGallery({
    product,
    images,
    selectedImage,
    setSelectedImage
}) {

    const displayImage =
        selectedImage ||
        (images.length > 0
            ? images[0].imageUrl
            : "");

    return (

        <div>

            {/* Main Image */}

            <div
                style={{
                    width: "100%",
                    height: "550px",
                    border: "1px solid #e5e5e5",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#fff"
                }}
            >

                <img
                    src={displayImage}
                    alt={product?.name}
                    style={{
                        maxWidth: "90%",
                        maxHeight: "90%",
                        objectFit: "contain"
                    }}
                />

            </div>

            {/* Thumbnail Images */}

            <div
                style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    overflowX: "auto"
                }}
            >

                {images.map((image) => (

                    <img

                        key={image.id}

                        src={image.imageUrl}

                        alt={image.altText}

                        onClick={() =>
                            setSelectedImage(image.imageUrl)
                        }

                        style={{

                            width: "90px",

                            height: "90px",

                            objectFit: "cover",

                            borderRadius: "10px",

                            cursor: "pointer",

                            border:

                                displayImage === image.imageUrl

                                    ? "2px solid #000"

                                    : "1px solid #ddd",

                            transition: "0.25s"

                        }}

                    />

                ))}

            </div>

        </div>

    );

}

export default ImageGallery;