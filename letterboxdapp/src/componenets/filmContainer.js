import React from 'react';

class Film extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            title,
            poster,
            link,
            rating
        } = this.props;
        let fullLink = "https://letterboxd.com/" + link;
        return (
            <a href={fullLink} target="_blank" >
            <li className="film-poster">
                <img src={poster} className="film-image"></img>
                <div href={fullLink} target="_blank">{title}</div>
                <div>{rating}</div>
            </li>
            </a>
        );
    }
}

export default Film