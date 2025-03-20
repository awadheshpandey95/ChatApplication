import bg from '../assets/logobg.svg';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
    <div className="Home application-bg-color">
      <div className="image">
        <img className = "imgg" src={bg} alt = "text"/>
      </div>
      <div className='pt-5 px-5 text-light'>
        <h1>
            Welcome To Chat Buddy
        </h1>
        <h3>
            Connect With Your Friends In just one Click...
        </h3>
      </div>

      <Link to="/Signup">
        <button className="SignUpBtn">
          Signup
        </button>
      </Link>
      <Link to="/Login">
        <button className="LoginBtn">
          Login
        </button>
      </Link>
    </div>
    </>
  );
}

export default Home;
