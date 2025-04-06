import { getFirestore, collection, doc, getDocs, query, orderBy, arrayUnion, updateDoc, getDoc, where, documentId, onSnapshot, setDoc, addDoc, getAggregateFromServer, sum, limit, or, deleteDoc, arrayRemove, serverTimestamp  } from "firebase/firestore"
import { firestored, app, storage } from "../../firebase/firebaseConfig"
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { get } from "firebase/database";
// import moment from 'moment';
// import DatePicker from "react-horizontal-datepicker";


////////////////actual//////////////////////
const auth = getAuth();

export const saveuserdata = async (data, uid) => {

  return await setDoc(doc(firestored, "users", `${uid}`), data, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })
}

// export const saveuserdata = async (userData, userId) => {
//   try {
//     const db = getDatabase();
//     await set(ref(db, `users/${userId}`), userData);
//     console.log("User data saved successfully!");
//     return "success"; // Ensure this string is returned
//   } catch (error) {
//     console.error("Error saving user data:", error);
//     return error.message; // Return error message for debugging
//   }
// };


export const userlogin = async (email, password) => {

  return await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return user
      // ...
    })
    .catch((err) => {
      return err
    });
}



export const uploadFormData = async (formData, imageFiles) => {
  try {
   // Sare images upload karo aur unke URLs le lo
    const imageUploadPromises = imageFiles.map((file) => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    // Firestore me ek naye document ka reference banao (yahan custom ID generate hogi)
    const docRef = doc(collection(firestored, "supermarkets"));
    const docId = docRef.id; // Yeh document ki generated ID hai

    // Firestore me data save karo
    await setDoc(docRef, {
      ...formData,
      id: docId, // Document ki ID bhi save ho rahi hai
      images: imageUrls, // Firebase se milne wale URLs yahan save honge
      createdAt: new Date(),
    });

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
};

export const getSupermarketById = async (id) => {
  try {
    const supermarketRef = doc(firestored, "supermarkets", id);
    const supermarketSnap = await getDoc(supermarketRef);

    if (supermarketSnap.exists()) {
      return { id: supermarketSnap.id, ...supermarketSnap.data() };
    } else {
      throw new Error("Supermarket not found");
    }
  } catch (error) {
    console.error("Error fetching supermarket:", error);
    throw error;
  }
};

// Function to update a supermarket

export const updateSupermarket = async (id, formData, newImageFiles) => {
  try {
    // Fetch existing document data
    const docRef = doc(firestored, "supermarkets", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }

    const data = docSnap.data();
    let imageURLs = data.images || []; // Existing images

    // If a new image is uploaded, replace the old one
    if (newImageFiles.length > 0) {
      const oldImageURL = imageURLs[0]; // First image

      // Delete old image if it exists
      if (oldImageURL && oldImageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imageRef = ref(storage, decodeURIComponent(oldImageURL.split("/o/")[1].split("?alt=")[0])); // Ensure correct decoding
        await deleteObject(imageRef);
      }

      // Upload new image
      const newImageFile = newImageFiles[0];
      const storageRef = ref(storage, `supermarkets/${id}/${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      const newImageURL = await getDownloadURL(storageRef);

      imageURLs = [newImageURL]; // Replace with new image URL
    }

    // Update Firestore document
    await updateDoc(docRef, {
      supermarketName: formData.supermarketName,
      description: formData.description,
      images: imageURLs,
    });

    console.log("Supermarket updated successfully");
  } catch (error) {
    console.error("Error updating supermarket:", error);
  }
};

export const deleteSupermarket = async (id) => {
  try {
    // Pehle document fetch kren
    const docRef = doc(firestored, "supermarkets", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Supermarket not found");
      return;
    }

    const data = docSnap.data();
    const imageURLs = data.images || [];

    // Firebase Storage se sabhi images delete karna
    for (const imageURL of imageURLs) {
      if (imageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imagePath = decodeURIComponent(imageURL.split("/o/")[1].split("?alt=")[0]);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    }

    // Firestore se document delete karna
    await deleteDoc(docRef);
    console.log("Supermarket deleted successfully");
  } catch (error) {
    console.error("Error deleting supermarket:", error);
  }
};


export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {

    const storageRef = ref(storage, `supermarket-logos/${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {


        console.log("this is the errro" + error)
        reject(error)},
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });



};


export const getSupermarkets = async () => {
  const supermarketsRef = collection(firestored, "supermarkets");
  const q = query(supermarketsRef, orderBy("timestamp", "desc")); // Sorting by timestamp (latest first)

  const querySnapshot = await getDocs(q);
  const supermarkets = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return supermarkets;
};

// ✅ Categories ko Firestore mein bulk add/update karne ka function
export const addOrUpdateCategories = async (categories) => {
  try {
    const categoryCollection = collection(firestored, "categories");

    for (const category of categories) {
      if (category.id) {
        // ✅ Agar category already exist karti hai, toh update karein
        const categoryRef = doc(firestored, "categories", category.id);
        await updateDoc(categoryRef, { name: category.name });
      } else {
        // ✅ Naya category add karein
        const docRef = await addDoc(categoryCollection, {
          name: category.name,
          createdAt: new Date(),
        });
        category.id = docRef.id; // ✅ ID ko frontend pe update karein
      }
    }

    return categories; // ✅ Updated list return karein
  } catch (error) {
    console.error("Error in bulk add/update:", error);
    throw error;
  }
};

// ✅ Firestore se categories fetch karne ka function
export const getCategoriesFromFirebase = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestored, "categories"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// ✅ Firestore se category delete karne ka function
export const deleteCategoryFromFirebase = async (categoryId) => {
  try {
    const categoryRef = doc(firestored, "categories", categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

const uploadImageToFirebase = async (file) => {
  const storageRef = ref(storage, `product_images/${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef); // 🔥 YEH FIREBASE LINK DEGA
};

export const getProductById = async (id) => {
  try {
    const productRef = doc(firestored, "products", id);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    } else {
      throw new Error("product not found");
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const updateProductToFirebase = async (id, formData, newImageFiles) => {
  try {
    // Fetch existing document data
    const docRef = doc(firestored, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }

    const data = docSnap.data();
    let imageURLs = data.images || []; // Existing images

    // If a new image is uploaded, replace the old one
    if (newImageFiles.length > 0) {
      const oldImageURL = imageURLs[0]; // First image

      // Delete old image if it exists
      if (oldImageURL && oldImageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imageRef = ref(storage, decodeURIComponent(oldImageURL.split("/o/")[1].split("?alt=")[0])); // Ensure correct decoding
        await deleteObject(imageRef);
      }

      // Upload new image
      const newImageFile = newImageFiles[0];
      const storageRef = ref(storage, `products/${id}/${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      const newImageURL = await getDownloadURL(storageRef);

      imageURLs = [newImageURL]; // Replace with new image URL
    }

    // Update Firestore document
    await updateDoc(docRef, {
      productName: formData.productName,
      description: formData.description,
      // content: formData.content,
      selectedCategories: formData.selectedCategories,
      selectedSupermarkets: formData.selectedSupermarkets,
      ingredients: formData.ingredients,
      images: imageURLs,

    });

    console.log("products updated successfully");
  } catch (error) {
    console.error("Error updating products:", error);
  }
};

export const deleteProduct = async (id) => {
  try {
    // Pehle document fetch kren
    const docRef = doc(firestored, "products", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Supermarket not found");
      return;
    }

    const data = docSnap.data();
    const imageURLs = data.images || [];

    // Firebase Storage se sabhi images delete karna
    for (const imageURL of imageURLs) {
      if (imageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imagePath = decodeURIComponent(imageURL.split("/o/")[1].split("?alt=")[0]);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    }

    // Firestore se document delete karna
    await deleteDoc(docRef);
    console.log("products deleted successfully");
  } catch (error) {
    console.error("Error deleting products:", error);
  }
};

export const addProductToFirebase = async (productData, imageFiles) => {
  try {
    // Sare images upload karo aur unke URLs le lo
    const imageUploadPromises = imageFiles.map((file) => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    // Firestore me ek naye document ka reference banao (yahan custom ID generate hogi)
    const docRef = doc(collection(firestored, "products"));
    const docId = docRef.id; // Yeh document ki generated ID hai

    // Firestore me data save karo
    await setDoc(docRef, {
      ...productData,
      id: docId,
      images: imageUrls, // Firebase se milne wale URLs yahan save honge
      createdAt: new Date(),
      favourites: [],
    });

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
};

export const getProducts = async () => {
  const productsRef = collection(firestored, "products");
  const q = query(productsRef, orderBy("timestamp", "desc")); // Sorting by timestamp (latest first)

  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return products;
};

export const uploadImageToBlogFirebase = async (file, folder) => {
  if (!file) return null;
  try {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef); // ✅ Get Firebase Image URL
  } catch (error) {
    console.error("Firebase image upload error:", error);
    return null;
  }
};

export const saveBlogToFirestore = async (formData, imageFiles) => {
  try {
    // Sare images upload karo aur unke URLs le lo
    const imageUploadPromises = imageFiles.map((file) => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    // Firestore me ek naye document ka reference banao (yahan custom ID generate hogi)
    const docRef = doc(collection(firestored, "blogs"));
    const docId = docRef.id; // Yeh document ki generated ID hai

    // Firestore me data save karo
    await setDoc(docRef, {
      ...formData,
      id: docId, // Document ki ID bhi save ho rahi hai
      images: imageUrls, // Firebase se milne wale URLs yahan save honge
      createdAt: new Date(),
    });

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
};

export const deleteBlog = async (id) => {
  try {
    // Pehle document fetch kren
    const docRef = doc(firestored, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Supermarket not found");
      return;
    }

    const data = docSnap.data();
    const imageURLs = data.images || [];

    // Firebase Storage se sabhi images delete karna
    for (const imageURL of imageURLs) {
      if (imageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imagePath = decodeURIComponent(imageURL.split("/o/")[1].split("?alt=")[0]);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    }

    // Firestore se document delete karna
    await deleteDoc(docRef);
    console.log("blogs deleted successfully");
  } catch (error) {
    console.error("Error deleting blogs:", error);
  }
};

export const updateBlogs = async (id, formData, newImageFiles) => {
  try {
    // Fetch existing document data
    const docRef = doc(firestored, "blogs", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }

    const data = docSnap.data();
    let imageURLs = data.images || []; // Existing images

    // If a new image is uploaded, replace the old one
    if (newImageFiles.length > 0) {
      const oldImageURL = imageURLs[0]; // First image

      // Delete old image if it exists
      if (oldImageURL && oldImageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imageRef = ref(storage, decodeURIComponent(oldImageURL.split("/o/")[1].split("?alt=")[0])); // Ensure correct decoding
        await deleteObject(imageRef);
      }

      // Upload new image
      const newImageFile = newImageFiles[0];
      const storageRef = ref(storage, `supermarkets/${id}/${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      const newImageURL = await getDownloadURL(storageRef);

      imageURLs = [newImageURL]; // Replace with new image URL
    }

    // Update Firestore document
    await updateDoc(docRef, {
      content: formData.content,
      description: formData.description,
      images: imageURLs,
    });

    console.log("Blog updated successfully");
  } catch (error) {
    console.error("Error updating supermarket:", error);
  }
};

export const getBlogsById = async (id) => {
  try {
    const blogstRef = doc(firestored, "blogs", id);
    const blogsSnap = await getDoc(blogstRef);

    if (blogsSnap.exists()) {
      return { id: blogsSnap.id, ...blogsSnap.data() };
    } else {
      throw new Error("Blogs not found");
    }
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    throw error;
  }
};

export const getHelpById = async (id) => {
  try {
    const helpElkerRef = doc(firestored, "helpElker", id);
    const helpElkerSnap = await getDoc(helpElkerRef);

    if (helpElkerSnap.exists()) {
      return { id: helpElkerSnap.id, ...helpElkerSnap.data() };
    } else {
      throw new Error("helpElker not found");
    }
  } catch (error) {
    console.error("Error fetching helpElker:", error);
    throw error;
  }
};

export const deleteHelp = async (id) => {
  try {
    // Pehle document fetch kren
    const docRef = doc(firestored, "helpElker", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Supermarket not found");
      return;
    }

    const data = docSnap.data();
    const imageURLs = data.images || [];

    // Firebase Storage se sabhi images delete karna
    for (const imageURL of imageURLs) {
      if (imageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imagePath = decodeURIComponent(imageURL.split("/o/")[1].split("?alt=")[0]);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    }

    // Firestore se document delete karna
    await deleteDoc(docRef);
    console.log("helpElker deleted successfully");
  } catch (error) {
    console.error("Error deleting helpElker:", error);
  }
};

// 🔹 Fetch Blog from Firestore
export const getBlogs = async () => {
  try {
    const q = query(collection(firestored, "blogs"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.docs.forEach((doc) => {
      console.log("Blog Created At:", doc.data().createdAt); // Debugging
    });

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return data;
  } catch (error) {
    console.error("Error fetching blogs: ", error);
    return [];
  }
};




export const fetchBlogById = async (blogId) => {
  try {
    console.log(`🔍 Fetching blog with blogsId: ${blogId}`);

    const blogsCollection = collection(firestored, "blogs");
    const q = query(blogsCollection, where("blogsId", "==", blogId)); // Filter blogsId
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("❌ No such document in Firestore!");
      return null;
    }

    let blogData = null;
    querySnapshot.forEach((doc) => {
      blogData = doc.data();
    });

    console.log("✅ Blog found:", blogData);
    return blogData;
  } catch (error) {
    console.error("🚨 Error fetching blog:", error);
    return null;
  }
};


export const fetchAllBlogs = async () => {
  const querySnapshot = await getDocs(collection(firestored, "blogs"));
  querySnapshot.forEach((doc) => {
    console.log("🔥 Firestore Blog ID:", doc.id); // Sab IDs print hongi
  });
};


export const uploadImageToRecipeFirebase = async (file, folder) => {
  if (!file) return null;
  try {
    const storageRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef); // ✅ Get Firebase Image URL
  } catch (error) {
    console.error("Firebase image upload error:", error);
    return null;
  }
};

export const saveRecipeToFirestore = async (formData, imageFiles) => {
  try {
    // Sare images upload karo aur unke URLs le lo
    const imageUploadPromises = imageFiles.map((file) => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    // Firestore me ek naye document ka reference banao (yahan custom ID generate hogi)
    const docRef = doc(collection(firestored, "recipe"));
    const docId = docRef.id; // Yeh document ki generated ID hai

    // Firestore me data save karo
    await setDoc(docRef, {
      ...formData,
      id: docId, // Document ki ID bhi save ho rahi hai
      images: imageUrls, // Firebase se milne wale URLs yahan save honge
      createdAt: new Date(),
      timestamp: Date.now(),
      favourites: [],
    });

    return { success: true, id: docId };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
};

export const updateRecipe = async (id, formData, newImageFiles) => {
  try {
    // Fetch existing document data
    const docRef = doc(firestored, "recipe", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }

    const data = docSnap.data();
    let imageURLs = data.images || []; // Existing images

    // If a new image is uploaded, replace the old one
    if (newImageFiles.length > 0) {
      const oldImageURL = imageURLs[0]; // First image

      // Delete old image if it exists
      if (oldImageURL && oldImageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imageRef = ref(storage, decodeURIComponent(oldImageURL.split("/o/")[1].split("?alt=")[0])); // Ensure correct decoding
        await deleteObject(imageRef);
      }

      // Upload new image
      const newImageFile = newImageFiles[0];
      const storageRef = ref(storage, `supermarkets/${id}/${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      const newImageURL = await getDownloadURL(storageRef);

      imageURLs = [newImageURL]; // Replace with new image URL
    }

    // Update Firestore document
    await updateDoc(docRef, {
      content: formData.content,
      description: formData.description,
      images: imageURLs,
    });

    console.log("recipe updated successfully");
  } catch (error) {
    console.error("Error updating recipe:", error);
  }
};

export const AcceptHelpElker = async (id, formData) => {
  try {
    // Fetch existing document data
    const docRef = doc(firestored, "helpElker", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Document not found");
      return;
    }

    // Update Firestore document
    await updateDoc(docRef, {
      ...formData
    });

    console.log("helpElker updated successfully");
  } catch (error) {
    console.error("Error updating helpElker:", error);
  }
};

export const deleteRecipe = async (id) => {
  try {
    // Pehle document fetch kren
    const docRef = doc(firestored, "recipe", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.log("Recipe not found");
      return;
    }

    const data = docSnap.data();
    const imageURLs = data.images || [];

    // Firebase Storage se sabhi images delete karna
    for (const imageURL of imageURLs) {
      if (imageURL.startsWith("https://firebasestorage.googleapis.com")) {
        const imagePath = decodeURIComponent(imageURL.split("/o/")[1].split("?alt=")[0]);
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
      }
    }

    // Firestore se document delete karna
    await deleteDoc(docRef);
    console.log("Recipe deleted successfully");
  } catch (error) {
    console.error("Error deleting Recipe:", error);
  }
};

export const getRecipe = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestored, "recipe"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('recipe data',data)
    return data;
  } catch (error) {
    console.error("Error fetching recipe: ", error);
    return [];
  }
};

export const getRecipeById = async (id) => {
  try {
    const recipetRef = doc(firestored, "recipe", id);
    const recipeSnap = await getDoc(recipetRef);

    if (recipeSnap.exists()) {
      return { id: recipeSnap.id, ...recipeSnap.data() };
    } else {
      throw new Error("recipe not found");
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw error;
  }
};

export const fetchRecipeById = async (recipeId) => {
  try {
    console.log(`🔍 Fetching blog with recipeId: ${recipeId}`);

    const blogsCollection = collection(firestored, "recipe");
    const q = query(blogsCollection, where("recipeId", "==", recipeId)); // Filter blogsId
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("❌ No such document in Firestore!");
      return null;
    }

    let recipeData = null;
    querySnapshot.forEach((doc) => {
      recipeData = doc.data();
    });

    console.log("✅ Blog found:", recipeData);
    return recipeData;
  } catch (error) {
    console.error("🚨 Error fetching blog:", error);
    return null;
  }
};

export const fetchUserById = async (id) => {
  try {
    console.log(`🔍 Fetching blog with user id: ${id}`);

    const blogsCollection = collection(firestored, "users");
    const q = query(blogsCollection, where("id", "==", id)); // Filter blogsId
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("❌ No such document in Firestore!");
      return null;
    }

    let userData = null;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });

    console.log("✅ Blog found:", userData);
    return userData;
  } catch (error) {
    console.error("🚨 Error fetching blog:", error);
    return null;
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const userRef = doc(firestored, "users", userId);
    await updateDoc(userRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating profile:", error);
    return false;
  }
};

export const uploadUserImage = async (file, userId) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const getUser = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestored, "users"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('users data',data)
    return data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};

export const getHelpElker = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestored, "helpElker"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('helpElker data',data)
    return data;
  } catch (error) {
    console.error("Error fetching helpElker: ", error);
    return [];
  }
};

// export const getuserinformation = async (collection, uid) => {
//   try {
//     const userRef = ref(firestored, `${collection}/${uid}`);
//     const snapshot = await get(userRef);

//     if (snapshot.exists()) {
//       console.log("User exists in Firebase:", snapshot.val());
//       return snapshot.val();
//     } else {
//       console.warn("User not found in Firebase!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return null;
//   }
// };






export const getuserinformation = async (collectionname, documentId) => {
  try {
    const docRef = doc(firestored, collectionname, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("User Data:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
};

export const getAllUserItems = async (table, parameter, comparison, value) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value))

  );

  return items.docs.map((doc) => doc.data());
}






export const getAllSlotsWhere = async (table, parameter, comparison, value, parameter1, comparison1, value1, parameter2, comparison2, value2) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where(parameter1, comparison1, value1), where(parameter2, comparison2, value2))

  );

  return items.docs.map((doc) => doc.data());
}


export const getAllSlotsWherex4 = async (table, parameter, comparison, value, parameter1, comparison1, value1, parameter2, comparison2, value2, parameter3, comparison3, value3) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where(parameter1, comparison1, value1), where(parameter2, comparison2, value2), where(parameter3, comparison3, value3))

  );

  return items.docs.map((doc) => doc.data());
}
export const getAllSlotsWherex3 = async (table, parameter, comparison, value, parameter1, comparison1, value1, parameter2, comparison2, value2, parameter3, comparison3, value3) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where(parameter1, comparison1, value1), where(parameter1, comparison1, value1))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllSlotsForChecking = async (table, parameter, comparison, value, parameter1, comparison1, value1,) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where(parameter1, comparison1, value1), where("status", "==", "Accepted"))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllEmployeeandSupervisors = async (table, parameter, comparison, value, value2) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, "in", [value, value2]))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllEmployeeandSupervisorsforclient = async (table, parameter, comparison, value, value2, clientid) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, "in", [value, value2]), where("createdby", "==", clientid))

  );

  return items.docs.map((doc) => doc.data());
}


export const getAllApprovedleaves = async (table, parameter, data) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, "in", data))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllCleanerShifts = async (table, cleanerid, date) => {
  const items = await getDocs(
    query(collection(firestored, table), where("cleaningshiftid", "==", cleanerid),  where("sheduleddate", "==", date))

  );

  return items.docs.map((doc) => doc.data());
}




export const getAllEmployeeandSupervisorsforsupervisor = async (table, parameter, comparison, value, value2, creatorid) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, "in", [value, value2]), where("createdby", "==", creatorid))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllEmployeeForProject = async (table, parameter, comparison, value, projectid) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where("projectassigned", comparison, projectid))

  );

  return items.docs.map((doc) => doc.data());
}


export const getAllEmployeeForClient = async (table, parameter, comparison, value, projectid) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where("createdby", comparison, projectid))

  );

  return items.docs.map((doc) => doc.data());
}

export const getallemployeesslotsdata = async (table, projectid, scheduledate) => {


  let data = [];
  let items = []
  if(projectid == undefined){
     items = await getDocs(
      query(collection(firestored, table), where("sheduleddate", "==", scheduledate))
    );
  }else{
     items = await getDocs(
      query(collection(firestored, table), where("sheduleddate", "==", scheduledate), where("projectid", "==", projectid))

    );
  }
  items.docs.map((doc) => {
    if (doc.exists) {
      let newdata = doc.data()
      newdata["recordid"] = doc.id
      data.push(newdata);
    }
});
return data;
}


