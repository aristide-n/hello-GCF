import './style';
import App from './components/app';
import ContactStore from './state/contactStore';

const Root = () => <App contactStore={ContactStore} />;

export default Root;
