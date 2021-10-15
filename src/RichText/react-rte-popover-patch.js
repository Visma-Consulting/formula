import InputPopover from 'react-rte/lib/ui/InputPopover';
import './styles.css';

// Remove when this is available:
// import https://github.com/sstur/react-rte/pull/399/files

const { componentDidMount, componentWillUnmount } = InputPopover.prototype;

InputPopover.prototype.componentDidMount = function () {
  componentDidMount.call(this);
  document.removeEventListener('click', this._onDocumentClick);
  document.addEventListener('click', this._onDocumentClick, true);
};

InputPopover.prototype.componentWillUnmount = function () {
  componentWillUnmount.call(this);
  document.removeEventListener('click', this._onDocumentClick, true);
};