export const getallcleanerslotsdata = async (table, projectid) => {


  let data = [];
  let items = []
  if(projectid === undefined){
     items = await getDocs(
      query(collection(firestored, table))
    );
  }else{
     items = await getDocs(
      query(collection(firestored, table),  where("projectid", "==", projectid))

    );
  }
  items.docs.map((doc) => {
    if (doc.exists) {
      let newdata = doc.data()
      newdata["recordid"] = doc.id
      data.push(newdata);
    }
});
return data;
}

export const getAllProjectsforSupervisor = async (table, projectids) => {
  const items = await getDocs(
    query(collection(firestored, table),  where("id", "in", projectids))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllChats = async (table) => {
  const items = await getDocs(
    collection(firestored, table))



  return items.docs.map((doc) => doc.data());
}

export const getAdminChats = async (table, id) => {
  const items = await getDocs(
    query(collection(firestored, table), where("admin", "==", id)))



  return items.docs.map((doc) => doc.data());
}



export const getAllEmployeeTasks = async (table, parameter, comparison, value) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllEmployeeslotfordate = async (table, parameter, comparison, value,  parameter1, comparison1, value1) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), where(parameter1, comparison1, value1))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllEmployeesCleaningShifts = async (table, parameter, comparison, value) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value))

  );

  return items.docs.map((doc) => doc.data());
}


