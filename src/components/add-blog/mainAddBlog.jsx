import React, { useState, useEffect } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  uploadImageToBlogFirebase,
  saveBlogToFirestore,
  getBlogsById,
  updateBlogs,
} from "../utils/firebasefunctions";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../../context/StateProvider";
import { serverTimestamp } from "firebase/firestore";
import BreadCrumbs from "../reuseable/breadCrumbs";

import { Plus, X } from "lucide-react";
import { toast } from "react-toastify";

const RichTextEditor = () => {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckTitle, setIsCheckTitle] = useState(false);
  const [loadingRichText, setLoadingRichText] = useState(false);
  const [{ user }] = useStateValue();
  const [searchParams] = useSearchParams();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const navigate = useNavigate();

  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      fetchBlogsData(id);
    }
  }, [id]);

  const fetchBlogsData = async (id) => {
    setLoading(true);
    try {
      const data = await getBlogsById(id);
      if (data) {
        setContent(data.content);
        setDescription(data.description);
        setImages(data.images || []);
      }
    } catch (error) {
      console.error("Error fetching supermarket data:", error);
    }
    setLoading(false);
  };

  // 🔹 Handle Image Upload in SunEditor
  const handleImageUpload = async (file, info, uploadHandler) => {
    setLoadingRichText(true);
    try {
      const imageUrl = await uploadImageToBlogFirebase(file, "blogImages");
      if (imageUrl) {
        uploadHandler({
          result: [{ url: imageUrl, name: file.name }],
        });

        // ✅ Remove base64 image & insert Firebase URL
        setContent((prevContent) =>
          prevContent.replace(
            /<img[^>]+src=["'](data:image\/[^"']+)["']/g,
            `<img src="${imageUrl}"`
          )
        );
        setLoadingRichText(false);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      uploadHandler({ errorMessage: "Image upload failed!" });
      setLoadingRichText(false);
    }
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

  // 🔹 Handle Post Submission
  const handlePostClick = async () => {
    if (!description.trim()) {
      toast.warning("Short decription is Required");
      setIsCheckTitle(true);
      return;
    } else if (!content.trim()) {
      toast.warning("Please fill text editor");
      return;
    }

    setIsCheckTitle(false);
    setLoading(true); // Start Loading

    // ✅ Prepare Blog Data
    const blogData = {
      content,
      description,
      userId: user?.id || "Unknown",
      userType: user?.usertype || "Guest",
      createdAt: Date.now(),
    };

    try {
      if (id) {
        await updateBlogs(id, blogData, imageFiles);
        toast.success("Blog updated successfully!");
        setTimeout(() => {
          navigate("/dashboard/blogs");
        }, 1000);
      } else {
        // ✅ Save Blog to Firestore
        const success = await saveBlogToFirestore(blogData, imageFiles);
        if (!success) throw new Error("🔥 Error saving blog to Firestore!");

        // alert("🎉 Blog posted successfully!");
        toast.success("Blog posted successfully!");
        setContent("");
        setDescription("");
        setThumbnail(null);
        setThumbnailURL("");
        setImages([]);
        setImageFiles([]);
        setTimeout(() => {
          navigate("/dashboard/blogs");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      // alert(error.message);
    } finally {
      setLoading(false); // Stop Loading
    }
  };

  return (
    <div className="bg-white rounded-[30px] shadow-md px-5 mb-5 lg:mb-0 h-full flex flex-col">
      <div className="h-[85%] overflow-y-scroll panelScroll">
        <div className="pt-3">
          <BreadCrumbs
            link={"/dashboard/blogs"}
            firstLink="Blogs"
            secondLink="Add Blog"
          />
        </div>
        <div className="px-2 pt-7">
          <h2 className="text-base font-HelveticaNeueMedium pb-2">
            {id ? "Update Blog" : "Upload Logo"}
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
        <div className="w-full my-3 px-3">
          <label className="text-sm">Title</label>
          <div className="">
            <input
              type="text"
              placeholder="Enter Title..."
              className={`w-full ${
                isCheckTitle ? "border-2 border-red-600" : ""
              } mt-1 text-sm rounded-md bg-gray-100 px-3 py-2 text-gray-700`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 Rich Text Editor */}
        <div className="flex-1 h-full overflow-hidden relative">
          {loadingRichText && (
            <main className="w-full h-screen backdrop-blur-sm bg-black/40 absolute inset-0 z-50 flex items-center justify-center">
              <section className="w-[90%] sm:w-[65%] md:w-[50%] lg:w-[40%] xl:w-[30%] bg-texture myshades rounded-[31px] mx-auto">
                <div role="status" className="">
                  <svg
                    aria-hidden="true"
                    class="w-24 h-24 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </section>
            </main>
          )}
          <SunEditor
            setContents={content}
            onChange={setContent}
            placeholder="Write something here..."
            setOptions={{
              minHeight: "100%",
              height: "100%",
              imageUploadUrl: null, // 🔥 Disable default base64 upload
              imageGalleryUrl: null, // 🔥 Disable gallery uploads
              buttonList: [
                ["formatBlock", "bold", "underline", "italic", "strike"],
                ["list", "align", "link", "image", "video"],
                ["fullScreen", "undo", "redo"],
              ],
              formats: ["p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre"],
              popupDisplay: "show",
              showPathLabel: false,
              appendToBody: true,
              callBackSave: (content) => setContent(content), // ✅ Ensure content is updated
            }}
            onImageUploadBefore={(files, _, uploadHandler) => {
              handleImageUpload(files[0], {}, uploadHandler);
              return false; // 🔥 Prevent default base64 upload
            }}
            className="h-full"
          />
        </div>
      </div>

      {/* 🔹 Buttons */}
      <div className="h-[15%] flex items-center justify-center">
        {/* <div className="flex justify-end"> */}
        <Link to="/dashboard/blogs">
          <button
            className="w-[120px] py-2 font-HelveticaNeueMedium rounded-full bg-gray-200 text-darkColor mr-2"
            disabled={loading}
          >
            Cancel
          </button>
        </Link>
        <button
          onClick={handlePostClick}
          className="w-[120px] py-2 rounded-full font-HelveticaNeueMedium flex justify-center items-center bg-gkRedColor text-white hover:bg-gkRedColor/90"
          disabled={loading}
        >
          <span> {id ? "Update" : "Post"}</span>
          {loading && (
            <div role="status" className="pl-3">
              <svg
                aria-hidden="true"
                class="w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gkRedColor"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          )}
        </button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default RichTextEditor;
