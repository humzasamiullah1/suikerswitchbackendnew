import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // ✅ Import useRouter for query params
import Select from "react-select";
import { serverTimestamp } from "firebase/firestore";
import {
  getCategoriesFromFirebase,
  getSupermarkets,
  addProductToFirebase,
  getProductById, // ✅ New function to get product by ID
  updateProductToFirebase,
  getRecipe, // ✅ New function to update product
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Read first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      let newdata = [];

      //   const groupedByMenu = {};

      //   jsonData.forEach((row) => {
      //     const { Menuname, Day, Categorie, Recipetitle, Imageurl } = row;
      //     if (!Menuname || !Day) return;

      //     if (!groupedByMenu[Menuname]) {
      //       groupedByMenu[Menuname] = {
      //         Imageurls: new Set(),
      //         WeeklyMenu: {},
      //       };
      //     }

      //     if (Imageurl) {
      //       groupedByMenu[Menuname].Imageurls.add(Imageurl);
      //     }

      //     if (!groupedByMenu[Menuname].WeeklyMenu[Day]) {
      //       groupedByMenu[Menuname].WeeklyMenu[Day] = [];
      //     }

      //     groupedByMenu[Menuname].WeeklyMenu[Day].push({
      //       categorie: Categorie,
      //       recipetitle: Recipetitle,
      //     });
      //   });

      //   const result = Object.entries(groupedByMenu).map(
      //     ([menuname, { Imageurls, WeeklyMenu }]) => ({
      //       Menuname: menuname,
      //       Imageurls: Array.from(Imageurls),
      //       WeeklyMenu,
      //     })
      //   );
      //   console.log("result " + JSON.stringify(result));
      //   const recipeedata = await getRecipe();
      //   console.log("recipe", JSON.stringify(recipeedata));
      //   //   let finaldata = [...result]
      //   //   for(const key in finaldata){
      //   //     if(finaldata[key]?.WeeklyMenu?.Maandag != undefined){
      //   //         for(const innerkey in finaldata[key]?.WeeklyMenu?.Maandag){

      //   //         }
      //   //     }
      //   //   }

      const findRecipe = (title) => {
        return recipeedata.find((r) => r.description === title);
      };

      const recipeedata = await getRecipe();
      console.log("recipe", JSON.stringify(recipeedata));
      const groupedByMenu = {};

      //   jsonData.forEach((row) => {
      //     const { Menuname, Day, Categorie, Recipetitle, Imageurl } = row;

      //     if (!Menuname || !Day) return;

      //     if (!groupedByMenu[Menuname]) {
      //       groupedByMenu[Menuname] = {
      //         Imageurls: new Set(),
      //         WeeklyMenu: {},
      //       };
      //     }

      //     if (Imageurl) {
      //       groupedByMenu[Menuname].Imageurls.add(Imageurl);
      //     }

      //     if (!groupedByMenu[Menuname].WeeklyMenu[Day]) {
      //       groupedByMenu[Menuname].WeeklyMenu[Day] = [];
      //     }

      //     const recipeMatch = findRecipe(Recipetitle);
      //     const recipe = recipeMatch
      //       ? {
      //           categorie: Categorie,
      //           recipetitle: {
      //             id: recipeMatch.id,
      //             description: recipeMatch.description,
      //             image: recipeMatch.images[0],
      //           },
      //         }
      //       : {
      //           categorie: Categorie,
      //           recipetitle: { id: null, description: Recipetitle, image: null },
      //         };

      //     groupedByMenu[Menuname].WeeklyMenu[Day].push(recipe);
      //   });

      //   const result = Object.entries(groupedByMenu).map(
      //     ([menuname, { Imageurls, WeeklyMenu }]) => ({
      //       Menuname: menuname,
      //       Imageurls: Array.from(Imageurls),
      //       WeeklyMenu,
      //     })
      //   );

      jsonData.forEach((row) => {
        const { Menuname, Day, Categorie, Recipetitle, Imageurl } = row;

        if (!Menuname || !Day) return;

        if (!groupedByMenu[Menuname]) {
          groupedByMenu[Menuname] = {
            Imageurls: new Set(),
            WeeklyMenu: {},
          };
        }

        if (Imageurl) {
          groupedByMenu[Menuname].Imageurls.add(Imageurl);
        }

        if (!groupedByMenu[Menuname].WeeklyMenu[Day]) {
          groupedByMenu[Menuname].WeeklyMenu[Day] = [];
        }

        const recipeMatch = findRecipe(Recipetitle);
        const recipe = recipeMatch
          ? {
              category: Categorie,
              recipe: {
                id: recipeMatch.id,
                description: recipeMatch.description,
                image: recipeMatch.images, // <-- Keep full image array
              },
            }
          : {
              category: Categorie,
              recipe: {
                id: null,
                description: Recipetitle,
                image: [],
              },
            };

        groupedByMenu[Menuname].WeeklyMenu[Day].push(recipe);
      });

      const result = Object.entries(groupedByMenu).map(
        ([menuname, { Imageurls, WeeklyMenu }]) => ({
          Menuname: menuname,
          Imageurls: Array.from(Imageurls),
          WeeklyMenu,
        })
      );

      console.log("result recipeppe" + JSON.stringify(result));
      result.forEach((item) => {
        let datset = {
          title: item?.Menuname,
          images: item?.Imageurls,
          createdAt: new Date(),
          timestamp: Date.now(),
          WeeklyMenu: item.WeeklyMenu ? item.WeeklyMenu : {},
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
    try {
      setIsUploading(true);
      setProgress(0);
      let newdata = [];
      const batch = writeBatch(firestored);
      const collectionRef = collection(firestored, "weeklymenu"); // Replace with your Firestore collection name

      data.forEach((item, index) => {
        const newDocRef = doc(collectionRef); // Auto-generate document ID
        const docId = newDocRef.id;

        let datset = { ...item };
        datset["id"] = docId;
        newdata.push(datset);
        batch.set(newDocRef, datset);
        setProgress(((index + 1) / data.length) * 100);
      });

      await batch.commit();
      console.log(JSON.stringify(newdata));
      console.log("Bulk upload successful!");
      setIsUploading(false);
      setmodal(false);
      toast.success("Weekly Menu uploaded successfully!");
      setTimeout(() => {
        navigate("/dashboard/weekly-menu");
      }, 3000);
    } catch (error) {
      console.error("Error uploading data:", error);

      toast.error("Error uploading products");
      setIsUploading(false);
      setmodal(false);
    }

    // setIsUploading(true);
    // setProgress(0);

    // const collectionRef = collection(firestored, "products");
    // let newdata = [];

    // try {
    //   const batchSize = 500;
    //   let batch = writeBatch(firestored);

    //   for (let i = 0; i < data.length; i++) {
    //     const item = data[i];
    //     const newDocRef = doc(collectionRef); // Auto-generate ID
    //     const docId = newDocRef.id;

    //     const datset = {
    //       ...item,
    //       id: docId,
    //       // categories: item?.Category?.split(",") || [],
    //       // supermarkets: item?.Supermarket?.split(",") || [],
    //       // imageurls: [item?.ImageURL],
    //     };

    //     newdata.push(datset);
    //     batch.set(newDocRef, datset);

    //     setProgress(((i + 1) / data.length) * 100);

    //     // Commit every 500 docs or at the end
    //     if ((i + 1) % batchSize === 0 || i + 1 === data.length) {
    //       await batch.commit();
    //       batch = writeBatch(firestored); // Start new batch
    //     }
    //   }

    //   console.log(JSON.stringify(newdata));
    //   console.log("Bulk upload successful!");

    //   setIsUploading(false);
    //   setmodal(false);
    //   toast.success("Products uploaded successfully!");
    //   navigate("/dashboard/products");
    // } catch (error) {
    //   console.error("Error uploading data:", error);
    //   toast.error("Error uploading products");
    //   setIsUploading(false);
    //   setmodal(false);
    // }
  };

  return (
    <div className="w-full py-[20px] ">
      <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}

      <BulkConfirmation
        visible={modal}
        data={data}
        bulktype={"weeklymenu"}
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