export const deleteDocument = async (table, docId) => {
  try {
    // Reference to the document
    const docRef = doc(firestored, table, docId.toString());

    // Delete the document
    await deleteDoc(docRef);

    return true
  } catch (error) {
    console.error("Error deleting document: ", error);
        return false
  }
};

export const getAllEmployeeTasksByOrder = async (table, parameter, comparison, value, orderparameter, ordertype) => {
  const items = await getDocs(
    query(collection(firestored, table), where(parameter, comparison, value), orderBy(orderparameter, ordertype))

  );

  return items.docs.map((doc) => doc.data());
}


export const getAllBlogsPosts = async (table, orderparameter, ordertype,) => {
  const items = await getDocs(
    query(collection(firestored, table), orderBy(orderparameter, ordertype))

  );

  return items.docs.map((doc) => doc.data());
}


export const gethighestWmployeeID = async (table, orderparameter, ordertype,id) => {
  const items = await getDocs(
    query(collection(firestored, table), where("createdby", "==", id), orderBy(orderparameter, ordertype), limit(1))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllBlogsPostsAdmin = async (table, orderparameter, ordertype, adminid) => {
  const items = await getDocs(
    query(collection(firestored, table), where("admin", "==", adminid), orderBy(orderparameter, ordertype))

  );

  return items.docs.map((doc) => doc.data());
}


export const getAllBlogsPostsClient = async (table, orderparameter, ordertype, adminid) => {
  const items = await getDocs(
    query(collection(firestored, table), where("admin", "==", adminid), orderBy(orderparameter, ordertype))

  );

  return items.docs.map((doc) => doc.data());
}

export const getAllData = async (table) => {
  const items = await getDocs(
    query(collection(firestored, table))

  );

  return items.docs.map((doc) => doc.data());
}


export const saveitem = async (table, data) => {

  return await setDoc(doc(firestored, table, `${Date.now()}`), data, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })

}

export const saveitemnew = async (table, data) => {

  return await setDoc(doc(firestored, table,data.schedulecreationdate.toString()), data, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })

}

export const saveitemwithid = async (table, id, data) => {

  return await setDoc(doc(firestored, table, id), data, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })

}


export const updateItem = async (table, id, data) => {

  return await setDoc(doc(firestored, table, id.toString()), data, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })

}




export const updateNestedItem = async (table, id, innertable, data, innerid) => {

  return await setDoc(doc(firestored, `${table}/${id}/${innertable}`, innerid.toString()), data, { merge: true })
    .then(() => {
      return "success";
    })
    .catch((err) => {
      return err;
    })



}
export const updateNestedArrayItem = async (table, id, innertable, data, innerid) => {

  return await setDoc(doc(firestored, `${table}/${id}/${innertable}`, innerid.toString()), { slots: arrayUnion(data) }, { merge: true })
    .then(() => {
      return "success";
    })
    .catch((err) => {
      return err;
    })



}




export const resetpassword = async (email) => {

  return await sendPasswordResetEmail(auth, email)
    .then((response) => {

      return "success"

    })
    .catch((err) => {
      return err
    });
}




export const updateNestedItemcheckout = async (table, id, innertable, data, innerid) => {

  return await setDoc(doc(firestored, `${table}/${id}/${innertable}/${innerid}`), data, { merge: true })
    .then(() => {
      return "success";
    })
    .catch((err) => {
      return err;
    })



}

