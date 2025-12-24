import { useState } from "react";
import { NavLink } from "react-router-dom";

import { FaSuitcaseRolling } from "react-icons/fa";

import { FaHome } from "react-icons/fa";
import { FaBusAlt } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";

export default function Sidebar() {
  const [showPopup, setshowPopup] = useState(false);
  return (
    <div className="side-bar">
      <div

        className="img" onClick={() => setshowPopup(true)}>

      </div>
      <p>Complaints app</p>
      <div >
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? " item-ee active" : "item-ee"}
        >Employee<FaHome className="icon" /></NavLink>


        

        <NavLink to="/dashboard/bus" activeClassName="active"
          className="item-ee"> ppppppp <FaBusAlt className="icon" /></NavLink >

        <NavLink to="/dashboard/driver" activeClassName="active"
          className="item-ee">pppppppp<FaUserCog className="icon" /> </NavLink >


        <NavLink to="/dashboard/graph" activeClassName="active"
          className="item-ee">pppppp <FaUserCog className="icon" /> </NavLink >


        {/* البوب أب */}
        {showPopup && (
          <div className="modal-overlay" onClick={() => setshowPopup(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="close-button" onClick={() => setshowPopup(false)}>×</button>
              <h3>الملف الشخصي</h3>
              <div className="proimg">
                <div className="profile-image"></div>
                <div className="edit-image"> تعديل الصورة</div>
              </div>
              <form className="formp">
                <label htmlFor="1">الاسم : </label>
                <input type="text" id="1" placeholder="sarah taya"
                  autoComplete="new-email"
                  name="new-email"
                ></input>


                <label htmlFor="2"> البريد الالكتروني: </label>
                <input type="email" placeholder="sarataya@gmail.com" id="2"
                  autoComplete="new-email"
                  name="new-email"
                ></input>



                <label htmlFor="3">الرقم : </label>
                <input type="email" placeholder="09965543114" id="3"
                  autoComplete="new-email"
                  name="new-email"
                ></input>

                <label htmlFor="4">تاريخ الميلاد  : </label>
                <input type="email" placeholder="4/7/2003" id="4"
                  autoComplete="new-email"
                  name="new-email"
                ></input>
                <button type="submit"> حفظ التعديلات</button>
              </form>
            </div>
          </div>
        )}
      </div>



    </div>

  );
}





