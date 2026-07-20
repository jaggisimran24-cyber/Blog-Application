import { useState } from "react";

function Blogs() {

    // Stores all blogs fetched from the backend
    const [blogs, setBlogs] = useState([]);

    // Stores Blog ID entered by the user
    const [blogId, setBlogId] = useState("");

    // Stores form values
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");


    // ==========================================
    // GET ALL BLOGS
    // ==========================================
    async function getBlogs(){

        const response = await fetch("https://blog-application-6uvw.onrender.com/blogs");

        const data = await response.json();

        setBlogs(data);
    }


    // ==========================================
    // GET BLOG BY ID
    // ==========================================
    async function searchBlogById(){

        const response = await fetch(
            `https://blog-application-6uvw.onrender.com/${blogId}`
        );

        const data = await response.json();

        // Convert single blog into an array
        // because blogs.map() requires an array.
        setBlogs([data]);
    }


    // ==========================================
    // CREATE BLOG
    // ==========================================
    async function createBlog(){

        await fetch("https://blog-application-6uvw.onrender.com/blogs",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                title,
                author,
                content

            })

        });

        // Display latest blogs
        getBlogs();

        // Clear input fields
        setTitle("");
        setAuthor("");
        setContent("");
    }


    // ==========================================
    // DELETE BLOG
    // ==========================================
    async function deleteBlog(){

        await fetch(

            `https://blog-application-6uvw.onrender.com/${blogId}`,

            {
                method:"DELETE"
            }

        );

        getBlogs();

        setBlogId("");
    }


    // ==========================================
    // UPDATE BLOG (PATCH)
    // ==========================================
    async function updateBlog(){

        let updatedFields = {};

        // Only send fields entered by the user

        if(title !== ""){
            updatedFields.title = title;
        }

        if(author !== ""){
            updatedFields.author = author;
        }

        if(content !== ""){
            updatedFields.content = content;
        }

        await fetch(

            `https://blog-application-6uvw.onrender.com/${blogId}`,

            {

                method:"PATCH",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(updatedFields)

            }

        );

        getBlogs();

        setBlogId("");
        setTitle("");
        setAuthor("");
        setContent("");
    }


    // ==========================================
    // REPLACE BLOG (PUT)
    // ==========================================
    async function replaceBlog(){

        await fetch(

            `https://blog-application-6uvw.onrender.com/${blogId}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    title,
                    author,
                    content

                })

            }

        );

        getBlogs();

        setBlogId("");
        setTitle("");
        setAuthor("");
        setContent("");
    }


    return(

        <div className="container">

            <h1>Blog Application</h1>

            <button onClick={getBlogs}>
                Get All Blogs
            </button>

            <br /><br />

            {/* Search/Delete */}

            <div className="form">

                <input

                    type="number"

                    placeholder="Enter Blog ID"

                    value={blogId}

                    onChange={(e)=>setBlogId(e.target.value)}

                />

                <button onClick={searchBlogById}>
                    Search Blog
                </button>

                <button onClick={deleteBlog}>
                    Delete Blog
                </button>

            </div>


            <br />


            {/* Create / Update / Replace */}

            <div className="form">

                <input

                    placeholder="Enter Title"

                    value={title}

                    onChange={(e)=>setTitle(e.target.value)}

                />

                <input

                    placeholder="Enter Author"

                    value={author}

                    onChange={(e)=>setAuthor(e.target.value)}

                />

                <textarea

                    placeholder="Enter Content"

                    value={content}

                    onChange={(e)=>setContent(e.target.value)}

                />

                <br /><br />

                <button onClick={createBlog}>
                    Create Blog
                </button>

                <button onClick={updateBlog}>
                    Update Blog
                </button>

                <button onClick={replaceBlog}>
                    Replace Blog
                </button>

            </div>


            <hr />

            {

                blogs.map((blog)=>(

                    <div className="card" key={blog.id}>
                        <h3>Blog ID : {blog.id}</h3>

                        <h2>{blog.title}</h2>

                        <h4>
                            By {blog.author}
                        </h4>

                        <p>{blog.content}</p>

                    </div>

                ))

            }

        </div>

    );

}

export default Blogs;
