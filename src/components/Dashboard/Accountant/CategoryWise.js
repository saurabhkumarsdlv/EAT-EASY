import React, { useState, useEffect, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Line, time } from "react-chartjs-2";
import { useSelector } from "react-redux";
// import { Registry } from "chart.js";
import { fetchExpenseCategoryWiseAndTotal } from "../../../services/operations/ExpenseAPI";
import PieChart from "./PieChart";
import "chartjs-adapter-date-fns";
import { enGB } from "date-fns/locale";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TimeScale,
  registerables,
} from "chart.js";

import { BarElement, CategoryScale, LinearScale, Title } from "chart.js";
import ProductWise from "./ProductWise";
import Ranges from "./Ranges";

import ExpenseRangeChart from "./Ranges";
ChartJS.register(
  // CategoryScale,
  // LinearScale,
  // BarElement,
  // Title,
  // // TimeScale,
  // ArcElement,
  // Tooltip,
  // Legend
  ...registerables
);

// Registry.registerScaleType("time", TimeScale);
const CategoryWise = () => {
  const [expenseData, setExpenseData] = useState(null);
  const { token } = useSelector((state) => state.auth);
  let [productName, setProductName] = useState([]);
  const [productData, setProductData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productCategories = useMemo(
    () => [
      "Vegetables",
      "Oils",
      "Groceries",
      "Dairy",
      "Furniture-and-Utensils",
      "Others",
    ],
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataPromises = productCategories.map((category) =>
          fetchExpenseCategoryWiseAndTotal(token, category)
        );

        const categoryData = await Promise.all(dataPromises);
        console.log("categoryData", categoryData);
        setExpenseData(categoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Run fetchData only when the component mounts or when the token or productCategories change
    fetchData();
  }, [token]);

  console.log("expensee data", expenseData);

  const barChartData = {
    labels:
      expenseData?.map(
        (data) => data?.categoryWiseExpense[0]?.productCategory || ""
      ) || [],
    datasets: [
      {
        label: "Total Expense",
        data: expenseData?.map((data) => data?.total || 0) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FF9800",
          "#795548",
        ],
      },
    ],
  };

  // Define bar chart options
  const barChartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        labels: [
          "Vegetables",
          "Oils",
          "Groceries",
          "Dairy",
          "Furniture-and-Utensils",
          "Others",
        ],
        title: {
          display: true,
          text: "Category", // Set your x-axis label text here
          color: "white",
          size: 32, // Adjust the font size here
        },
        ticks: {
          color: "white", // Adjust the font color of x-axis labels here
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Expense",
          color: "white",
          size: 32,
        },
        ticks: {
          color: "white", // Adjust the font color of x-axis labels here
        },
      },
    },
    elements: {
      bar: {
        barThickness: 50, // Adjust the bar thickness here
      },
    },

    onClick: (event, elements) => {
      if (elements.length > 0) {
        console.log("elements", elements);
        const clickedCategory = barChartData?.labels[elements[0].index];
        console.log("clicked category", clickedCategory);
        setSelectedCategory(clickedCategory);

        // category seleceted now get the productName associated with this category
        // and make the array of the productname then display the graph
      }
    },
  };
  console.log("selected category", selectedCategory);
  console.log("barchart data", barChartData);
  return (
    <div className="flex flex-col gap-4  ">
      <div className="flex-col gap-3">
        <h2 className="font-serif text-xl font-extrabold">
          Total Expenses by Category
        </h2>
        <div
          className="flex flex-row gap-8"
          style={{ width: "400px", height: "500px" }}
        >
          <div>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          {selectedCategory && (
            <div style={{ width: "400px", height: "500px" }}>
              <h2 className="font-serif text-xl font-extrabold">
                Details for {selectedCategory}
              </h2>
              <ProductWise productCategory={selectedCategory} />
              {/* Add code to display details of the selected category */}
            </div>
          )}
        </div>
        <div className="p-4 mt-2">
          <ExpenseRangeChart />
        </div>
      </div>
    </div>
  );
};

export default CategoryWise;