export const getNestedItem = async (table, id, innertable) => {


  const items = await getDocs(
    query(collection(firestored, `${table}/${id}/${innertable}`), orderBy("checkindatetime", "desc"), limit(1)))



  return items.docs.map((doc) => doc.data());

}


export const getSumofNestedItem = async (table, id, parameter, comparison, value, parametertwo, comparisontwo, valuetwo) => {


  const count = await getAggregateFromServer(
    query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo), where("employeeid", "==", id)), {
    totalhours: sum('minutes')
  }).catch((err) => {
    console.log(err)
  })



  return count?.data().totalhours;

}

export const getSumofAllNestedItems = async (table, id) => {


  const count = await getAggregateFromServer(
    query(collection(firestored, `${table}`), where("employeeid", "==", id)), {
    totalhours: sum('minutes')
  }).catch((err) => {
    console.log(err)
  })



  return count?.data().totalhours;

}






export const getNestedItemdualcondition = async (table, id, parameter, comparison, value, parametertwo, comparisontwo, valuetwo, parameterthree, comparisonthree, valuethree) => {
  let items = []
  if (valuethree != undefined) {

    items = await getDocs(query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo), where(parameterthree, comparisonthree, valuethree), where("employeeid", "==", id)))
  } else {

    items = await getDocs(query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo), where("employeeid", "==", id)))
  }

  return items.docs.map((doc) => doc.data());

}

