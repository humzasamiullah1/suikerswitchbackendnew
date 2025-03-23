import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // ✅ Import useRouter for query params
import Select from "react-select";
import { serverTimestamp } from "firebase/firestore";
import {
  getCategoriesFromFirebase,
  getSupermarkets,
  addProductToFirebase,
  getProductById, // ✅ New function to get product by ID
  updateProductToFirebase, // ✅ New function to update product
} from "../utils/firebasefunctions";
import { toast } from "react-toastify";
import { Plus, X } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import { collection, writeBatch, doc } from "firebase/firestore";
import { firestored } from "../../firebase/firebaseConfig";

const BulkFormSection = () => {
  const [searchParams] = useSearchParams();
  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCheckName, setIsCheckName] = useState(false);
  const [isChecCat, setIsCheckCat] = useState(false);
  const [isChecSuperMarket, setIsCheckSuperMarket] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [data, setData] = useState([]);
  const navigate = useNavigate();






  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      alert(jsonData.length)
      setData(jsonData);
      bulkUpload(jsonData)
    };
    reader.readAsBinaryString(file);
  };

  // ✅ Handle Create or Update Product
  const handleSubmit = async (e) => {
    // e.preventDefault();

    // if (productName === "") {
    //   toast.error("Product Name is required");
    //   setIsCheckName(true);
    //   return;
    // } else if (selectedCategories.length === 0) {
    //   toast.error("Categories is required");
    //   setIsCheckCat(true);
    //   // setIsCheckName(false)
    //   return;
    // } else if (selectedSupermarkets.length === 0) {
    //   toast.error("Supermarkets is required");
    //   setIsCheckSuperMarket(true);
    //   // setIsCheckCat(false)
    //   // setIsCheckName(false)
    //   return;
    // }

    // setIsCheckName(false);
    // setIsCheckCat(false);
    // setIsCheckSuperMarket(false);
    // setLoading(true);

    // const productData = {
    //   productName,
    //   selectedCategories: selectedCategories.map((cat) => cat.value),
    //   selectedSupermarkets: selectedSupermarkets.map((sup) => sup.value),
    //   timestamp: serverTimestamp(),
    //   images,
    // };

    // try {
    //   if (id) {
    //     // ✅ Update existing product
    //     await updateProductToFirebase(id, productData, imageFiles);
    //     toast.success("Product updated successfully!");
    //     setTimeout(() => {
    //       navigate("/dashboard/products");
    //     }, 1000);
    //   } else {
    //     // ✅ Add new product
    //     await addProductToFirebase(productData, imageFiles);
    //     toast.success("Product added successfully!");
    //     setProductName("");
    //     setSelectedCategories([]);
    //     setSelectedSupermarkets([]);
    //     setImage(null);
    //     setImages([]);
    //     setImageFiles([]);
    //   }
    // } catch (error) {
    //   toast.error("Error processing request");
    // }
    // setLoading(false);
  };


  const bulkUpload = async (database) => {
    try {
        let newdata = []
      const batch = writeBatch(firestored);
      const collectionRef = collection(firestored, "products"); // Replace with your Firestore collection name

      database.forEach((item) => {
        const newDocRef = doc(collectionRef); // Auto-generate document ID
        const categories = item?.Category ? item?.Category?.split(",") : []
        const supermarkets = item?.Supermarket ?  item?.Supermarket?.split(","): []
let datset = {
    productName: item?.ProductName,
    selectedCategories: categories.map((cat) => cat.trim()),
    selectedSupermarkets: supermarkets.map((sup) => sup.trim()),
    images: item?.ImageURL,
}
newdata.push(datset)
        batch.set(newDocRef, datset);
      });

      await batch.commit();
      console.log( JSON.stringify(newdata));
      console.log("Bulk upload successful!" );
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <div>
    <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
    // <form
    //   onSubmit={handleSubmit}
    //   className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3"
    // >


    //   {/* ✅ Product Name */}


    //   <div className="pt-5">
    //     <label className="text-sm">Product Name</label>
    //     <input
    //       type="text"
    //       placeholder="Enter product name"
    //       className={`w-full ${
    //         isCheckName ? "border-2 border-red-600" : ""
    //       } mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700`}
    //       value={productName}
    //       onChange={(e) => setProductName(e.target.value)}
    //     />
    //   </div>

    //   {/* ✅ Submit Button */}
    //   <div className="flex items-center justify-center gap-2 mt-7">
    //     <Link to="/dashboard/products">
    //       <button
    //         type="button"
    //         className="border text-xs rounded-full px-8 py-2 bg-gray-200 hover:bg-gray-300"
    //       >
    //         Cancel
    //       </button>
    //     </Link>
    //     <button
    //       disabled={loading}
    //       type="submit"
    //       className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90"
    //     >
    //       {"Proceed"}
    //       {loading && (
    //         <div role="status" className="pl-3">
    //           <svg
    //             aria-hidden="true"
    //             class="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
    //             viewBox="0 0 100 101"
    //             fill="none"
    //             xmlns="http://www.w3.org/2000/svg"
    //           >
    //             <path
    //               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
    //               fill="currentColor"
    //             />
    //             <path
    //               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
    //               fill="currentFill"
    //             />
    //           </svg>
    //           <span class="sr-only">Loading...</span>
    //         </div>
    //       )}
    //     </button>
    //   </div>
    // </form>
  );
};

export default BulkFormSection;
