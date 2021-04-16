import React from 'react'
import {Drawer, Button} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import sample from '../../images/sample.jpg'

const SideDrawer = () => {
    const dispatch = useDispatch()
    const {drawer, cart} = useSelector(state=> ({...state}))

const imageStyle = {
    width: '100%', 
    height: '50px',
    objectFit: 'cover'
}


    return (
      <Drawer
        visible={drawer}
        onClose={() => {
          dispatch({ type: "SET_VISIBLE", payload: false });
        }}
        className="text-center"
        title={`Cart / ${cart.length} Product`}
        closable={false}
      >
        {cart.map((p) => {
          return (
            <div key={p._id} className="row">
              <div className="col">
                {p.images[0] ? (
                  <>
                    <img src={p.images[0].url} style={imageStyle} />
                    <p className="text-center bg-secondary text-light">
                      {p.title} X {p.count}
                    </p>
                  </>
                ) : (
                  <>
                    <img src={sample} style={imageStyle} />
                    <p className="text-center bg-secondary text-light">
                      {p.title} X {p.count}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}

        <Link to="/cart">
          <button className="text-center btn btn-primary btn-raised btn-block" onClick={()=>
              dispatch({
                  type: 'SET_VISIBLE',
                  payload: false
              })
          }>Go To Cart</button>
        </Link>
      </Drawer>
    );
}

export default SideDrawer
