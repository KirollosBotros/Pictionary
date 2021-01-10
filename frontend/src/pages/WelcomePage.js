import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class WelcomePage extends Component {
    render() {
        //const WIDTH = window.innerWidth;
        //const HEIGHT = window.innerHeight;
        const firstBtn = {
            textAlign: 'center',
            display: 'inline-block',
            position: 'absolute',
            top: '40%',
            left: '42%',
            marginRight: '80px'
        }
        const secondBtn = {
            textAlign: 'center',
            display: 'inline-block',
            position: 'absolute',
            top: '40%',
            left: '42%',
            marginLeft: '150px'
        }

        return (
            <div>
                <Link to='/create-game' type="button" style={firstBtn} className="btn btn-primary">Create Game</Link>
                <Link to ='/join-game' type="button" style={secondBtn} className="btn btn-success">Join Game</Link>
            </div>
        )
    }
}

export default WelcomePage