export const getgeneralNestedItemdualcondition = async (table, id, parameter, comparison, value, parametertwo, comparisontwo, valuetwo, parameterthree, comparisonthree, valuethree) => {
  let items = []
  if (valuethree != undefined) {
    // items = await getDocs(query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo), where(parameterthree, comparisonthree, valuethree), where("employeeid", "in", id)))
    items = await getDocs(query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo), where(parameterthree, comparisonthree, valuethree) ))

  } else {
    // items = await getDocs(query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo), where("employeeid", "in", id))).catch((err) => {
    //   console.log(err)
    // })
    items = await getDocs(query(collection(firestored, `${table}`), where(parameter, comparison, value), where(parametertwo, comparisontwo, valuetwo))).catch((err) => {
      console.log(err)
    })
  }


  let array = items.docs.map((doc) => doc.data());

  array = array.filter(function (itemdata) {
    return id.includes(itemdata.employeeid)
  })

  // .map(function (itemdata) {
  //   return itemdata;
  // })

  return array;

}

export const saveitemwithkey = async (collection, key, chatdata) => {

  return await setDoc(doc(firestored, collection, key), chatdata, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })

}

export const saveitemwithkeynestedarray = async (parentcollection, parentkey, innercollection, childid, chatdata) => {

  return await doc(firestored, parentcollection, parentkey).setDoc(doc(firestored, innercollection, childid), chatdata, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return err;
    })

}

