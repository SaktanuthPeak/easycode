import React, { useEffect, useRef, useState } from "react";
import noUiSlider from "nouislider";
import "nouislider/dist/nouislider.css";

const PriceRangeSlider = ({ price, setPrice }) => {
    const sliderRef = useRef(null);

    useEffect(() => {
        if (sliderRef.current) {
            noUiSlider.create(sliderRef.current, {
                start: price,
                connect: "lower",
                range: {
                    min: 0,
                    max: 100
                },
                tooltips: true,
                format: {
                    to: value => Math.round(value),
                    from: value => Number(value)
                }
            });

            sliderRef.current.noUiSlider.on("update", (values) => {
                setPrice(Number(values[0]));
            });
        }
    }, []);

    return (
        <div className="relative mt-5">
            <label className="sr-only">Price Range</label>
            <div ref={sliderRef} className="relative h-2 rounded-full bg-gray-100"></div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Min ($0)</span>
                <span>${price}</span>
                <span>Max ($100)</span>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
