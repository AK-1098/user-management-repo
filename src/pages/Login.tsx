import "./LoginPage.css";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
export const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log({ email, password, rememberMe });
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate("/users");
    } else {
      // window.Error(error)
      alert("InVaild User");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="title">Log in</h2>

        <div className="input-group">
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="input-wrapper">
            <span className="icon">📧</span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eve.holt@reqres.in"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="input-wrapper">
            <span className="icon">🔒</span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
        </div>

        <div className="checkbox-group">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>

        <button type="submit" className="submit-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
