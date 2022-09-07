import { useState, useEffect } from 'react';
import { AuthProps, mountainsObj } from '../types.d';
import MountainWeather from './MountainWeather';
import Loading from './Loading';

const Forecast = ({ user }: AuthProps) => {
  const [mountains, setMountains] = useState<mountainsObj>();
  const [loaded, setLoaded] = useState<boolean>(false);

  const completeLoading = () => {
    setLoaded(true);
  };

  const getMountains = async () => {
    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMountains(data.mountains);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMountains();
  }, [user]);

  return (
    <section id="forecast">
      <div className="background-image"></div>
      <div className="content">
        <h1>My Mountain Forecasts</h1>
        {!user && (
          <h2 className="no-user">
            Log in to view the weather at your mountains.
          </h2>
        )}
        {!loaded && user && <Loading />}
        <div className="weather">
          {mountains &&
            Object.keys(mountains).map((key) => {
              const mountain = key as keyof mountainsObj;
              return (
                <MountainWeather
                  key={mountain}
                  name={mountain}
                  location={mountains[mountain] as number}
                  completeLoading={completeLoading}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Forecast;
