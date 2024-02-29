import React from 'react';
import PropTypes from 'prop-types';
import createObjectWithProperties from './createObjectWithProperties';
require('../../../themes/react-data-grid-header.css');

// The list of the propTypes that we want to include in the Draggable div
const knownDivPropertyKeys = ['onDragStart', 'onDragEnd', 'onDrag', 'style'];

class Draggable extends React.Component {
  static propTypes = {
    onDragStart: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrag: PropTypes.func,
    component: PropTypes.oneOfType([PropTypes.func, PropTypes.constructor]),
    style: PropTypes.object
  };

  static defaultProps = {
    onDragStart: () => true,
    onDragEnd: () => {},
    onDrag: () => {}
  };

  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      drag: null
    };
  }

  componentWillUnmount() {
    this.cleanUp();
  }

  onMouseDown = e => {
    const drag = this.props.onDragStart(e);
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (drag === null && e.button !== 0) {
      return;
    }

    const doc = this.myRef.current.ownerDocument;
    const win = doc.defaultView || doc.parentWindow;

    win.addEventListener('mouseup', this.onMouseUp);
    win.addEventListener('mousemove', this.onMouseMove);
    win.addEventListener('touchend', this.onMouseUp);
    win.addEventListener('touchmove', this.onMouseMove);

    this.setState({ drag });
  };

  onMouseMove = e => {
    if (this.state.drag === null) {
      return;
    }

    if (e.preventDefault) {
      e.preventDefault();
    }

    this.props.onDrag(e);
  };

  onMouseUp = e => {
    this.cleanUp();
    this.props.onDragEnd(e, this.state.drag);
    this.setState({ drag: null });
  };

  cleanUp = () => {
    const doc = this.myRef.current.ownerDocument;
    const win = doc.defaultView || doc.parentWindow;
    win.removeEventListener('mouseup', this.onMouseUp);
    win.removeEventListener('mousemove', this.onMouseMove);
    win.removeEventListener('touchend', this.onMouseUp);
    win.removeEventListener('touchmove', this.onMouseMove);
  };

  getKnownDivProps = () => {
    return createObjectWithProperties(this.props, knownDivPropertyKeys);
  };

  render() {
    return (
      <div
        {...this.getKnownDivProps()}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
        className="react-grid-HeaderCell__draggable"
        ref={this.myRef}
      />
    );
  }
}

module.exports = Draggable;
