import template from './template';
import * as components from './components';
import * as svg from '../data/svgGraphicData';

export default message =>
  template(
    <div class="container">
      {components.drawGraphic(svg.data)}
      {components.sayMessage(message)}
    </div>
  );
