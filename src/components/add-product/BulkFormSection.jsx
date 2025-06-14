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

  function generateSearchKeywords(text) {
    const MIN_SUBSTRING_LENGTH = 2; // skip single letters
    const MAX_KEYWORDS = 300; // limit total count

    const keywords = new Set();
    const words = text.toLowerCase().split(/\s+/);

    for (const word of words) {
      for (let i = 0; i < word.length; i++) {
        for (let j = i + MIN_SUBSTRING_LENGTH; j <= word.length; j++) {
          keywords.add(word.slice(i, j));
        }
      }
    }

    // Add full-word combinations
    for (let i = 0; i < words.length; i++) {
      let combo = words[i];
      keywords.add(combo);
      for (let j = i + 1; j < words.length; j++) {
        combo += " " + words[j];
        keywords.add(combo);
      }
    }

    const fullText = words.join(" ");
    for (let i = 1; i <= fullText.length; i++) {
      const prefix = fullText.slice(0, i);
      if (prefix.length >= MIN_SUBSTRING_LENGTH && prefix.includes(" ")) {
        keywords.add(prefix);
      }
    }

    return Array.from(keywords).slice(0, MAX_KEYWORDS); // cap at 100
  }

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

      let newdata = [];

      jsonData.forEach((item) => {
        const categories = item?.Category ? item?.Category?.split(",") : [];
        const subcategories = item?.Subcategories
          ? item?.Subcategories?.split(",")
          : [];

        const supermarkets = item?.Supermarket
          ? item?.Supermarket?.split(",")
          : [];
        const ingredients = item?.Ingredients ? item?.Ingredients : [];
        let imageurls = [];
        imageurls.push(item?.Imageurl);
        let datset = {
          productName: item?.ProductName,
          productNameLowercase: item?.ProductName?.toLowerCase(),
          productsearcharray: generateSearchKeywords(item?.ProductName),
          selectedCategories: categories.map((cat) => cat.trim()),
          selectedSubCategories: subcategories.map((subcat) => subcat.trim()),
          selectedSupermarkets: supermarkets.map((sup) => sup.trim()),
          images: imageurls,
          timestamp: Date.now(),
          createdAt: new Date(),
          favourites: [],
          description: item?.ProductInformation ? item?.ProductInformation : "",
          ingredients: ingredients,
        };
        newdata.push(datset);
      });
      setData(newdata);
      setmodal(true);
      //   bulkUpload(jsonData)
    };
    reader.readAsBinaryString(file);
  };

  const bulkUpload = async () => {
    //     try {
    //         setIsUploading(true);
    //         setProgress(0);
    //         let newdata = []
    //       const batch = writeBatch(firestored);
    //       const collectionRef = collection(firestored, "products"); // Replace with your Firestore collection name

    //       data.forEach((item, index) => {
    //         const newDocRef = doc(collectionRef); // Auto-generate document ID
    //         const docId = newDocRef.id

    //         const categories = item?.Category ? item?.Category?.split(",") : []
    //         const supermarkets = item?.Supermarket ?  item?.Supermarket?.split(","): []
    //         let imageurls = []
    //         imageurls.push(item?.ImageURL)
    // let datset = {...item}
    // datset["id"] = docId
    // newdata.push(datset)
    //         batch.set(newDocRef, datset);
    //         setProgress(((index + 1) / data.length) * 100);
    //       });

    //       await batch.commit();
    //       console.log( JSON.stringify(newdata));
    //       console.log("Bulk upload successful!" );
    //       setIsUploading(false);
    //       setmodal(false)
    //       toast.success("Products uploaded successfully!");
    //       navigate("/dashboard/products");
    //     } catch (error) {
    //       console.error("Error uploading data:", error);

    //             toast.error("Error uploading products");
    //       setIsUploading(false);
    //       setmodal(false)
    //     }

    setIsUploading(true);
    setProgress(0);

    const collectionRef = collection(firestored, "products");
    let newdata = [];

    try {
      const batchSize = 500;
      let batch = writeBatch(firestored);

      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const newDocRef = doc(collectionRef); // Auto-generate ID
        const docId = newDocRef.id;

        const datset = {
          ...item,
          id: docId,
          // categories: item?.Category?.split(",") || [],
          // supermarkets: item?.Supermarket?.split(",") || [],
          // imageurls: [item?.ImageURL],
        };

        newdata.push(datset);
        batch.set(newDocRef, datset);

        setProgress(((i + 1) / data.length) * 100);

        // Commit every 500 docs or at the end
        if ((i + 1) % batchSize === 0 || i + 1 === data.length) {
          await batch.commit();
          batch = writeBatch(firestored); // Start new batch
        }
      }

      console.log(JSON.stringify(newdata));
      console.log("Bulk upload successful!");

      setIsUploading(false);
      setmodal(false);
      toast.success("Products uploaded successfully!");
      navigate("/dashboard/products");
    } catch (error) {
      console.error("Error uploading data:", error);
      toast.error("Error uploading products");
      setIsUploading(false);
      setmodal(false);
    }
  };

  return (
    <div className="w-full py-[20px] ">
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <BulkConfirmation
        visible={modal}
        data={data}
        activateoutsidecontainerclick={() => {
          setmodal(false);
        }}
        upload={() => {
          bulkUpload();
        }}
        isUploading={isUploading}
        progress={progress}
      />
    </div>
  );
};

export default BulkFormSection;
