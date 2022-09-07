import GLOBAL from "../../GLOBAL";

const uploadFileToServer = async (file) => {

    console.log("file")
    let result = null;
    let formData = new FormData();
    formData.append("file", file[0]);
    try {
        let res = await fetch(`${GLOBAL.BASE_SERVER.URL_IMG}api/v1/media/upload/file`, {
            method: "POST",
            body: formData,
            headers: GLOBAL.ACCESS_TOKEN,
        });
        result = await res.json();
    } catch (error) {
        console.log("ERROR", error);
    }
    return result;
};

export const handleImageUploadBefore = async (
    files,
    info,
    uploadHandler
) => {
    console.log("hello")
    let imageResource = await uploadFileToServer(files);
    console.log(imageResource.result);
    const response = {
        result: imageResource.result,
    };
    uploadHandler(response);
};

export const configToobars = [
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
        "fullScreen",
        "showBlocks",
        "codeView",
        "preview",
        "print",
        "save",
    ],
];
