import React, {useState, useEffect} from 'react'
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {createPaymentIntent} from '../functions/stripe'
import { createOrder, emptyUserCart } from "../functions/user";

import {Card} from 'antd'
import {DollarOutlined, CheckOutlined} from '@ant-design/icons'
import laptop from '../images/sample.jpg'

const StripeCheckout = ({history}) => {
    const dispatch = useDispatch()
    const {user, coupon} = useSelector((state)=> ({...state}))

    const [succeeded, setSucceeded] = useState(false)
    const [error, setError] = useState(null)
    const [processing, setProcessing] = useState('')
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');

    const [cartTotal, setCartTotal] = useState(0)
    const [totalAfterDiscount, setTotalDiscount] = useState(0)
    const [payable, setPayable] = useState(0)

 const stripe = useStripe()
  const elements = useElements()

  useEffect(()=> {
createPaymentIntent(user.token, coupon)
.then(res=> {
    console.log('create payment intent', res.data)
    setClientSecret(res.data.clientSecret)
    setCartTotal(res.data.cartTotal)
    setTotalDiscount(res.data.totalAfterDiscount)
    setPayable(res.data.payable)
})
  },[])

const handleSubmit = async (e) => {
 e.preventDefault()
 setProcessing(true)

 const payload = await stripe.confirmCardPayment(clientSecret, {
   payment_method : {
     card: elements.getElement(CardElement),
     billing_details: {
       name: e.target.name.value,
     }
   }

 })
 if(payload.error) {
setError(`Payment failed ${payload.error.message}`)
setProcessing(false)
 }else {

  createOrder(payload, user.token)
  .then(res=> {
    if(res.data.ok) {
      // emty cart from local storage
      if(typeof window !== "undefined") localStorage.removeItem('cart')
      // empty cart from redux
      dispatch({type:"ADD_TO_CART", payload: []})
      // reset coupon to false
      dispatch({ type: "COUPON_APPLIED", payload: false });
      // empty cart from database
    emptyUserCart(user.token)
    }
  })
console.log(JSON.stringify(payload, null, 4))
setError(null)
setProcessing(false)
setSucceeded(true)
 }
}

const handleChange = async (e) => {
    setDisabled(e.empty); //disable pay button if errors
    setError(e.error ? e.error.message : '')


};

const cartStyle = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

    return (
      <>
      {!succeeded && <div>
        {coupon && totalAfterDiscount !== undefined ? (
          <p className='alert alert-success'>{`Total after discount: $${totalAfterDiscount}`}</p>
        ) : (<p className='alert alert-danger'>No coupon applied</p>)}
        </div>}
        <div className="text-center pb-5">
          <Card
            cover={
              <img
                src={laptop}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "-50px",
                }}
              />
            }
            actions={[
              <>
                <DollarOutlined className="text-info" /> <br /> Total: $
                {cartTotal}
              </>,
              <>
                <CheckOutlined className="text-info" /> <br /> Total payable: $
                {(payable / 100).toFixed(2)}
              </>,
            ]}
          />
        </div>
        <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
          <CardElement
            id="card-element"
            options={cartStyle}
            onChange={handleChange}
          />
          <button
            className="stripe-button"
            disabled={processing || disabled || succeeded}
          >
            <span id="button-text">
              {processing ? (
                <div className="spinner" id="spinner"></div>
              ) : (
                "Pay"
              )}
            </span>
          </button>
          <br />
          {error && (
            <div className="card-error" role="alert">
              {error}
            </div>
          )}
          <br />
          <p className={succeeded ? "result-message" : "result-message hidden"}>
            Payment Successful.{" "}
            <Link to="/user/history">See it in your purchase history</Link>
          </p>
        </form>
      </>
    );
}

export default StripeCheckout
