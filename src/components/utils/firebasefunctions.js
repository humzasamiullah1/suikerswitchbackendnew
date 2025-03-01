import { getFirestore, collection, doc, getDocs, query, orderBy, arrayUnion, updateDoc, getDoc, where, documentId, onSnapshot, setDoc, addDoc, getAggregateFromServer, sum, limit, or, deleteDoc, arrayRemove  } from "firebase/firestore"
import { firestored, app, storage } from "../../firebase/firebaseConfig"
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
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
    // Sare images upload kro aur unke URLs le lo
    const imageUploadPromises = imageFiles.map((file) => uploadImage(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    // Firestore me data save kro
    const docRef = await addDoc(collection(firestored, "supermarkets"), {
      ...formData,
      images: imageUrls, // Firebase se milne wale URLs yahan save honge
      createdAt: new Date(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
};

export const uploadImage = async (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `supermarket-logos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

export const getSupermarkets = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestored, "supermarkets"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error fetching supermarkets: ", error);
    return [];
  }
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












export const getuserinformation = async (collectionname, document) => {
  const items = await getDoc(
    query(doc(firestored, collectionname, document))
  );
  return items.data();
}

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


