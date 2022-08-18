import { Http2ServerRequest } from 'http2';
import { AuthProps, mountainsObj } from '../types.d';
import MountainWeather from './MountainWeather';

const Conditions = ({ user }: AuthProps) => {
  return (
    <section id="conditions">
      <div className="background-image"></div>
      <div className="content">
        <h1>My Mountain Forecasts</h1>
        {!user && (
          <h2 className="no-user">
            Log in to view the weather at your mountains.
          </h2>
        )}
        <div className="weather">
          {user &&
            Object.keys(user.mountains).map((key) => {
              const mountain = key as keyof mountainsObj;
              if (user.mountains[mountain] == undefined) return;
              return (
                <MountainWeather
                  key={mountain}
                  name={mountain}
                  location={user.mountains[mountain] as number}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Conditions;