export const getlivedata = async (collectionname, document) => {
  const items = await getDoc(
    onSnapshot(doc(firestored, collectionname, document))
  );
  return items.data();
}

////////////////reference//////////////////////
//Saving new item





export const saveOrder = async (collection, data, orderdate) => {

  return await setDoc(doc(firestored, collection, `${orderdate}`), { "orders": arrayUnion(data) }, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return "error";
    })

}

export const saveemployeetoproject = async (data, id) => {

  return await setDoc(doc(firestored, "TodaysOrders", `${id}`), { "employees": arrayUnion(data) }, { merge: true }).then(() => {
    return "success";
  })
    .catch((err) => {
      return "error";
    })

}



//getall food items
export const getAllFoodItems = async (data) => {
  const items = await getDocs(
    query(collection(firestored, "foodItems"), orderBy("id", "desc"))
  );

  return items.docs.map((doc) => doc.data());


}


//getall users items



export const getAllOrderItems = async (date) => {
  const items = await getDocs(
    query(collection(firestored, "TodaysOrders"))
  );
  // .where('timestamp', '>=', time)
  // .where('timestamp', '<=', lastdate)

  // where(documentId(), '==', "2022-11-28")
  // let data = items.docs.map((doc) => doc.data())
  //     return data;

  let data = items.docs.filter(function (doc) {
    return doc.id.includes(date)
  }).map(function (doc) {

    let newdata = doc.data()
    newdata["date"] = doc.id


    return newdata;
  })
  return data;
}


export const updateUserstable = async (collection, document, jsonObject) => {
  return await setDoc(doc(firestored, collection, document), jsonObject, { merge: true }).then((response) => {
    console.log(response)
    return "success";
  })
    .catch((err) => {
      console.log(err)
      return "error";
    })



}


