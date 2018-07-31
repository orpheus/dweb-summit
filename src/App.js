import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Index} from 'oip-index'
import Account from 'oip-account'

class App extends Component {
    constructor() {
        super();

        this.state = {
            account: undefined,
            wallet: undefined,
            network: new Index()
        }
        this.login = this.login.bind(this)
        this.fetchArtifacts = this.fetchArtifacts.bind(this)
    }

        componentDidMount() {
            let account = new Account("ryan+demo@alexandria.io", 'password', {discover: false, store_in_keystore: true, keystore_url: "https://mk1.alexandria.io/keystore"})
            account.create()
                .then(acc => {
                    this.setState({
                        account: account,
                        account_info: acc,
                        wallet: account.wallet
                    })
                })
                .catch(() => {
                    account.login()
                        .then(succ => {
                            this.setState({
                                account: account,
                                account_info: succ,
                                wallet: account.wallet
                            })
                        })
                        .catch(err => {
                            console.log(err)
                        })

                })
        }

        login() {
            let a = this.state.account;
            let m = this.state.wallet.getMnemonic();
            a ? a.login(m).then(s => {
                let addresses = [];
                for (let i = 0; i <= 5; i++) {
                    addresses.push(a.wallet.getCoin("bitcoin").getAddress(0, 0, i).getPublicAddress())
                }
                this.setState({
                    isLoggedIn: true,
                    loginDetails: s,
                    addresses: addresses
                })
            }).catch(err => {
                this.setState({
                    isLoggedIn: false,
                    loginError: true,
                    loginErrorMessage: err
                })
            }) : null
        }
        fetchArtifacts() {
            this.state.network.getLatestArtifacts(22)
                .then(arts => {
                    this.setState({
                        artifacts: arts
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
  render() {
        let render = !!this.state.account;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Decentralized Web Summit!</h1>
        </header>
        <div className="row m-3 d-flex justify-content-center">
            <div className="mr-3"><b>My Mnemonic</b></div>
            <div className="">{render ? this.state.wallet.getMnemonic() : null}</div>
        </div>
        <div className="row m-3 d-flex justify-content-center">
           <button onClick={this.login} className="btn btn-large btn-success">Login, yeah!</button>
        </div>
          <div className="row m-3 d-flex justify-content-center">
              {this.state.isLoggedIn ? <h4>YEW! We're logged into an account with a full functioning wallet with just 12 words!</h4> :
                  this.state.loginError ? <h4>I blame someone else</h4> : "waiting for account..." }
          </div>
          {/*Display Addresses*/}
          <div className="row m-3 d-flex center">
              <table className="table">
                  <thead className="thead-dark">
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">Bitcoin Address</th>

                  </tr>
                  </thead>
                  <tbody>
                  {!!this.state.addresses ? this.state.addresses.map( (a,i) => {
                      return (<tr key={i}>
                              <th scope="row">{i}</th>
                              <td>{a}</td>
                          </tr>)
                      }) :
                      <tr>
                          <th scope="row">0</th>
                          <td>Addr</td>
                      </tr>
                  }
                  </tbody>
              </table>
          </div>
          <div className="row m-3 d-flex justify-content-center">
              <button onClick={this.fetchArtifacts} className="btn btn-large btn-danger">Let's fetch some artifacts</button>
          </div>
          <hr className="my-5" />
          <div className="row m-3 d-flex justify-content-center">
              <table className="table">
                  <thead className="thead-dark">
                  <tr>
                      <th scope="col">#</th>
                      <th scope="col">TXID</th>
                      <th scope="col">Title</th>
                      <th scope="col">Artist</th>
                  </tr>
                  </thead>
                  <tbody>
                  {!!this.state.artifacts ? this.state.artifacts.map( (art, i) => {
                      return (
                          <tr key={i}>
                              <th scope="row">{i}</th>
                              <td>{art.getTXID()}</td>
                              <td>{art.getTitle()}</td>
                              <td>{art.getDetail("artist")}</td>
                          </tr>
                          )
                  }) : <tr>
                      <th scope="row">0</th>
                      <td>TXID</td>
                      <td>Title</td>
                      <td>Artist</td>
                  </tr>}
                  </tbody>
              </table>
          </div>
      </div>
    );
  }
}

export default App;
