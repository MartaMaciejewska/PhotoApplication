import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route} from 'react-router-dom';
import './scss/main.scss';
import Main from './components/Main.jsx';
import Section from './components/Section.jsx'


class App extends Component {
    render() {
        return <HashRouter>
            <div>
            <Route exact path='/' component={Main} />
            <Route path='/:section' component={Section} />
            </div>
            </HashRouter>;
         }
    }

  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
