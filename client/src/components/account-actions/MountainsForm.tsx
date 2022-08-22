import { useEffect, useState, FormEvent } from 'react';
import { AuthProps, mountainsObj } from '../../types.d';
import { mountains as mountainsRef } from '../../mountains';

const MountainsForm = ({ user }: AuthProps) => {
  const getMountains = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTION_API}/users`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      setMountains(data.mountains);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMountains();
  }, [user]);

  const [mountains, setMountains] = useState<mountainsObj>();
  const [password, setPassword] = useState<string>('');

  const [selectedMountain, setSelectedMountain] =
    useState<keyof mountainsObj>('Breckenridge');

  const addMountain = (mountain: keyof mountainsObj) => {
    let tempMountains = mountains as mountainsObj;
    tempMountains[mountain] = mountainsRef[mountain];
    setMountains({ ...tempMountains });
  };

  const removeMountain = (mountain: keyof mountainsObj) => {
    let tempMountains = mountains as mountainsObj;
    delete tempMountains[mountain];
    setMountains({ ...tempMountains });
  };

  const [posting, setPosting] = useState<boolean>(false);
  const [posted, setPosted] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPosted(false);
    if (user) {
      try {
        setPosting(true);
        const response = await fetch(
          `${process.env.REACT_APP_PRODUCTION_API}/users`,
          {
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
          }
        );
        if (response.ok) {
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
      <h1>My Mountains</h1>
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <div className="form-field">
          <label htmlFor="mountains">Add a mountain:</label>
          <select
            name="mountains"
            value={selectedMountain}
            onChange={(e) => {
              setSelectedMountain(e.target.value as keyof mountainsObj);
              console.log(selectedMountain);
            }}
          >
            {Object.keys(mountainsRef)
              .sort()
              .map((key) => {
                const mountain = key as keyof mountainsObj;
                return (
                  <option key={mountain} value={mountain}>
                    {mountain}
                  </option>
                );
              })}
          </select>
          <button type="button" onClick={() => addMountain(selectedMountain)}>
            Add
          </button>
        </div>
        {mountains && (
          <ol>
            {Object.keys(mountains).map((key) => {
              const mountain = key as keyof mountainsObj;
              return (
                <li key={mountain}>
                  {mountain}{' '}
                  <button
                    type="button"
                    onClick={() => removeMountain(mountain)}
                  >
                    x
                  </button>
                </li>
              );
            })}
          </ol>
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
