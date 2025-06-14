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
import { useStateValue } from "../../context/StateProvider";
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
  const [{ user }] = useStateValue();

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
        let imageurls = [];
        if (item?.Logurl != undefined) {
          imageurls.push(item?.Logurl);
        }
        let categories = item?.Category ? item?.Category?.split(",") : [];
        let Tags = item?.Tags ? item?.Tags?.split(",") : [];
        let Ingredients = item?.Ingredients
          ? item?.Ingredients?.split(",")
          : [];

        let datset = {
          category: categories.map((cat) => cat.toString().trim()),
          content: item?.Htmltext ? item?.Htmltext : "",
          description: item?.Shortdescription ? item?.Shortdescription : "",
          descriptionLowercase: item?.Shortdescription
            ? item?.Shortdescription.toLowerCase()
            : "",
          descriptionsearcharray: generateSearchKeywords(
            item?.Shortdescription
          ),
          images: imageurls,
          ingredients: Ingredients.map((cat) => cat.trim()),
          tags: Tags.map((cat) => cat.trim()),
          createdAt: new Date(),
          timestamp: Date.now(),
          userId: user?.id || "Unknown",
          userType: user?.usertype || "Guest",
          favourites: [],
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
    setIsUploading(true);
    setProgress(0);

    const collectionRef = collection(firestored, "recipe");
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
          bulkupload: true,
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
      toast.success("Recipes uploaded successfully!");
      setTimeout(() => {
        navigate("/dashboard/recipies");
      }, 3000);
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
        bulktype={"recipee"}
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
