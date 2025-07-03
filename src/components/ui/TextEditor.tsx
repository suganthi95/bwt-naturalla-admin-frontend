import { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import styles

const TextEditor = ({ content, handleChange }: any) => {


    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', ],
            ],
            // handlers: {
            //     'image': () => {}
            // },
        }
    }), [])

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 
    ]

    return (
        <ReactQuill 
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
