import React, { Component, PropTypes } from 'react'
import { View } from 'react-native'
import { Parser } from 'commonmark'
import ReactRenderer from 'commonmark-react-renderer'
import renderers from './renderers'
import _ from 'lodash'

var parser = new Parser()

class Markdown extends Component {
  static propTypes = {
    style: View.propTypes.style,
    containerProps: PropTypes.object,
    source: PropTypes.string.isRequired,
    containerComponent: PropTypes.func,
    childBefore: PropTypes.object,
    childAfter: PropTypes.object,
    sourcePos: PropTypes.bool,
    escapeHtml: PropTypes.bool,
    skipHtml: PropTypes.bool,
    softBreak: PropTypes.string,
    allowNode: PropTypes.func,
    allowedTypes: PropTypes.array,
    disallowedTypes: PropTypes.array,
    transformLinkUri: PropTypes.func,
    unwrapDisallowed: PropTypes.bool,
    renderers: PropTypes.object,
    walker: PropTypes.func,
  }

  static defaultProps = {
    containerComponent: View,
    renderers: {}
  }

  render() {

    // use default renderers overriden by this.props.renderers (default {})
    _.merge(this.props.renderers, renderers, _.cloneDeep(this.props.renderers))

    const containerProps = this.props.containerProps || {}
    const renderer = new ReactRenderer(this.props)
    const ast = parser.parse(this.props.source || '')

    if (this.props.walker) {
      const walker = ast.walker()
      let event

      while ((event = walker.next())) {
        this.props.walker.call(this, event, walker)
      }
    }

    if (this.props.style) {
      containerProps.style = this.props.style
    }

    return React.createElement.apply(
      React,
      [this.props.containerComponent, containerProps, this.props.childBefore]
        .concat(
          renderer
            .render(ast)
            .concat([this.props.childAfter])
        )
    )
  }
}

export default Markdown
