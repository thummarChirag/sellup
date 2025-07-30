import React, { Fragment, useState, useContext } from "react";
import "./Create.css";
import Header from "../Header/Header";
import { db, storage } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../../contextStore/AuthContext";
import { useHistory } from "react-router";
import GoLoading from "../Loading/GoLoading";

const Create = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();
  let [name, setName] = useState("");
  let [category, setCategory] = useState("");
  let [price, setPrice] = useState("");
  let [description, setDescription] = useState("");
  let [image, setImage] = useState();
  let [loading,setLoading]=useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    let date = new Date().toDateString();

    try {
      // Upload image to storage
      const storageRef = ref(storage, `/image/${image.name}`);
      const uploadResult = await uploadBytes(storageRef, image);
      const url = await getDownloadURL(uploadResult.ref);

      // Add product to Firestore
      await addDoc(collection(db, "products"), {
        name,
        category,
        price,
        description,
        url,
        userId: user.uid,
        createdAt: date,
      });

      history.push("/");
    } catch (error) {
      console.error("Error creating product:", error);
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Header />
      {loading && <GoLoading />}
      <div className="createPost">
        <div className="cpContainer">
          <h1>Create A Post</h1>
          <div className="inputGp">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              placeholder="Name"
              className="input"
            />
          </div>
          <div className="inputGp">
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              name="category"
              placeholder="Category"
              className="input"
            />
          </div>
          <div className="inputGp">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              name="price"
              placeholder="Price"
              className="input"
            />
          </div>
          <div className="inputGp">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              placeholder="Description"
              className="input"
            />
          </div>
          <div className="inputGp">
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              name="image"
              className="fileInput"
            />
          </div>
          <button onClick={handleSubmit} className="uploadBtn">
            Upload
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default Create;
