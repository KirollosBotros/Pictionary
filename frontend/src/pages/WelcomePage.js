import { isWidthDown } from '@material-ui/core'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class WelcomePage extends Component {
    render() {
        //const WIDTH = window.innerWidth;
        //const HEIGHT = window.innerHeight;
        const firstBtn = {
            textAlign: 'center',
            display: 'block',
            margin: '0 auto',
            width: '13%',
            marginBottom: '70px',
            marginTop: '200px'
        }
        const secondBtn = {
            textAlign: 'center',
            display: 'block',
            margin: '0 auto',
            width: '13%'
        }

        return (
            <div>
                <h1 style={{textAlign: 'center', marginTop: '20px'}}>Welcome to Pictionary!</h1>
                <h2 style={{textAlign: 'center', marginTop: '20px'}}>Made by Kirollos Botros</h2>
                <Link to='/create-game' type="button" style={firstBtn} className="btn btn-primary">Create Game</Link>
                <Link to ='/join-game' type="button" style={secondBtn} className="btn btn-success">Join Game</Link>
            </div>
        )
    }
}

export default WelcomePage