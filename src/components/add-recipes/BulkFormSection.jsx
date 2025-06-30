import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // ✅ Import useRouter for query params
import Select from "react-select";
import { serverTimestamp, setDoc } from "firebase/firestore";
import {
  getCategoriesFromFirebase,
  getSupermarkets,
  addProductToFirebase,
  getProductById, // ✅ New function to get product by ID
  updateProductToFirebase,
  saveuserdata, // ✅ New function to update product
} from "../utils/firebasefunctions";
import { toast } from "react-toastify";
import moment from "moment";
import emailjs from "emailjs-com";
import { Plus, X } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useStateValue } from "../../context/StateProvider";
import { collection, writeBatch, doc } from "firebase/firestore";
import { auth, firestored } from "../../firebase/firebaseConfig";
import BulkConfirmation from "../BulkConfirmation";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";

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

  function getUsernameFromEmail(email) {
    if (typeof email !== "string") return "";
    const atIndex = email.indexOf("@");
    return atIndex !== -1 ? email.substring(0, atIndex) : "";
  }

  function gettimestamp(datedata) {
    const utc_days = Math.floor(datedata - 25569); // 25569 = days between 1 Jan 1900 and 1 Jan 1970
    const utc_value = utc_days * 86400; // seconds in a day
    const date_info = new Date(utc_value * 1000); // convert to milliseconds
    // return date_info;
    let newdatedata = moment(date_info).format("DD-MM-YYYY");

    const [day, month, year] = newdatedata.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-based in JS

    const timestamp = date.getTime();

    console.log("Timestamp:", timestamp);
    return timestamp;
  }
  // const handleFileUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const binaryStr = e.target.result;
  //     const workbook = XLSX.read(binaryStr, { type: "binary" });

  //     // Read first sheet
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];

  //     // Convert to JSON
  //     const jsonData = XLSX.utils.sheet_to_json(sheet);

  //     let newdata = [];

  //     jsonData.forEach((item) => {
  //       let datset = {
  //         email: item?.email?.trim(),
  //         username: getUsernameFromEmail(item?.email?.trim()),
  //         subscriptionid: item?.id,
  //         subscriptionexpirydate: gettimestamp(item?.expirydate),
  //         subscriptiontype: item?.type == 0 ? "month" : "year",
  //       };
  //       newdata.push(datset);
  //     });

  //     console.log(JSON.stringify(newdata));

  //     try {
  //       for (const user of newdata) {
  //         const email = user.email;
  //         const username = user.username;
  //         const subscriptionexpirydate = user.subscriptionexpirydate;
  //         const subscriptiontype = user.subscriptiontype;

  //         const subscriptionid = user.subscriptionid;
  //         if (!email) continue;

  //         const charset =
  //           "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  //         let password = "";

  //         for (let i = 0; i < 8; i++) {
  //           const randomIndex = Math.floor(Math.random() * charset.length);
  //           password += charset[randomIndex];
  //         }

  //         try {
  //           await createUserWithEmailAndPassword(auth, email, password)
  //             .then(async (userCredential) => {
  //               const user = userCredential.user;

  //               // Profile picture as empty string
  //               let data = {
  //                 id: user?.uid,
  //                 username: username,
  //                 email: email,
  //                 subscriptionid: subscriptionid,
  //                 createdAt: Date.now(),
  //                 generatedPassword: password,
  //                 olderuser: true,
  //                 usertype: "Client",
  //                 subscriptionexpirydate: subscriptionexpirydate,
  //                 subscriptiontype: subscriptiontype,
  //               };

  //               await saveuserdata(data, user?.uid).then(async (response) => {
  //                 console.log("User data response: ", response);
  //                 if (response === "success") {
  //                   const templateParams = {
  //                     email: email,
  //                     message: `email: ${data.email} password: ${password}`,
  //                   };

  //                   await emailjs
  //                     .send(
  //                       "service_5z77uef", // Replace with your Service ID
  //                       "template_felqroq", // Replace with your Template ID
  //                       templateParams,
  //                       "reWowgm4fTZaLSeML" // Replace with your User ID
  //                     )
  //                     .then((response) => {
  //                       console.log("SUCCESS!", response.status, response.text);
  //                     })
  //                     .catch((err) => {
  //                       console.error("FAILED...", err);
  //                     });

  //                   console.log(`✅ Created user: ${email}`);

  //                   // navigate("/");
  //                 } else {
  //                   toast.error(response);
  //                 }
  //               });
  //             })
  //             .catch((error) => {
  //               toast.error(error.message);
  //             });
  //         } catch (error) {
  //           console.error(`❌ Failed to create user ${email}:`, error.message);
  //         }
  //       }

  //       console.log("✅ All users processed.");
  //       toast.success("users uploaded successfully!");
  //     } catch (error) {
  //       console.error("Error uploading data:", error);
  //       toast.error("Error uploading users");
  //       setIsUploading(false);
  //       setmodal(false);
  //     }
  //   };
  //   reader.readAsBinaryString(file);
  // };

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
