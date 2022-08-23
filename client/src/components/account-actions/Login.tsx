import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthProps } from '../../types.d';

const Login = ({ user, getUser }: AuthProps) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [emailErr, setEmailErr] = useState<string>();
  const [passwordErr, setPasswordErr] = useState<string>();

  const [posting, setPosting] = useState<boolean>(false);
  const [postResponse, setPostResponse] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setPosting(true);
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (getUser) getUser(data.user);
      if (response.ok) {
        setPostResponse(undefined);
      } else if (response.status === 401) {
        setPostResponse('Invalid email or password.');
      } else {
        setPostResponse('Error logging in. Please try again.');
      }
      setPosting(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="login">
      {user && <Navigate to="/" />}
      <div className="background-image"></div>
      <div className="content">
        <h1>Log In</h1>
        <form action="" onSubmit={handleSubmit} noValidate>
          <Link to="/signup">Don't have an account? Signup</Link>
          <p>* Required field</p>
          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                !email.match(
                  /([a-zA-Z0-9+._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
                )
                  ? setEmailErr('Enter a valid email.')
                  : setEmailErr(undefined);
              }}
            />
            {emailErr && <p className="error">{emailErr}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              onBlur={(e) => {
                e.target.className = 'touched';
                !password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/gi)
                  ? setPasswordErr(
                      'Password must be at least 6 characters with 1 letter and 1 number.'
                    )
                  : setPasswordErr(undefined);
              }}
            />
            {passwordErr && <p className="error">{passwordErr}</p>}
          </div>
          {!posting && <button>Log In</button>}
          {posting && (
            <div className="posting">
              <div className="spinner"></div>
            </div>
          )}
          {postResponse && <p className="response">{postResponse}</p>}
        </form>
      </div>
    </section>
  );
};

export default Login;
