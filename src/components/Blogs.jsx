import React, { useEffect, useState } from 'react'
import BlogCard from './BlogCard'

const Blogs = () => {

  const [blogs, setBlogs] = useState();
  const [search, setSearch] = useState();

  const fetchBlogs = async () => {
    const res = await fetch('http://localhost:8000/blogs');
    const result = await res.json();
    setBlogs(result.data);
  }

  const searchBlogs = async (e) => {
    e.preventDefault();
    
    const res = await fetch(`http://localhost:8000/blogs?search=${search}`);
    const result = await res.json();
    setBlogs(result.data);
  }

  const resetSearch = async () => {
    setSearch('');
    fetchBlogs();
  }

  useEffect(() => {
      fetchBlogs();
  }, []);

  return (
    <div className='container'>
      <form onSubmit={(e) => searchBlogs(e)}>
        <div className="d-flex justify-content-center pt-5 mb-4">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className='form-control w-50' placeholder='Search...' />
          <button className='btn btn-dark ms-2'>Search</button>
          <button type='button' className='btn btn-success ms-2' onClick={() => resetSearch()}>Reset</button>
        </div>
      </form>
      <div className="d-flex justify-content-between pt-5 mb-4">
        <h4>Blogs</h4>
        <a href="/create" className='btn btn-dark'>Create</a>
      </div>
      <div className='row'>
        {
          blogs && blogs.map(blog => {
            return (
              <BlogCard key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} />
            )
          })
        }
      </div>
    </div>
  )
}

export default Blogs