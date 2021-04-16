import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getCategory,
  updateCategory
} from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";


const CategoryUpdate = ({history, match}) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategory()
  }, []);

  const loadCategory = () => getCategory(match.params.slug).then((c) => setName(c.data.name));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name)
    setLoading(true);
    updateCategory(match.params.slug,{ name } ,user.token)
      .then((res) => {
        // console.log(res)
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is updated`);
        history.push('/admin/category')
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
 };


 

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading ...</h4>
          ) : (
            <h4>Update category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />

          <hr />
          {/* {categories.map((c) => (
            <div className="alert alert-secondary" key={c._id}>
              {c.name}
              <span
                className="btn bnt-small float-right"
                onClick={() => handleRemove(c.slug)}
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <span className="btn bnt-small float-right">
                <Link to={`/admin/category/${c.slug}`}>
                  <EditOutlined className="text-warning" />
                </Link>
              </span>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate
