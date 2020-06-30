import React from 'react';
import logo from './assets/logo.svg';
import arrowRight from './assets/arrowright.svg';
import './App.css';

function App() {
  const [username, setValue] = React.useState('');
  const [usernames, setUsername] = React.useState([]);
  const [data, setData] = React.useState();
  const [header, setHeader] = React.useState(true);
  const [main, setMain] = React.useState(false);
  let headerClass;
  let mainClass;

  headerClass = header ? 'App-header':'hideHeader';
  mainClass = main ? 'mainPage' : 'hideMain';

  function handleHeader(event) {
    setHeader(false);
    setMain(true);
  };

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleSubmit(event) {
    if(username) {
      setUsername(usernames.concat(username));
    }

    event.preventDefault();
    setValue('');
  }

  function handleClear(event) {
    setUsername([]);
  }
  return (
    <div className="App">
      <header className={headerClass}>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to <a href="fleapit.com/about">Fleapit</a></h1>
        <p>
          Find movies to watch with your friends using your <a href="https://letterboxd.com/" target="_blank"><code>Letterboxd</code></a> username!
        </p>
        <div className="getstarted" onClick={handleHeader}>
          <a>Get Started</a>
          <img src={arrowRight} />
        </div>
      </header>
      <div className={mainClass}>
        <form onSubmit={handleSubmit}>
          <input className="inputbox" type="text" value={username} onChange={handleChange} />
          <button type="submit" className="button"> Add Username </button>
        </form>
        <button type="clear" className="button" onClick={handleClear}>clear</button>
        <ul className="no-bullets">
          {usernames.map(item => (
            <li className="username" key={item}> <a href={"https://letterboxd.com/" + item} target="_blank">{item}</a> </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
