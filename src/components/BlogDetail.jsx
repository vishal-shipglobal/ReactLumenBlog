import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
    const [blog, setBlog] = useState();
    const params = useParams();

    const fetchBlog = async () => {
        const res = await fetch(`http://localhost:8000/blogs/${params.id}`);
        const result = await res.json();
        setBlog(result.data);
    }

    useEffect(() => {
        fetchBlog();
    }, []);

    return (
        <div className='container'>
            <div className='d-flex justify-content-between pt-5 mb-4'>
                <h2>{blog && blog.title}</h2>
                <div>
                    <a href="/" className='btn btn-dark'>back to blogs</a>
                </div>
            </div>
            <div className='row'>
                <div className='col-md-12'> 
                    <p>by {blog && blog.author} on {blog && blog.date}</p>
                    
                    {
                        blog && 
                        blog.image && 
                        <img src={`http://localhost:8000/uploads/blogs/${blog.image}`} className='w-100 h-25 img-fluid' alt='...' />
                    }
                    
                    <div dangerouslySetInnerHTML={{ __html: blog?.description }} className='mt-2'></div>

                </div>
            </div>
        </div>                    
    )
}
export default BlogDetail