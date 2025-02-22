import React, { useState } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const RichTextEditor = () => {
  const [content, setContent] = useState('');

  const handleEditorChange = (value) => {
    setContent(value);
  };

  return (
    <div className="bg-white rounded-[30px] shadow-md px-5 mb-5 lg:mb-0 h-full flex flex-col">
      <div className="flex lg:flex-row flex-col border-b-2 border-gray-100 justify-between items-center pt-2 lg:h-[12%]">
        <div className="flex justify-center lg:justify-start w-full items-center lg:w-[30%] xl:w-[50%]">
          <p className="font-HelveticaNeueMedium text-darkColor text-sm">File</p>
          <p className="font-HelveticaNeueMedium text-darkColor text-sm pl-3">Edit</p>
          <p className="font-HelveticaNeueMedium text-darkColor text-sm pl-3">Insert</p>
          <p className="font-HelveticaNeueMedium text-darkColor text-sm pl-3">Format</p>
          <p className="font-HelveticaNeueMedium text-darkColor text-sm pl-3">Tools</p>
          <p className="font-HelveticaNeueMedium text-darkColor text-sm pl-3">Help</p>
        </div>
        <div className="flex items-center lg:w-[70%] xl:w-[50%] justify-end pb-3 lg:pb-0">
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <button className="border text-xs rounded-full px-4 py-2 flex items-center font-HelveticaNeueMedium text-darkColor bg-gray-200 hover:bg-gray-200">Cancel</button>
            <button className="border text-xs rounded-full px-4 w-full py-2 flex items-center font-HelveticaNeueMedium text-white bg-gkRedColor hover:bg-gkRedColor/90">Post</button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <SunEditor
          setContents={content}
          onChange={handleEditorChange}
          placeholder="Write something here..."
          setOptions={{
            minHeight: '100%',
            height: '100%',
            buttonList: [
              ['formatBlock', 'bold', 'underline', 'italic', 'strike', 'list', 'align', 'link', 'image', 'video', 'fullScreen', 'undo', 'redo'],
            ],
          }}
          className="h-full"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
