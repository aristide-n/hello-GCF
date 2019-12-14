import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import LayoutGrid from 'preact-material-components/LayoutGrid';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/LayoutGrid/style.css';
import 'preact-material-components/Button/style.css';
import style from './style.css';

export default class Home extends Component {
	render() {
		return (
			<div class={`${style.home} page`}>
				<LayoutGrid>
					<LayoutGrid.Inner>
						<LayoutGrid.Cell cols="4" />
						<LayoutGrid.Cell cols="4">
							<Card>
								<div class={style.cardBody}>
									<h3>
										When Available helps you share your schedule with your contacts and see theirs
									</h3>
								</div>
								<Card.ActionButton>Sign In with Google</Card.ActionButton>
							</Card>
						</LayoutGrid.Cell>
						<LayoutGrid.Cell cols="4" />
					</LayoutGrid.Inner>
				</LayoutGrid>
			</div>
		);
	}
}
