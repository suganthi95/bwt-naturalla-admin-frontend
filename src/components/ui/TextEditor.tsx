import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const TextEditor = ({ content, handleChange }: any) => {
  const quillRef = useRef<ReactQuill | null>(null);

  // const imageHandler = () => {
  //   const input = document.createElement("input");
  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click();
  //   input.onchange = () => {
  //     if (input.files) {
  //       const file = input.files[0];
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         const imageUrl = reader.result;
  //         const quill = quillRef?.current?.getEditor();
  //         const range = quill?.getSelection();
  //         if (range) {
  //           quill?.insertEmbed(range.index, "image", imageUrl, "user");
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   };
  // };
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link"],
        ],
        // handlers: {
        //   image: imageHandler,
        // },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    // "image",
  ];

  return (
    <ReactQuill
      ref={quillRef}
      style={{ borderRadius: "50%" }}
      value={content}
      onChange={handleChange}
      theme="snow"
      formats={formats}
      modules={modules}
    />
  );
};

export default TextEditor;
