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
import BulkConfirmation from "../BulkConfirmation";

const BulkFormSection = () => {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modal, setmodal] = useState(false);
      const [progress, setProgress] = useState(0);
      const [isUploading, setIsUploading] = useState(false);
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

      let newdata = []
      jsonData.forEach((item) => {
        const categories = item?.Category ? item?.Category?.split(",") : []
        const supermarkets = item?.Supermarket ?  item?.Supermarket?.split(","): []
        let imageurls = []
        imageurls.push(item?.ImageURL)
let datset = {
    productName: item?.ProductName,
    selectedCategories: categories.map((cat) => cat.trim()),
    selectedSupermarkets: supermarkets.map((sup) => sup.trim()),
    images: imageurls,
    timestamp: serverTimestamp(),
    createdAt: new Date(),

}
newdata.push(datset)

      });
      setData(newdata);
      setmodal(true)
    //   bulkUpload(jsonData)
    };
    reader.readAsBinaryString(file);
  };

  const bulkUpload = async () => {
    try {
        setIsUploading(true);
        setProgress(0);
        let newdata = []
      const batch = writeBatch(firestored);
      const collectionRef = collection(firestored, "products"); // Replace with your Firestore collection name


      data.forEach((item, index) => {
        const newDocRef = doc(collectionRef); // Auto-generate document ID
        const docId = newDocRef.id

        const categories = item?.Category ? item?.Category?.split(",") : []
        const supermarkets = item?.Supermarket ?  item?.Supermarket?.split(","): []
        let imageurls = []
        imageurls.push(item?.ImageURL)
// let datset = {
//     productName: item?.ProductName,
//     selectedCategories: categories.map((cat) => cat.trim()),
//     selectedSupermarkets: supermarkets.map((sup) => sup.trim()),
//     images: imageurls,
//     timestamp: serverTimestamp(),
//     createdAt: new Date(),
//     id: docId
// }
newdata.push(item)
        batch.set(newDocRef, item);
        setProgress(((index + 1) / data.length) * 100);
      });

      await batch.commit();
      console.log( JSON.stringify(newdata));
      console.log("Bulk upload successful!" );
      setIsUploading(false);
      setmodal(false)
      toast.success("Products uploaded successfully!");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error uploading data:", error);

            toast.error("Error uploading products");
      setIsUploading(false);
      setmodal(false)
    }
  };

  return (
    <div className="w-full py-[20px] ">
    <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}


    <BulkConfirmation
visible = {modal}
data = {data}
activateoutsidecontainerclick = {()=>{
 setmodal(false)
}}
upload = {()=>{
    bulkUpload()

    }}
    isUploading = {isUploading}
    progress = {progress}
/>
  </div>

  );
};

export default BulkFormSection;
