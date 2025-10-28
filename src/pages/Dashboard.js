import { useEffect, useState } from "react";
import { api } from "../api";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      return;
    }

    await api.post("/posts", {
      content,
      user: { id: user.id },
    });

    setContent("");
    fetchPosts();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Feeds
        </h2>

        {user?(
        <p className="text-center text-sm mt-4">
          Want to post with different account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline"
          >
            Relogin
          </button>

          {" "}or want to{" "}
          <button
            onClick={logout}
            className="text-indigo-600 hover:underline"
          >
            Logout
          </button>
        </p>
  
        ):(
        <p className="text-center text-sm mt-4">
          Want to post something{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:underline"
          >
            Login
          </button>
        </p>
        )}

        <form
          onSubmit={handlePost}
          className="flex bg-white shadow rounded-lg overflow-hidden mb-6"
        >

          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something..."
            className="flex-grow p-3 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 font-semibold hover:bg-indigo-700 transition"
          >
            Post
          </button>
        </form>

        <ul className="space-y-4">
          {posts.map((p) => (
            <li
              key={p.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
            >

              <p className="text-gray-800">{p.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                — <i>{p.user?.name || "Anonymous"}</i>
              </p>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
