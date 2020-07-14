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
            <li>
                <img src={poster} href={link}></img>
                <a>{title}</a>
                <a>{rating}</a>
            </li>
        );
    }
}

export default Film