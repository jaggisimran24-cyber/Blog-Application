from fastapi import FastAPI                     # Creates the FastAPI application
from fastapi.middleware.cors import CORSMiddleware
import json                                    # Used to read/write JSON files

app = FastAPI()

# CORS allows the React frontend (running on a different port)
# to communicate with this FastAPI backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://blog-application-nu-ochre.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

# JSON file used as our temporary database
FILE_NAME = "blogs.json"


# -------------------------
# Read data from JSON file
# -------------------------
def read_blogs():
    with open(FILE_NAME, "r") as file:
        return json.load(file)


# -------------------------
# Write data into JSON file
# -------------------------
def write_blogs(data):
    with open(FILE_NAME, "w") as file:
        json.dump(data, file, indent=4)


# ====================================================
# GET : Display all blogs
# ====================================================
@app.get("/blogs")
def get_blogs():
    return read_blogs()


# ====================================================
# GET : Display one blog using Blog ID
# ====================================================
@app.get("/blogs/{blog_id}")
def get_blog(blog_id: int):

    blogs = read_blogs()

    for blog in blogs:
        if blog["id"] == blog_id:
            return blog

    return {
        "message": "Blog Not Found"
    }


# ====================================================
# POST : Create a new blog
# ====================================================
@app.post("/blogs")
def create_blog(blog: dict):

    blogs = read_blogs()

    # Create a new blog dictionary
    new_blog = {
        "id": len(blogs) + 1,
        "title": blog["title"],
        "author": blog["author"],
        "content": blog["content"]
    }

    # Add new blog to the list
    blogs.append(new_blog)

    # Save updated list back to JSON
    write_blogs(blogs)

    return {
        "message": "Blog Added Successfully",
        "blog": new_blog
    }


# ====================================================
# PUT : Replace the complete blog
# ====================================================
@app.put("/blogs/{blog_id}")
def replace_blog(blog_id: int, updated_blog: dict):

    blogs = read_blogs()

    for index, blog in enumerate(blogs):

        # Find the matching blog
        if blog["id"] == blog_id:

            # Replace the complete object
            blogs[index] = {
                "id": blog_id,
                "title": updated_blog["title"],
                "author": updated_blog["author"],
                "content": updated_blog["content"]
            }

            write_blogs(blogs)

            return {
                "message": "Blog Replaced Successfully",
                "blog": blogs[index]
            }

    return {
        "message": "Blog Not Found"
    }


# ====================================================
# PATCH : Update only selected fields
# ====================================================
@app.patch("/blogs/{blog_id}")
def update_blog(blog_id: int, updated_fields: dict):

    blogs = read_blogs()

    for blog in blogs:

        if blog["id"] == blog_id:

            # Update only the fields received
            for key in updated_fields:

                blog[key] = updated_fields[key]

            write_blogs(blogs)

            return {
                "message": "Blog Updated Successfully",
                "blog": blog
            }

    return {
        "message": "Blog Not Found"
    }


# ====================================================
# DELETE : Delete a blog
# ====================================================
@app.delete("/blogs/{blog_id}")
def delete_blog(blog_id: int):

    blogs = read_blogs()

    for blog in blogs:

        if blog["id"] == blog_id:

            blogs.remove(blog)

            write_blogs(blogs)

            return {
                "message": "Blog Deleted Successfully"
            }

    return {
        "message": "Blog Not Found"
    }
