import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import LabelTag from "../reuseable/label";
import { Plus, X } from "lucide-react";
import {
  uploadFormData,
  getSupermarketById,
  updateSupermarket,
} from "../utils/firebasefunctions";
import { ToastContainer, toast } from "react-toastify";

const FormSection = () => {
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [supermarketName, setSupermarketName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      fetchSupermarketData(id);
    }
  }, [id]);

  const fetchSupermarketData = async (id) => {
    setLoading(true);
    try {
      const data = await getSupermarketById(id);
      if (data) {
        setSupermarketName(data.supermarketName);
        setDescription(data.description);
        setImages(data.images || []); // Ensure images are set properly
      }
    } catch (error) {
      console.error("Error fetching supermarket data:", error);
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages([...imageUrls]); // Replace existing image
    setImageFiles([...files]); // Replace image file
  };

  const removeImage = () => {
    setImages([]);
    setImageFiles([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      supermarketName,
      description,
      images,
    };

    try {
      if (id) {
        await updateSupermarket(id, formData, imageFiles);
        toast.success("Supermarket updated successfully!");
      } else {
        await uploadFormData(formData, imageFiles);
        toast.success("Supermarket added successfully!");
        setSupermarketName("");
        setDescription("");
        setImages([]);
        setImageFiles([]);
      }

      // navigate("/dashboard/supermarkets");
    } catch (error) {
      toast.error("Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-2 border-gray-100 rounded-2xl w-full px-3 py-4 mt-3"
    >
      <div className="px-2 pt-2">
        <h2 className="text-base font-HelveticaNeueMedium pb-2">
          {id ? "Update Supermarket" : "Upload Logo"}
        </h2>
        <div className="flex space-x-2">
          {images.length > 0 ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={images[0]}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                onClick={removeImage}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="w-20 h-20 flex items-center justify-center bg-red-100 text-red-500 rounded-lg cursor-pointer">
              <Plus size={24} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between pt-5">
        <div className="w-full">
          <LabelTag
            isStaric={false}
            name="Supermarket Name"
            classes="!text-sm"
          />
          <input
            type="text"
            value={supermarketName}
            onChange={(e) => setSupermarketName(e.target.value)}
            placeholder="Write Supermarket Name"
            className="w-full mt-1 text-sm font-popinsRegular rounded-md bg-bgColor px-3 py-[10px] text-darkColor placeholder:text-zinc-700/50"
          />
        </div>
      </div>

      <div className="pt-4 w-full">
        <LabelTag isStaric={false} name="Description" classes="!text-sm" />
        <textarea
          cols={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write Supermarket Description"
          className="w-full h-40 mt-1 text-sm bg-bgColor font-popinsRegular px-3 py-2 rounded-lg text-darkColor placeholder:text-zinc-700/50"
        />
      </div>

      <div className="flex items-center gap-2 mt-5">
        <Link to="/dashboard/supermarkets">
          <button className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-darkColor bg-gray-200 hover:bg-gray-200">
            Cancel
          </button>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90"
        >
          <span>{id ? "Update" : "Proceed"}</span>
          {loading && (
            <div role="status" className="pl-3">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="currentColor"
                  d="M100 50.59C100 78.205 77.614 100.59 50 100.59S0 78.205 0 50.59 22.386 0.59 50 0.59 100 22.977 100 50.59Z"
                />
                <path
                  fill="currentFill"
                  d="M93.968 39.04C96.393 38.403 97.862 35.912 97.008 33.554C95.293 28.823 92.871 24.37 89.817 20.348 85.845 15.12 80.883 10.724 75.212 7.413 69.542 4.102 63.275 1.94 56.77 1.051 51.767 0.368 46.698 0.447 41.735 1.279 39.261 1.693 37.813 4.198 38.45 6.623 39.087 9.049 41.57 10.472 44.05 10.107 47.851 9.548 51.719 9.527 55.54 10.049 60.864 10.777 65.993 12.546 70.633 15.255 75.274 17.965 79.335 21.562 82.585 25.841 84.918 28.912 86.8 32.291 88.181 35.876 89.083 38.216 91.542 39.678 93.968 39.04Z"
                />
              </svg>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormSection;
