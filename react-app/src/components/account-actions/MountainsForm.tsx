import { useEffect, useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthProps, mountainsObj } from '../../types.d';
import { mountains as mountainsRef } from '../../mountains';

const MountainsForm = ({ user }: AuthProps) => {
  useEffect(() => {
    if (user) {
      console.log(user);
      setMountains(user.mountains);
    }
  }, [user]);

  const [mountains, setMountains] = useState<mountainsObj>();
  const [password, setPassword] = useState<string>('');

  const updateMountains = (mountain: keyof mountainsObj) => {
    let tempMountains = mountains as mountainsObj;
    tempMountains[mountain]
      ? (tempMountains[mountain] = 0)
      : (tempMountains[mountain] = mountainsRef[mountain]);
    setMountains(tempMountains);
  };

  const [posting, setPosting] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosted(false);
    if (user) {
      try {
        console.log('posting');
        setPosting(true);
        const response = await fetch('/users', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone,
            emailAlert: user.emailAlert,
            textAlert: user.textAlert,
            password,
            mountains,
          }),
        });
        console.log(response);
        if (response.ok) {
          console.log('updated');
          setPostError(undefined);
          setPosted(true);
          setPassword('');
        } else if (response.status === 401) {
          setPostError('Incorrect password.');
        } else {
          setPostError('Bad request. Password incorrect');
        }
        setPosting(false);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log('Not logged in');
    }
  };

  return (
    <section id="mountains-form">
      {/*     {!user && <Navigate to="/home" />} */}
      <h1>My Mountains</h1>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        {mountains && (
          <>
            <div className="form-field-check">
              <input
                type="checkbox"
                name="vail"
                defaultChecked={
                  mountains['Vail'] && mountains['Vail'] > 0 ? true : false
                }
                value={mountains['Vail']}
                onChange={() => updateMountains('Vail')}
              />
              <label htmlFor="vail">Vail</label>
            </div>
            <div className="form-field-check">
              <input
                type="checkbox"
                name="keystone"
                defaultChecked={
                  mountains['Keystone'] && mountains['Keystone'] > 0
                    ? true
                    : false
                }
                value={mountains['Keystone']}
                onChange={() => updateMountains('Keystone')}
              />
              <label htmlFor="keystone">Keystone</label>
            </div>
            <div className="form-field-check">
              <input
                type="checkbox"
                name="breckenridge"
                defaultChecked={
                  mountains['Breckenridge'] && mountains['Breckenridge'] > 0
                    ? true
                    : false
                }
                value={mountains['Breckenridge']}
                onChange={() => updateMountains('Breckenridge')}
              />
              <label htmlFor="breckenridge">Breckenridge</label>
            </div>
          </>
        )}
        <div className="form-field">
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!posting && <button className="submit">Save</button>}
          {posting && (
            <div className="posting">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        {postError && <p className="post-error">{postError}</p>}
        {posted && <p className="posted">Mountains updated successfully.</p>}
      </form>
    </section>
  );
};

export default MountainsForm;
