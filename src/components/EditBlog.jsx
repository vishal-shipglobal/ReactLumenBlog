import React, { useEffect, useState } from 'react'
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const EditBlog = () => {

    const [blog, setBlog] = useState();
    const [html, setHtml] = useState();
    const [imageId, setImageId] = useState();
    const params = useParams();

    function onChange(e) {
        setHtml(e.target.value);
    }

    const fetchBlogs = async () => {
        const res = await fetch(`http://localhost:8000/blogs/${params.id}`);
        const result = await res.json();
        setBlog(result.data);
        setHtml(result.data.description);
        reset(result.data);
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch('http://localhost:8000/save-temp-image', {
            method: 'POST',
            body: formData
        });

        const result = await res.json();

        if(result.status == false) {
            alert(result.errors.image);
            e.target.value = null;
        }

        setImageId(result.image.id);
    }

    const { 
        register, 
        handleSubmit, 
        watch, 
        reset,
        formState: { errors },
    } = useForm();
    
    const formSubmit = async (data) => {
        const newData = { ...data, "description": html, "image_id": imageId };

        const res = await fetch(`http://localhost:8000/blogs/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            toast(errorData.message);
        } else {
            toast("Blog updated Successfully");
        }   
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className='container mb-5'>
            <div className='d-flex justify-content-between pt-5 mb-4'>
                <h4>Edit Blog</h4>
                <a href='/' className='btn btn-dark'>Back</a>
            </div>
            <div className="card border-0 shadow-lg">
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="card-body">
                        <div className="mb-3">
                            <label for="title" className="form-label">Title</label>
                            <input 
                                { ...register('title', { required: true }) } 
                                type="text" 
                                className={`form-control ${errors.title && 'is-invalid'}`} 
                                placeholder="title" />
                            {errors.title && <p className='invalid-feedback'>Title field is required</p>}
                        </div>
                        <div className="mb-3">
                            <label for="title" className="form-label">Short Description</label>
                            <textarea 
                                { ...register('shortDesc') }
                                cols="30" 
                                rows="5" 
                                className='form-control'>
                            </textarea>
                        </div>
                        <div className="mb-3">
                            <label for="description" className="form-label">Description</label>
                            <Editor value={html} 
                            containerProps={{ style: { height: '400px' } }}
                            onChange={onChange} />
                        </div>
                        <div className="mb-3">
                            <label for="title">Image</label><br />
                            <input onChange={handleFileChange} type="file" />
                            <div className='mt-2'>
                                {
                                    blog && 
                                    blog.image && 
                                    <img src={`http://localhost:8000/uploads/blogs/${blog.image}`} className='w-100 h-25 img-fluid' alt='...' />
                                }
                                </div>
                        </div>
                        <div className="mb-3">
                            <label for="author" className="form-label">Author</label>
                            <input 
                                { ...register('author', { required: true }) }
                                type="text" 
                                className={`form-control ${errors.author && 'is-invalid'}`}
                                placeholder="author" />
                            {errors.author && <p className='invalid-feedback'>Author field is required</p>}
                        </div>
                        <button className="btn btn-dark">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditBlog