import React from 'react';
import Loader from 'react-loader-spinner';
import Film from './filmContainer.js';

class DataContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() { 
        let renderedData;
        let profile = "https://secure.gravatar.com/avatar/ed5e00a3fdcc2e08b9070a26d2a11a07?rating=PG&size=220&border=&default=https%3A%2F%2Fs.ltrbxd.com%2Fstatic%2Fimg%2Favatar220.486f8632.png";
        let header;
        if(this.props.loading) {
            profile = '';
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
        } else if(this.props.canceled) {
            header = (
                <h2 className="dataHeader"><code>No Usernames Inputted</code></h2>
            );
            renderedData = (<code>add a username on the left!</code>);
        } else if(this.props.data.size != 0) {
            let activeTabData = this.props.data.get(this.props.activeTab);
            console.log(activeTabData);
            profile = activeTabData.profile;
            header = (
                <h2 className="dataHeader"><code>{`${this.props.activeTab}'s Films`}</code></h2>
            );
            renderedData = activeTabData.data.map(film => 
                (
                    <Film title={film.title} poster={film.poster} link={film.link} rating={film.user_rating}/>)
                );
        } else {
            header = (
                <h2 className="dataHeader"><code>No Usernames Inputted</code></h2>
            );
            renderedData = (<code>add a username on the left!</code>);
        }
        return ( 
            <div className="dataContainer">
                <img src={profile} className="rounded-image"/>
                {header}
                <div>
                {renderedData}
                </div>
            </div> 
         );
    }
}
 
export default DataContainer;