import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import {
  uploadImageToBlogFirebase,
  saveBlogToFirestore,
} from "../utils/firebasefunctions";
import { useStateValue } from "../../context/StateProvider";

import { Plus, X } from "lucide-react";

const RichTextEditor = () => {
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [{ user }] = useStateValue();

  // 🔹 Handle Image Upload in SunEditor
  const handleImageUpload = async (file, info, uploadHandler) => {
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
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      uploadHandler({ errorMessage: "Image upload failed!" });
    }
  };

  // 🔹 Handle Thumbnail Upload
  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailURL(URL.createObjectURL(file)); // Show preview
    }
  };

  const removeImage = () => {
    setThumbnailURL(null);
  };

  // 🔹 Handle Post Submission
  const handlePostClick = async () => {
    if (!content.trim() || !description.trim() || !thumbnail) {
      alert("⚠️ Please fill all fields before posting!");
      return;
    }

    setLoading(true); // Start Loading

    try {
      // ✅ Upload Thumbnail to Firebase
      const thumbnailUrl = await uploadImageToBlogFirebase(
        thumbnail,
        "thumbnails"
      );
      if (!thumbnailUrl) throw new Error("🚨 Error uploading thumbnail!");

      setThumbnailURL(thumbnailUrl);

      // ✅ Prepare Blog Data
      const blogData = {
        content, // 🛑 Ensure updated content with Firebase URLs
        description,
        thumbnail: thumbnailUrl,
        userId: user?.id || "Unknown",
        fullName: `${user?.firstname || "Unknown"} ${
          user?.lastname || ""
        }`.trim(),
        userType: user?.usertype || "Guest",
        createdAt: new Date().toISOString(),
      };

      // ✅ Save Blog to Firestore
      const success = await saveBlogToFirestore(blogData);
      if (!success) throw new Error("🔥 Error saving blog to Firestore!");

      alert("🎉 Blog posted successfully!");
      setContent("");
      setDescription("");
      setThumbnail(null);
      setThumbnailURL("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // Stop Loading
    }
  };

  return (
    <div className="bg-white rounded-[30px] shadow-md px-5 mb-5 lg:mb-0 h-full flex flex-col">
      <div className="px-2 pt-2">
        <h2 className="text-lg font-medium pb-2">Thumbnail Image</h2>
        <div className="flex space-x-2">
          {thumbnailURL ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={thumbnailURL}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-gray-200"
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          ) : (
            <label className="w-20 h-20 flex items-center justify-center bg-red-100 text-red-500 rounded-lg cursor-pointer">
              <Plus size={24} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />
            </label>
          )}
        </div>
      </div>

      <div className="my-4">
        <input
          type="text"
          placeholder="Enter blog description..."
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* 🔹 Rich Text Editor */}
      <div className="flex-1 h-full overflow-hidden">
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
              [
                "formatBlock",
                "bold",
                "underline",
                "italic",
                "strike",
                "list",
                "align",
                "link",
                "image",
                "video",
                "fullScreen",
                "undo",
                "redo",
              ],
            ],
            callBackSave: (content) => setContent(content), // ✅ Ensure content is updated
          }}
          onImageUploadBefore={(files, _, uploadHandler) => {
            handleImageUpload(files[0], {}, uploadHandler);
            return false; // 🔥 Prevent default base64 upload
          }}
          className="h-full"
        />
      </div>

      {/* 🔹 Buttons */}
      <div className="flex justify-end mt-4">
        <button
          className="border px-4 py-2 rounded bg-gray-200 text-darkColor mr-2"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handlePostClick}
          className="border px-4 py-2 rounded bg-gkRedColor text-white hover:bg-gkRedColor/90"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default RichTextEditor;
