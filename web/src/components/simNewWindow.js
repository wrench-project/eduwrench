import React from 'react';
import ReactDOM from 'react-dom';

// function copyStyles(src, dest) {
//   Array.from(src.styleSheets).forEach(styleSheet => {
//     dest.head.appendChild(styleSheet.ownerNode.cloneNode(true))
//   })
//   Array.from(src.fonts).forEach(font => dest.fonts.add(font))
// }

function copyStyles(src, dest) {
  Array.from(src.styleSheets).forEach((styleSheet) => {
    const styleElement = styleSheet.ownerNode.cloneNode(true);
    styleElement.href = styleSheet.href;
    dest.head.appendChild(styleElement);
  });
  Array.from(src.fonts).forEach((font) => dest.fonts.add(font));
}

class SimNewWindow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { win: null, el: null };
  }

  componentDidMount() {
    let win = window.open('', '', 'width=1000,height=1000');
    copyStyles(window.document, win.document);
    win.document.title = 'Portal Simulator Window';
    let el = document.createElement('div');
    win.document.body.appendChild(el);
    this.setState({ win, el });
  }

  componentWillUnmount() {
    this.state.win.close();
  }

  render() {
    const { el } = this.state;
    if (!el) {
      return null;
    }
    return ReactDOM.createPortal(this.props.children, el);
  }
}

export default SimNewWindow