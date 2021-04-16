import React from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import ProductCardInCheckout from "../components/cards/ProductCardInCheckout";
import {userCart} from '../functions/user'

const Cart = ({history}) => {
const {cart, user} = useSelector(state=> ({...state}))
const dispatch = useDispatch()

const getTotal = () => {
     return cart.reduce((acc, cur)=>acc+ cur.price*cur.count ,0)
}

const saveOrderToDb = () => {
  // console.log('cart', JSON.stringify(cart, null, 4))
  userCart(cart, user.token)
  .then(res=> {
    console.log('Cart post res', res)
    if(res.data.ok) history.push('/checkout')
  }).catch(err=> console.log('cart save err', err))
}

const saveCashOrderToDb = () => {
  // console.log('cart', JSON.stringify(cart, null, 4))
  dispatch({
    type:"COD",
    payload: true
  })
  userCart(cart, user.token)
    .then((res) => {
      console.log("Cart post res", res);
      if (res.data.ok) history.push("/checkout");
    })
    .catch((err) => console.log("cart save err", err));
};

const showCartItems = () => {
   return <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
   {cart.map((p)=> (
       <ProductCardInCheckout key={p._id} p={p} />
   ))}
    </table>
}

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>
            Cart / {cart.length} {cart.length < 2 ? "Product" : "Products"}
          </h4>
          {!cart.length ? (
            <p>
              No products in cart. <Link to="/shop">Continue Shopping</Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} * {c.count} = ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          TOTAL: <b>${getTotal()}</b>
          <hr />
          {user ? (
            <>
              <button
                onClick={saveCashOrderToDb}
                className="btn btn-small btn-warning mt-2"
                disabled={!cart.length}
              >
                Pay Cash On delivery
              </button>
              <br />
              <button
                onClick={saveOrderToDb}
                className="btn btn-small btn-primary mt-2"
                disabled={!cart.length}
              >
                Proceed to checkout
              </button>
            </>
          ) : (
            <button className="btn btn-small btn-primary mt-2">
              <Link
                to={{
                  pathname: "/login",
                  state: { from: "cart" },
                }}
              >
                Login to checkout
              </Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart