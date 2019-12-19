import template from './template'
import components from './components'

export default (data) => template(components.articles(data));

