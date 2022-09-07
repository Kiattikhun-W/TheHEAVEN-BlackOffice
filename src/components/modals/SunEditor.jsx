import * as React from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

const Editor = () => {
  const [content, setContent] = React.useState("");
  const handleImageUpload = (
    targetImgElement,
    index,
    state,
    imageInfo,
    remainingFilesCount
  ) => {
    console.log(targetImgElement, index, state, imageInfo, remainingFilesCount);
  };

  const handleImageUploadBefore = (
    files,
    info,
    uploadHandler
  ) => {};

  const handleImageUploadError = (errorMessage, result) => {
    console.log(errorMessage, result);
  };

  const imageUploadHandler = (
    xmlHttpRequest,
    info,
    core
  ) => {
    console.log(xmlHttpRequest, info, core);
  };

  return (
    <div>
      <SunEditor
        onChange={(e) => {
          console.log(e);
          // eslint-disable-next-line no-unused-expressions
          setContent;
        }}
        imageUploadHandler={imageUploadHandler}
        onImageUploadError={handleImageUploadError}
        onImageUpload={handleImageUpload}
        onImageUploadBefore={handleImageUploadBefore}
        setOptions={{
          buttonList: [
            ["undo", "redo", "font", "fontSize", "formatBlock"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
              "removeFormat",
            ],
            [
              "fontColor",
              "hiliteColor",
              "outdent",
              "indent",
              "align",
              "horizontalRule",
              "list",
              "table",
            ],
            [
              "link",
              "image",
              "video",
              "fullScreen",
              "showBlocks",
              "codeView",
              "preview",
              "print",
              "save",
            ],
          ],
        }}
      />
      {content}
    </div>
  );
};

export default Editor;
