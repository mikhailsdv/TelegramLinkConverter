import React, {Fragment, Component, createRef} from "react";
import {Helmet} from "react-helmet";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import copy from 'copy-to-clipboard';

import favicon32x32 from "../../img/logo/favicon-32x32.png";
import favicon16x16 from "../../img/logo/favicon-16x16.png";
import androidChrome192x192 from "../../img/logo/android-chrome-192x192.png";
import safariPinnedTab from "../../img/logo/safari-pinned-tab.svg";

import styles from "./index.module.scss";

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: "",
			isConverted: false,
			isCopied: false
		};

		this.input = createRef();
		
		this.handlers = {
			getPathUsername: () => {
				return window.location.pathname.substr(1) || false;
			},
			onInput: e => {
				if (this.state.isConverted) {
					this.setState({
						url: e.target.value.trim(),
						isConverted: false,
						isCopied: false
					});
				}
				else {
					this.setState({
						url: e.target.value.trim()
					});
				}
			},
			isValidUrl: url => {
				return /^((https?:\/\/)?t\.me\/)?[a-zA-Z0-9_]+$/.test(url);
			},
			convert: () => {
				if (this.handlers.isValidUrl(this.state.url)) {
					let url = this.state.url.replace(/^((https?:\/\/)?t\.me\/)?(.*)$/, `${this.data.baseDomain}/$3`);

					this.setState({
						isConverted: true,
						url: url
					}, () => {
						this.input.current.select();
					});
				}
			},
			copy: () => {
				if (copy(this.state.url)) {
					this.setState({
						isCopied: true
					});
				}
			}
		};

		this.data = {
			baseDomain: "t.mishasaidov.com"
		};
	}

	componentDidMount() {
		let pathUsername = this.handlers.getPathUsername();
		if (pathUsername) {
			let link = document.createElement("a");
			link.setAttribute("href", `tg://resolve?domain=${pathUsername}`);
			link.click();
		}
	}

	render() {
		let pathUsername = this.handlers.getPathUsername();

		return (
			<Fragment>
				<Helmet>
					<link rel="icon" type="image/png" sizes="32x32" href={favicon32x32} />
					<link rel="icon" type="image/png" sizes="16x16" href={favicon16x16} />
					<link rel="mask-icon" href={safariPinnedTab} color={this.data.mainColor} />
				</Helmet>

				<Switch>
					<Route exact path="/" render={props => (
						<div className={styles.center}>
							<div className={styles.wrapper}>
								<div className={styles.inputRow}>
									<input className={styles.input} placeholder="t.me/username" value={this.state.url} onChange={this.handlers.onInput} ref={this.input} />
									{this.state.isConverted ? 
										<button className={styles.copyButton} data-copied={this.state.isCopied} onClick={this.handlers.copy}>{this.state.isCopied ? "👌" : "Скопировать"}</button>
										:
										<button className={styles.convertButton} onClick={this.handlers.convert}>Конвертировать</button>
									}
								</div>
							</div>
						</div>
					)} />

					{pathUsername && (
						<Route exact path={`/${pathUsername}`}>
							<div className={styles.center}>
								<div className={styles.openInWrapper}>
									<div className={styles.telegramIcon}>
										<img src={androidChrome192x192} alt="telegram icon" />
									</div>
									<div className={styles.username}>@{pathUsername}</div>
									<a href={`tg://resolve?domain=${pathUsername}`}>
										<button className={styles.openInTelegram}>Открыть в Telegram</button>
									</a>
									<a href={`https://web.telegram.org/#/im?tgaddr=tg%3A%2F%2Fresolve%3Fdomain%3D${pathUsername}`}>
										<button className={styles.openInTelegramWeb}>Открыть в браузере</button>
									</a>
								</div>
							</div>
						</Route>
					)}

					<Route exact path="*" render={props => <Redirect to="/" />} />
				</Switch>

				<div className={styles.made}>
					Мэйд виз <span role="img" aria-label="love">❤️</span> бай <a href="https://mishasaidov.com" className={styles.link}>Миша Саидов</a>
				</div>
			</Fragment>
		);
	}
}

export default withRouter(App);