import { h, Component } from 'preact';
import style from './style.css';

export default class ContactsList extends Component {
	render() {
		return (
			<div class={`${style.foo} page`}>
				Contacts
			</div>
		);
	}
}
