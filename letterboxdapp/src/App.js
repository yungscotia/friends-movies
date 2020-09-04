import React from 'react';
import logo from './assets/logo.svg';
import arrowRight from './assets/arrowright.svg';
import './App.css';
import Axios from 'axios';
import Loader from 'react-loader-spinner';

import Film from './components/filmContainer';
import SideBar from './components/sidebar.js';
import DataContainer from './components/dataContainer.js';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      usernames: [],
      data: new Map(),
      header: true,
      main: false,
      loading: false,
      canceled: false,
      activeTab: '',
      renderedData: [],
      menuOpen: false,
      dataTab: 'dataTabBeforeOpen'
    }
    this.isOpen = false;
    this.shouldMenuOpen = false;
    //binding functions
    this.handleHeader = this.handleHeader.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.getData = this.getData.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.clearTypedValue = this.clearTypedValue.bind(this);
    this.deleteUsername = this.deleteUsername.bind(this);
    }
  
    handleHeader() {
      this.setState({header: false});
      this.setState({main: true});
      setTimeout(() => {
        this.setState({
          menuOpen: true,
          dataTab: 'dataTabAfterOpen'
        });}, 2280);
        /*
        setTimeout(() => {
          this.setState({
            dataTab: 'dataTabAfterOpen'
          });}, 2100);
        */
      
    };
    
    handleChange(event) {
      this.setState({username: event.target.value});
    }
  
    async getData(username) {
      this.setState({
        canceled: false,
        loading: true
      })
      const response = await Axios.get("http://localhost:8080/" + username);
      const text = await response.data;
      //setLoading(false);
      return text;
    };
  
    async handleSubmit(event) {
      const input = this.state.username;
      if(this.state.username) {
        this.setState({usernames : this.state.usernames.concat(this.state.username)});
      }
      this.setState({username: ''});
      event.preventDefault();
      let temp = this.state.data;
      temp.set(input, await this.getData(input));
      this.setState(
        {
          data: temp,
          activeTab: input,
          loading: false
        });
      console.log(this.state.data, this.state.data.size);
    }
  
    handleClear(event) {
      this.setState({
        usernames: [],
        data: new Map(),
        loading: false,
        cancel: true
      })
    }

    handleTabClick(user) {
      console.log(user);
      this.setState({
        activeTab: user
      });
    }

    clearTypedValue(event) {
      this.setState({username: ''});
    }

    deleteUsername(user) {
      let new_usernames = this.state.usernames.filter(name => name != user);
      this.setState({usernames: new_usernames});
      if(this.state.data.size == 1) {
        this.setState({data: new Map()});
      } else {
        let temp = this.state.data;
        temp.delete(user);
        this.setState({activeTab: this.state.usernames[0]});
        this.setState({data: temp});
      }
      console.log('new usernames', new_usernames);
      console.log('data after delete', this.state.data);
    }

    render() {
      let headerClass = this.state.header ? 'App-header':'hideHeader';
      let mainClass = this.state.main ? 'mainPage' : 'hideMain';
      this.shouldMenuOpen = this.state.menuOpen ? true : false;
      /*
      if(this.state.loading) {
        this.state.renderedData = (
          <div className="loader">
            <Loader 
              type="Grid"
              color="#0070f3"
              height="10vh"
              width="10vh"
            />
          </div>
        );
      } else if(this.state.canceled) {
          this.state.renderedData = (<div>No Username Inputted</div>);
      } else if(this.state.data.size != 0) {
          console.log(this.state.activeTab, this.state.data);
          let activeTabData = this.state.data.get(this.state.activeTab);
          this.state.renderedData = activeTabData.map(film => 
            (<Film title={film.title} poster={film.poster} link={film.link} rating={film.user_rating}/>));
      } else {
          this.state.renderedData = (<code>No Username Inputted</code>);
      }
      */
      
      return (
        <div className="App">
          <header className={headerClass}>
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Welcome to <a href="fleapit.com/about">Fleapit</a></h1>
            <p>
              Find movies to watch with your friends using your <a href="https://letterboxd.com/" target="_blank"><code>Letterboxd</code></a> username!
            </p>
            <div className="getstarted" onClick={this.handleHeader}>
              <a>Get Started</a>
              <img src={arrowRight} />
            </div>
          </header>
          <div className={mainClass}>
            <SideBar shouldMenuOpen={this.shouldMenuOpen} clearTypedValue={this.clearTypedValue} deleteUsername={this.deleteUsername} handleChange={this.handleChange} handleSubmit={this.handleSubmit} handleClick={this.handleTabClick} users={this.state.usernames} typedValue={this.state.username} pageWrapId={"dataTab"} outerContainerId={mainClass} isOpen={this.state.menuOpen}/>
            <div className={this.state.dataTab}>
              <DataContainer loading={this.state.loading} canceled={this.state.canceled} activeTab={this.state.activeTab} data={this.state.data} />
            </div>
            
          </div>
      </div>
      );
    }
}




/*

function App() {
  const [username, setValue] = React.useState('');
  const [usernames, setUsername] = React.useState([]);
  const [data, setData] = React.useState({});
  const [header, setHeader] = React.useState(true);
  const [main, setMain] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [canceled, setCancel] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState();
  
  let headerClass;
  let mainClass;
  let renderedData;
  setData(new Map());

  if(loading) {
    renderedData = (
      <div className="loader">
        <Loader 
          type="Grid"
          color="#0070f3"
          height="10vh"
          width="10vh"
        />
      </div>
    );
  } else if(canceled) {
      renderedData = (<div>No Username Inputted</div>);
  } else if(data.size != 0) {
      console.log(activeTab, data);
      let activeTabData = data.get(activeTab);
      renderedData = activeTabData.map(film => 
        (<Film title={film.title} poster={film.poster} link={film.link} rating={film.user_rating}/>));
  } else {
      console.log(data, data.size);
      renderedData = (<div>No Username Inputted</div>);
  }

  headerClass = header ? 'App-header':'hideHeader';
  mainClass = main ? 'mainPage' : 'hideMain';

  function handleHeader(event) {
    setHeader(false);
    setMain(true);
  };

  function handleChange(event) {
    setValue(event.target.value);
  }

  async function getData(username) {
    setCancel(false);
    setLoading(true);
    const response = await Axios.get("http://localhost:8080/" + username);
    const text = await response.data;
    //setLoading(false);
    return text;
  };

  async function handleSubmit(event) {
    const input = username;
    if(username) {
      setUsername(usernames.concat(username));
    }
    setValue('');
    event.preventDefault();
    let temp = data;
    temp.set(input, await getData(input));
    setData(await temp);
    console.log(data, data.size);
    setLoading(false);
    setActiveTab(input);
  }

  function handleClear(event) {
    setUsername([]);
    setData(new Map());
    setLoading(false);
    setCancel(true);
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
        <div className="data">
          <h2>data</h2>
          <ul className="no-bullets">
            {renderedData}
          </ul>
        </div>
        
      </div>
    </div>
  );
}
*/

export default App;

