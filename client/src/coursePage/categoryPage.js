import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ax from "../conf/ax";
import no_image_available from "./images/No_image_available.svg.jpg";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [categoryData, setCategoryData] = useState(null);
    const baseURL = "http://localhost:1337";

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await ax.get(`categories/${categoryId}?populate=courses.course_img`);
                console.log("API Response:", response.data);
                setCategoryData(response.data.data);
            } catch (error) {
                console.error("Error fetching category details:", error);
            }
        };

        fetchCategoryDetails();
    }, [categoryId]);

    if (!categoryData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold">{categoryData.Category_name}'s courses</h1>
            <h1 className="text-3xl font-bold">{categoryData.Category_description}</h1>

            <div className="grid grid-cols-3 gap-6 mt-6">
                {categoryData.courses.map((course) => (
                    <div
                        key={course.id}
                        className="h-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <img
                            src={course.course_img?.length > 0 ? `${baseURL}${course.course_img[0].url}` : no_image_available}
                            alt={course.Course_name}
                            className="rounded-t-lg w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{course.Course_name}</h3>
                            <p className="text-sm text-gray-600">Created By Me :</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryPage;
